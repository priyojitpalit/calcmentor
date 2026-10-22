// Independent numerical and theorem-based limit checks, not the CalcMath answer checker.
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
"extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
"grading-categories.js"])vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
const B=sandbox.window.CalcBank,funcs=new Set(["sin","cos","tan","exp","ln","log","sqrt","abs","atan"]);
function evalExpression(src){
 src=String(src).replace(/[−–]/g,"-").replace(/π/g,"pi").replace(/²/g,"^2").replace(/³/g,"^3").replace(/⁴/g,"^4").replace(/⁵/g,"^5").replace(/⁶/g,"^6").replace(/\[/g,"(").replace(/\]/g,")").replace(/\bh\b/g,"x");
 const raw=src.match(/\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|[()+\-*/^]/g)||[];let js="";
 for(let i=0;i<raw.length;i++){const a=raw[i],b=raw[i-1];if(i&&(b===")"||/^\d/.test(b)||/^[A-Za-z_]/.test(b))&&(a==="("||/^\d/.test(a)||/^[A-Za-z_]/.test(a))&&!(funcs.has(b)&&a==="("))js+="*";js+=a==="^"?"**":a;}
 return new Function("x","const {sin,cos,tan,exp,log,sqrt,abs,atan}=Math;const ln=log,pi=Math.PI;return ("+js+");");
}
function close(a,b,tol=.015){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*(1+Math.abs(b));}
let numeric=0,conceptual=0;const covered=new Set,errors=[];
for(const family of B.families.filter(f=>f.group==="limits"))for(let seed=1;seed<=30;seed++)try{
 const p=B.generate(family.id,(Math.imul(seed,0x9e3779b1)+1234567)>>>0),id=family.id,key=p.steps.at(-1),selected=key.type==="choice"?key.options.find(x=>x.value===String(key.answer))?.label:null;
 if(id==="limits-one-sided"){
  const m=p.statement.match(/For x < 0 let f\(x\) = (\d+)x \+ (\d+); for x ≥ 0 let f\(x\) = (\d+)x \+ (\d+)/);if(!m)throw Error("Missing piecewise branches");
  const L=Number(m[2]),R=Number(m[4]);if(!close(Number(p.steps[0].answer),L)||!close(Number(p.steps[1].answer),R)||selected!==(L===R?"Yes":"No"))throw Error("Incorrect two-sided limit conclusion");conceptual++;
 }else if(id==="limits-continuity"){
  const m=p.statement.match(/x < (\d+), let f\(x\) = (\d+)x \+ (\d+).*x ≥ \d+, let f\(x\) = (\d+)x \+ k/);if(!m)throw Error("Missing continuity branches");
  const [,point,a,b,c]=m.map(Number);if(!close(evalExpression(key.answer)(1),a*point+b-c*point))throw Error("Continuity value incorrect");conceptual++;
 }else if(id==="extra-limit-piecewise-condition"){
  if(!selected?.startsWith("Yes"))throw Error("Two-sided limit exists regardless of f(0)");conceptual++;
 }else if(id==="extra-limit-ivt"){
  const m=p.statement.match(/f\(x\)=x³−(\d+)x−(\d+).*x=(\d+) and x=(\d+)/);if(!m)throw Error("Missing IVT data");
  const [,a,b,l,r]=m.map(Number),f=x=>x**3-a*x-b;if(!(f(l)*f(r)<0&&selected.includes("continuous")&&selected.includes("changes sign")))throw Error("IVT condition incorrect");conceptual++;
 }else if(id==="extra-limit-classify-infinite"){
  if(!selected?.includes("Infinite"))throw Error("Incorrect vertical-asymptote type");conceptual++;
 }else if(id==="extra-limit-classify-jump"){
  if(selected!=="Jump")throw Error("Incorrect jump type");conceptual++;
 }else if(id==="extra-limit-critical-trig"){
  const m=p.statement.match(/sin\(x\)\/\(x−(\d+)\)/);if(!m)throw Error("Missing denominator");if(!close(evalExpression(key.answer)(1),Number(m[1])))throw Error("Wrong discontinuity location");conceptual++;
 }else if(id==="extra-limit-removable-parameter"){
  const m=p.statement.match(/f\(x\)=\(x²−(\d+)\)\/\(x−(\d+)\).*f\(\d+\)=k/);if(!m)throw Error("Missing extension data");
  const sq=Number(m[1]),a=Number(m[2]);if(sq!==a*a||!close(evalExpression(key.answer)(1),2*a))throw Error("Wrong removable extension");conceptual++;
 }else{
  let statement=p.statement;
  if(id==="extra-limit-removable-hole")statement=statement.replace(/^Let h\(x\)=([^\s]+) for x≠\d+\.\s*Determine lim\(x → (\d+)\)h\(x\)\./,(_,f,a)=>"Evaluate lim(x → "+a+") "+f+".");
  if(id==="extra-limit-squeeze-bound")statement=statement.replace(/^For x≠0 define f\(x\)=(.+?)\. Find lim\(x→0\)f\(x\)\./,(_,f)=>"Evaluate lim(x → 0) "+f+".");
  const m=statement.match(/lim\(\s*(?:x|h)\s*→\s*([^)]+)\)\s*(.+?)(?:\.\s|\.?$)/);if(!m)throw Error("No formula limit "+statement);
  const where=m[1].trim().replace(/\s/g,""),f=evalExpression(m[2].trim());let expected;
  if(where.includes("∞"))expected=f(where.includes("−")||where.includes("-")?-1e7:1e7);
  else{
   const point=Number(where.replace(/[⁺⁻+\-]$/,""));if(!Number.isFinite(point))throw Error("Invalid limit point");
   const epsilon=1e-4*(1+Math.abs(point));
   if(where.endsWith("⁺")||where.endsWith("+"))expected=f(point+epsilon);
   else if(where.endsWith("⁻")||where.endsWith("-"))expected=f(point-epsilon);
   else expected=(f(point+epsilon)+f(point-epsilon))/2;
  }
  const label=selected||key.answer;
  if(label==="+∞"||label==="−∞"){if(!(Number.isFinite(expected)&&Math.abs(expected)>1000&&Math.sign(expected)===(label==="+∞"?1:-1)))throw Error("Infinite-limit direction incorrect: "+expected);}
  else if(!close(expected,evalExpression(label)(1)))throw Error("Numerical limit "+expected+" disagrees with "+label);
  numeric++;
 }
 covered.add(id);
}catch(e){if(errors.length<40)errors.push({id:family.id,seed,reason:String(e)});}
const report={familiesVerified:covered.size,numericCases:numeric,conceptualCases:conceptual,errors};
console.log("Independent limit verification",JSON.stringify(report));
if(errors.length||covered.size!==36)process.exitCode=1;
