// Course-order and startup navigation checks. Run: node tests/navigation.test.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const scriptOrder=["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
 "extra-derivatives.js","extra-applications.js","extra-integrals.js",
 "extra-integral-applications.js","grading-categories.js","course-navigation.js"];
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const htmlIds=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for(const id of ["practiceHome","practiceWorkspace","workspaceActions","startCourse",
 "resumeCourse","unitChoices","courseHome","nextFamily","topicPosition"])assert.ok(htmlIds.has(id),"Missing HTML element: "+id);
const scripts=[...html.matchAll(/<script src="\.\/([^"]+)"/g)].map(m=>m[1]);
assert.ok(scripts.indexOf("course-navigation.js")>scripts.indexOf("problem-bank.js"));
assert.ok(scripts.indexOf("course-navigation.js")<scripts.indexOf("app.js"));
for(const file of scriptOrder)assert.ok(scripts.includes(file),"Missing navigation dependency: "+file);
function createContext(search,sharedStore){
 const elements=new Map;
 const elem=id=>{
  if(!elements.has(id)){
   elements.set(id,{
    id,textContent:"",innerHTML:"",hidden:false,value:"",
    dataset:{},style:{},
    classList:{toggle(){},add(){},remove(){}},
    addEventListener(){},setAttribute(){},querySelector(){return null;},
    appendChild(){},remove(){},
   });
  }
  return elements.get(id);
 };
 const location={protocol:"https:",pathname:"/calcmentor/",search};
 const history={replaceState(_state,_title,url){
  const question=String(url).indexOf("?");
  location.search=question<0?"":String(url).slice(question);
 }};
 const storage=sharedStore||new Map;
 const localStorage={getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value))};
 const document={
  getElementById:elem,querySelectorAll(){return []},querySelector(){return null},
  createElement(){return {innerHTML:"",setAttribute(){},appendChild(){},remove(){},style:{}};}
 };
 const window={addEventListener(){},devicePixelRatio:1};
 const sandbox={window,document,location,history,localStorage,URLSearchParams,
  navigator:{clipboard:{writeText:async()=>{}}},alert(){},confirm(){return true},
  setTimeout(){},URL,Blob,console};
 vm.createContext(sandbox);
 for(const file of scriptOrder)vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
 // Solution renderer is used lazily, so a stub suffices for the navigation test.
 window.CalcSolutions={build:()=>({detailed:true,items:[]})};
 vm.runInContext(fs.readFileSync(path.join(root,"app.js"),"utf8"),sandbox,{filename:"app.js"});
 return {elem,location,window,storage};
}
const library=createContext("").window.CalcNavigation;
assert.equal(library.total,218);
assert.equal(new Set(library.ordered.map(f=>f.id)).size,218);
assert.equal(library.first().id,"functions-composition");
for(const [i,family] of library.ordered.entries()){
 assert.equal(library.position(family.id),i);
 assert.equal(library.next(family.id).id,library.ordered[(i+1)%218].id);
 assert.equal(library.previous(family.id).id,library.ordered[(i+217)%218].id);
}
for(let i=0;i<6;i++){
 const group=createContext("").window.CalcBank.groups[i],first=library.firstOfUnit(group.id),last=library.lastOfUnit(group.id);
 assert.ok(first&&last);
 if(i<5){
  const nextGroup=createContext("").window.CalcBank.groups[i+1];
  assert.equal(library.next(last.id).id,library.firstOfUnit(nextGroup.id).id);
 }
}
const home=createContext("");
assert.equal(home.elem("practiceHome").hidden,false,"Plain URL should show course overview");
assert.equal(home.elem("practiceWorkspace").hidden,true,"Problem workspace should not open by default");
assert.equal(home.elem("workspaceActions").hidden,true);
assert.equal(home.location.search,"","Do not rewrite plain course URL with a default question");
assert.equal(home.elem("unitChoices").innerHTML.match(/class="unit-choice"/g).length,6);
home.elem("startCourse").onclick();
assert.equal(home.elem("practiceHome").hidden,true);
assert.equal(home.elem("practiceWorkspace").hidden,false);
assert.equal(home.elem("problemTitle").textContent,library.first().title);
assert.equal(home.elem("topicPosition").textContent,"Type 1 of 218");
assert.match(home.location.search,/family=functions-composition/);
const firstSeed=new URLSearchParams(home.location.search).get("seed");
assert.ok(Number(firstSeed)>0);
// A correct final answer entered early should also expose the next-type control.
const problem=home.window.CalcBank.generate("functions-composition",Number(firstSeed));
home.elem("answerInput").value=problem.steps.at(-1).answer;
home.elem("checkButton").onclick();
assert.match(home.elem("stepArea").innerHTML,/Problem completed/);
home.elem("completeNext").onclick();
assert.equal(home.elem("problemTitle").textContent,library.ordered[1].title);
assert.equal(home.elem("topicPosition").textContent,"Type 2 of 218");
home.elem("nextFamily").onclick();
assert.equal(home.elem("topicPosition").textContent,"Type 3 of 218");
home.elem("courseHome").onclick();
home.elem("unitChoices").onclick({target:{closest:()=>({dataset:{startUnit:"limits"}})}});
assert.equal(home.elem("problemTitle").textContent,library.firstOfUnit("limits").title);
assert.equal(home.elem("topicPosition").textContent,"Type 37 of 218");
home.elem("courseHome").onclick();
assert.equal(home.elem("practiceHome").hidden,false);
assert.equal(home.location.search,"","Course overview clears the problem share link");
assert.equal(home.elem("resumeCourse").hidden,false);
home.elem("resumeCourse").onclick();
assert.equal(home.elem("problemTitle").textContent,library.firstOfUnit("limits").title,
 "Resume returns to most recently chosen type");
const deep=createContext("?family=limits-sine&seed=1735962324");
assert.equal(deep.elem("practiceWorkspace").hidden,false);
assert.equal(deep.elem("problemTitle").textContent,"Fundamental trigonometric limit");
assert.equal(new URLSearchParams(deep.location.search).get("seed"),"1735962324");
const last=library.ordered.at(-1);
const end=createContext("?family="+last.id+"&seed=31");
assert.equal(end.elem("topicPosition").textContent,"Type 218 of 218");
end.elem("nextFamily").onclick();
assert.equal(end.elem("topicPosition").textContent,"Type 1 of 218","At the end next returns to the beginning");
console.log("PASS: Course overview, deep links, resume, sequential 218-family navigation, unit transitions and wraparound.");
