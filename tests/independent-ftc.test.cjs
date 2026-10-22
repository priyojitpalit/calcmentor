// Independent Fundamental Theorem of Calculus reference identities (five families).
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
"extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
"grading-categories.js"])vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
const B=sandbox.window.CalcBank;
function parseKey(src){
 const s=String(src).replace(/\^/g,"**").replace(/[−–]/g,"-");const funcs="const {cos,exp}=Math;";
 return new Function("x",funcs+"return ("+s+");");
}
function data(s,re){let m=s.match(re);if(!m)throw Error("Cannot parse FTC question: "+s);return m.slice(1).map(Number);}
const known=["int-ftc","int-ftc-chain","extra-integral-ftc-upper-cube","extra-integral-ftc-lower","extra-integral-ftc-both"];
const errors=[];let cases=0;
for(const id of known)for(let seed=1;seed<=30;seed++)try{
 const p=B.generate(id,seed),s=p.statement;
 let expected,expected2=null;
 if(id==="int-ftc"){
  const [a]=data(s,/t³ \+ (\d+)t/);expected=x=>x**3+a*x;expected2=x=>3*x*x+a;
 }else if(id==="int-ftc-chain"){
  const [a]=data(s,/cos\((\d+)t²\)/);expected=x=>2*x*Math.cos(a*x**4);
 }else if(id==="extra-integral-ftc-upper-cube"){
  const [a,b]=data(s,/t²\+(\d+)t\+(\d+)/);expected=x=>3*x*x*(x**6+a*x**3+b);
 }else if(id==="extra-integral-ftc-lower")expected=x=>-Math.exp(x*x);
 else{
  const [a]=data(s,/from x to x² of \(t\+(\d+)\)/);
  expected=x=>2*x*(x*x+a)-(x+a);
 }
 for(let i=0;i<p.steps.length;i++){
  const f=parseKey(p.steps[i].answer),oracle=i===1?expected2:expected;
  if(!oracle)throw Error("Unexpected extra FTC step");
  for(const x of [-.8,-.2,.25,.7,1.25]){
   const a=f(x),b=oracle(x);if(!(Number.isFinite(a)&&Math.abs(a-b)<1e-8*(1+Math.abs(b))))throw Error("Incorrect FTC answer at "+x+": "+a+" vs "+b);
  }
 }
 cases++;
}catch(e){if(errors.length<50)errors.push({id,seed,reason:String(e)});}
console.log("Independent Fundamental Theorem verification",JSON.stringify({families:known.length,cases,errors}));
if(errors.length||cases!==known.length*30)process.exitCode=1;
