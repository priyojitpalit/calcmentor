// Interactive tutor regression: incorrect chain rule -> targeted repair -> assisted completion -> prerequisite.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const files=["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
 "extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
 "grading-categories.js","tutor-learning.js","tutor-diagnostics.js","course-navigation.js"];
const elements=new Map,storage=new Map;
function elem(id){
 if(!elements.has(id))elements.set(id,{
  id,textContent:"",innerHTML:"",hidden:false,value:"",disabled:false,dataset:{},style:{},
  classList:{toggle(){},add(){},remove(){}},
  setAttribute(){},addEventListener(){},focus(){},querySelector(){return null},appendChild(){},remove(){}
 });
 return elements.get(id);
}
const location={protocol:"https:",pathname:"/calcmentor/",search:"?family=deriv-chain-power&seed=17171",href:"https://example.org/calcmentor/"};
const document={getElementById:elem,querySelectorAll(){return []},querySelector(){return null},
 createElement(){return {innerHTML:"",setAttribute(){},appendChild(){},remove(){},style:{}};}};
const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))};
const history={replaceState(_state,_title,url){location.search=url.includes("?")?url.slice(url.indexOf("?")):"";}};
const window={devicePixelRatio:1,addEventListener(){},prompt(){return "";}};
const sandbox={window,document,localStorage,history,location,URLSearchParams,URL,Blob,console,
 navigator:{clipboard:{writeText:async()=>{}}},alert(){},confirm(){return true},setTimeout(){}};
vm.createContext(sandbox);
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),sandbox,{filename:f});
window.CalcSolutions={build:()=>({detailed:true,items:[]})};
vm.runInContext(fs.readFileSync(path.join(root,"app.js"),"utf8"),sandbox,{filename:"app.js"});
const M=window.CalcMath,B=window.CalcBank,p=B.generate("deriv-chain-power",17171);
assert.equal(elem("practiceWorkspace").hidden,false);
assert.equal(elem("problemTitle").textContent,p.title);
elem("modeButton").onclick(); // Final-answer mode: allows direct demonstration of chain-rule mistake.
assert.equal(elem("modeButton").textContent,"Switch to guided steps");
const m=p.statement.match(/Differentiate \((\d+)x\^2 \+ (\d+)\)\^(\d+)/);
const wrong=m[3]+"*("+m[1]+"*x^2+"+m[2]+")^"+(Number(m[3])-1);
assert.equal(M.check(wrong,p.steps.at(-1)).ok,false);
elem("answerInput").value=wrong;elem("checkButton").onclick();
assert.match(elem("feedback").innerHTML,/Missing the inner derivative/);
assert.match(elem("feedback").innerHTML,/repairStart/);
const before=JSON.parse(storage.get("calcmentor-v1-learning"));
assert.equal(before.skills["derivative-chain"].misses,1);
elem("repairStart").onclick();
assert.equal(elem("repairQuestion").hidden,false);
elem("repairInput").value="2*"+m[1]+"*x";
elem("repairCheck").onclick();
assert.match(elem("repairFeedback").textContent,/Correct/);
const afterRepair=JSON.parse(storage.get("calcmentor-v1-learning"));
assert.equal(afterRepair.skills["derivative-chain"].repairs,1);
assert.equal(afterRepair.skills["derivative-chain"].level,0);
elem("answerInput").value=p.steps.at(-1).answer;
elem("checkButton").onclick();
assert.match(elem("stepArea").innerHTML,/Problem completed/);
const completed=JSON.parse(storage.get("calcmentor-v1-learning"));
assert.equal(completed.skills["derivative-chain"].independent,0);
assert.equal(completed.skills["derivative-chain"].supported,1);
assert.equal(completed.skills["derivative-chain"].misses,1);
elem("completeRecommended").onclick();
const next=window.CalcLearning.plan(completed,{exclude:"deriv-chain-power"});
assert.equal(elem("problemTitle").textContent,next.family.title);
assert.equal(next.skill.id,"derivative-basic");
assert.equal(elem("skillCoachInfo").textContent.includes("Skill:"),true);
console.log("PASS tutoring interface: wrong answer diagnosis, interactive repair, local persistence, assisted credit and prerequisite recommendation.");
