// Independent function composition, inverse, and domain tests.
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
"extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
"grading-categories.js"])vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
const B=sandbox.window.CalcBank,names=new Set(["sin","cos","tan","exp","ln","log","sqrt","abs","atan","asin","acos","sinh"]);
function fn(s){
 s=String(s).replace(/[−–]/g,"-").replace(/π/g,"pi").replace(/²/g,"^2").replace(/³/g,"^3").replace(/⁴/g,"^4").replace(/u/g,"x");
 const t=s.match(/\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|[()+\-*/^]/g)||[];let e="";
 for(let i=0;i<t.length;i++){const a=t[i],b=t[i-1];if(i&&(b===")"||/^\d/.test(b)||/^[A-Za-z_]/.test(b))&&(a==="("||/^\d/.test(a)||/^[A-Za-z_]/.test(a))&&!(names.has(b)&&a==="("))e+="*";e+=a==="^"?"**":a;}
 const pre="const {sin,cos,tan,exp,log,sqrt,abs,atan,asin,acos,sinh}=Math;const ln=log,pi=Math.PI;";
 return new Function("x",pre+"return ("+e+");");
}
function equivalent(a,b,tol=1e-8){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*(1+Math.abs(b));}
function match(s,re){const m=s.match(re);if(!m)throw Error("Cannot parse function problem: "+s);return m;}
const successes=new Set,errors=[];let checked=0;
for(const family of B.families.filter(f=>f.group==="foundations"))for(let seed=1;seed<=30;seed++)try{
 const p=B.generate(family.id,seed),id=family.id,s=p.statement,step=p.steps.at(-1),answer=fn(step.answer);
 if(id==="functions-domain"||id==="extra-domain-log"||id==="extra-domain-log-radical"||id==="extra-domain-reciprocal-radical"){
  const bound=answer(1);let f;
  if(id==="functions-domain"){const m=match(s,/sqrt\((\d+)x\s*−\s*(\d+)\)/);const a=Number(m[1]),b=Number(m[2]);f=x=>Math.sqrt(a*x-b);}
  else if(id==="extra-domain-log"){const m=match(s,/ln\((\d+)x−(\d+)\)/);const a=Number(m[1]),b=Number(m[2]);f=x=>Math.log(a*x-b);}
  else if(id==="extra-domain-log-radical"){const m=match(s,/sqrt\(ln\(x−(\d+)\)\)/);const a=Number(m[1]);f=x=>Math.sqrt(Math.log(x-a));}
  else {const m=match(s,/1\/sqrt\((\d+)x−(\d+)\)/);const a=Number(m[1]),b=Number(m[2]);f=x=>1/Math.sqrt(a*x-b);}
  if(Number.isFinite(f(bound-.001))||!Number.isFinite(f(bound+.001)))throw Error("Reported domain boundary does not change real-valuedness");
 }else if(id==="functions-inverse"||id==="extra-inverse-quadratic"||id==="extra-inverse-reciprocal"){
  let f;
  if(id==="functions-inverse"){const m=match(s,/f\(x\) = (\d+)x \+ (\d+)/);const a=Number(m[1]),b=Number(m[2]);f=x=>a*x+b;}
  else if(id==="extra-inverse-quadratic"){const m=match(s,/f\(x\)=\(x−(\d+)\)²\+(\d+)/);const a=Number(m[1]),b=Number(m[2]);f=x=>(x-a)**2+b;}
  else {const m=match(s,/f\(x\)=(\d+)\/\(x−(\d+)\)/);const a=Number(m[1]),b=Number(m[2]);f=x=>a/(x-b);}
  for(const x of [2.1,8.4,12.6,23]){const result=f(answer(x));if(!equivalent(result,x))throw Error("Inverse does not undo function at "+x+": "+result+" vs "+x);}
 }else if(id==="extra-piecewise-input"){
  const m=match(s,/g\(x\)=x−(\d+) if x≥0\. Calculate f\(g\((\d+)\)\)/);const b=Number(m[1]),x=Number(m[2]);
  if(!equivalent(answer(1),(x-b)**2))throw Error("Piecewise branch or outer square incorrect");
 }else if(id==="extra-unknown-parameter"){
  const m=match(s,/f\(u\)=u\+(\d+), g\(x\)=(\d+)x\+t\. If f\(g\((\d+)\)\)=(\d+)/);
  const [,c,a,x,target]=m.map(Number);
  if(!equivalent(answer(1),target-a*x-c))throw Error("Composition parameter does not satisfy equation");
 }else if(id==="extra-rational-domain"){
  const m=match(s,/f\(u\)=1\/\(u−(\d+)\) and g\(x\)=(\d+)x\+(\d+)/);const [,c,a,b]=m.map(Number);
  if(!equivalent(a*answer(1)+b,c))throw Error("Wrong excluded point for composite denominator");
 }else if(id==="extra-nested-triple"){
  const m=match(s,/f\(u\)=(.+?), g\(u\)=(.+?), and h\(x\)=(.+?)\. Determine/),f=fn(m[1]),g=fn(m[2]),h=fn(m[3]);
  for(const x of [.2,.5,1.1]){const result=f(g(h(x)));if(!equivalent(answer(x),result))throw Error("Triple composition disagrees with definition");}
 }else if(id==="extra-reverse-order"){
  const m=match(s,/f\(x\)=(.+?) and g\(u\)=(.+?), find/),f=fn(m[1]),g=fn(m[2]);
  for(const x of [.2,.5,1.1])if(!equivalent(answer(x),g(f(x))))throw Error("Wrong reverse-order composition");
 }else if(id==="extra-evaluate-at-point"){
  const m=match(s,/f\(u\)=(.+?) and g\(x\)=(.+?)\. Find f\(g\((\d+)\)\)/),f=fn(m[1]),g=fn(m[2]),x=Number(m[3]);
  if(!equivalent(answer(1),f(g(x))))throw Error("Incorrect numeric composition");
 }else{
  const m=match(s,/f\(u\)\s*=\s*(.+?)\s+and\s+g\(x\)\s*=\s*(.+?)(?:, determine|\. Find)/i),f=fn(m[1]),g=fn(m[2]);
  let count=0;for(const x of [.1,.4,.8,1.2,3.4,7.4,12]){const truth=f(g(x)),given=answer(x);if(!Number.isFinite(truth)||!Number.isFinite(given))continue;if(!equivalent(given,truth))throw Error("Wrong composite expression at "+x+": "+given+" vs "+truth);count++;}
  if(count<2)throw Error("No useful domain samples for composite");
 }
 successes.add(id);checked++;
}catch(err){if(errors.length<50)errors.push({id:family.id,seed,message:String(err)});}
const report={verifiedFamilies:successes.size,problemInstances:checked,errors};console.log("Independent function verification",JSON.stringify(report));
if(errors.length||successes.size!==36)process.exitCode=1;
