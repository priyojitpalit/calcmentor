// Independent numerical integration of authored problem statements and geometric models.
// CalcMath.check and the corresponding answer-generating formulas are NOT used.
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
"extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
"grading-categories.js"])vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
const B=sandbox.window.CalcBank;
const functionNames=new Set(["sin","cos","tan","exp","ln","log","sqrt","abs","atan","asin","acos","sec","csc","cot"]);
function arithmetic(src){
 src=String(src).replace(/[−–]/g,"-").replace(/π/g,"pi").replace(/²/g,"^2").replace(/³/g,"^3").replace(/⁴/g,"^4").replace(/⁵/g,"^5");
 const t=src.match(/\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|[()+\-*/^]/g)||[];let s="";
 for(let i=0;i<t.length;i++){const a=t[i],b=t[i-1];if(i&&(b===")"||/^\d/.test(b)||/^[A-Za-z_]/.test(b))&&(a==="("||/^\d/.test(a)||/^[A-Za-z_]/.test(a))&&!(functionNames.has(b)&&a==="("))s+="*";s+=a==="^"?"**":a;}
 const context="const {sin,cos,tan,exp,log,sqrt,abs,atan,asin,acos}=Math;const ln=log,pi=Math.PI,sec=z=>1/cos(z),csc=z=>1/sin(z),cot=z=>1/tan(z);";
 return new Function("x",context+"return ("+s+");");
}
function integrate(f,a,b){const n=1600,h=(b-a)/n;let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+h*i);return h*sum/3;}
function deriv(f,x){const h=.00003*(1+Math.abs(x));return (-f(x+2*h)+8*f(x+h)-8*f(x-h)+f(x-2*h))/(12*h);}
function same(a,b,tol=.0003){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*(1+Math.abs(b));}
function capture(s,re){const m=s.match(re);if(!m)throw Error("Cannot read modeling data from: "+s);return m.slice(1).map(Number);}
function value(step){return arithmetic(step.answer)(1);}
function geometric(p,id){
 const s=p.statement;let m,a,b,c,L,R,r,q,P,answer;
 switch(id){
 case "intapp-between": [a,b]=capture(s,/between y = (\d+)x and y = (\d+)x²/);answer=integrate(x=>a*x-b*x*x,0,a/b);break;
 case "intapp-disk": [a,L]=capture(s,/under y = (\d+)x from x = 0 to x = (\d+)/);answer=integrate(x=>Math.PI*(a*x)**2,0,L);break;
 case "intapp-shell": [a,L]=capture(s,/under y = (\d+)x on \[0, (\d+)\]/);answer=integrate(x=>2*Math.PI*x*a*x,0,L);break;
 case "intapp-work": [a,b,L]=capture(s,/F\(x\) = (\d+)x \+ (\d+).*x = 0 to x = (\d+)/);answer=integrate(x=>a*x+b,0,L);break;
 case "extra-integral-area-quadratic": [a,L]=capture(s,/y=(\d+)x² on 0≤x≤(\d+)/);answer=integrate(x=>a*x*x,0,L);break;
 case "extra-integral-area-crossing": [a,b,c]=capture(s,/between y=(\d+)x and y=(\d+)\/(\d+) x²/);L=c;answer=integrate(x=>a*x-(b/c)*x*x,0,L);break;
 case "extra-integral-washer-annulus": [L,r,R]=capture(s,/0≤x≤(\d+), (\d+)≤y≤(\d+)/);answer=integrate(x=>Math.PI*(R*R-r*r),0,L);break;
 case "extra-integral-cone-disks": [a,L]=capture(s,/y=(\d+)x from x=0 to x=(\d+)/);answer=integrate(x=>Math.PI*(a*x)**2,0,L);break;
 case "extra-integral-shell-parabola": [a,L]=capture(s,/y=(\d+)x².*on \[0,(\d+)\]/);answer=integrate(x=>2*Math.PI*x*a*x*x,0,L);break;
 case "extra-integral-cross-section-squares": [a,L]=capture(s,/s\(x\)=(\d+)x, for 0≤x≤(\d+)/);answer=integrate(x=>(a*x)**2,0,L);break;
 case "extra-integral-hooke": [a,L]=capture(s,/F\(x\)=(\d+)x.*from 0 to (\d+)/);answer=integrate(x=>a*x,0,L);break;
 case "extra-integral-displacement-distance": [a,b,L]=capture(s,/v\(t\)=(\d+)t−(\d+) over the interval 0≤t≤(\d+)/);answer=integrate(t=>Math.abs(a*t-b),0,L);break;
 case "extra-integral-particle-position": [P,a,b,L]=capture(s,/position (\d+) m and has velocity v\(t\)=(\d+)t\+(\d+) m\/s over \[0,(\d+)\]/);answer=P+integrate(t=>a*t+b,0,L);break;
 case "extra-washer-variable-inner": [R,r]=capture(s,/0≤x≤(\d+), x≤y≤(\d+)/);answer=integrate(x=>Math.PI*(r*r-x*x),0,R);break;
 case "extra-shell-triangle": [R,r]=capture(s,/0≤x≤(\d+), 0≤y≤(\d+)−x/);answer=integrate(x=>2*Math.PI*x*(r-x),0,R);break;
 case "extra-disk-descending-line": [R,L]=capture(s,/y=(\d+)−x on \[0,(\d+)\]/);answer=integrate(x=>Math.PI*(R-x)**2,0,L);break;
 case "extra-cross-section-equilateral": [L]=capture(s,/for 0≤x≤(\d+)/);answer=integrate(x=>Math.sqrt(3)*x*x/4,0,L);break;
 case "extra-cross-section-semicircle": [L]=capture(s,/0≤x≤(\d+)/);answer=integrate(x=>Math.PI*x*x/8,0,L);break;
 case "extra-area-line-horizontal": [R]=capture(s,/y=(\d+) and x=0/);answer=integrate(x=>R-x,0,R);break;
 case "extra-area-parabola-axis": [c]=capture(s,/y=(\d+)−x²/);R=Math.sqrt(c);answer=integrate(x=>c-x*x,-R,R);break;
 case "extra-consumer-surplus": [a,b,q,P]=capture(s,/p\(x\)=(\d+)−(\d+)x.*sells (\d+) units at price \$(\d+)/);answer=integrate(x=>a-b*x-P,0,q);break;
 case "extra-producer-surplus": [c,b,q,P]=capture(s,/p\(x\)=(\d+)\+(\d+)x.*price at quantity (\d+) is \$(\d+)/);answer=integrate(x=>P-c-b*x,0,q);break;
 case "extra-work-quadratic-force": [a,b,L]=capture(s,/F\(x\)=(\d+)x²\+(\d+)x.*from x=0 to (\d+)/);answer=integrate(x=>a*x*x+b*x,0,L);break;
 case "extra-mass-variable-density": [L,a,b]=capture(s,/0≤x≤(\d+) m.*rho\(x\)=(\d+)x\+(\d+) kg\/m/);answer=integrate(x=>a*x+b,0,L);break;
 default:throw Error("Unmapped integral application: "+id);
 }
 return answer;
}
const errors=[],geometricCoverage=new Set(),definiteCoverage=new Set(),otherCoverage=new Set();
let geometricCases=0,definiteCases=0,otherCases=0;
for(const family of B.families)for(let seed=1;seed<=30;seed++)try{
 const p=B.generate(family.id,seed),id=family.id,answer=p.steps.at(-1);
 if(family.group==="integral-applications"){
  const independentlyComputed=geometric(p,id),key=value(answer);
  if(!same(independentlyComputed,key))throw Error("Wrong geometric answer: independent="+independentlyComputed+" stored="+key);
  geometricCoverage.add(id);geometricCases++;
 }
 const integralMatch=p.statement.match(/∫\s*from\s+(\S+)\s+to\s+(\S+)\s+of\s+(.+?)\s+dx\b/i);
 if(["int-definite-poly","int-definite-sub","extra-integral-definite-sine","extra-integral-definite-cos","extra-integral-even","extra-integral-odd","extra-integral-absolute-value"].includes(id)){
  if(!integralMatch)throw Error("Could not read definite integral");
  const [unused,left,right,integrand]=integralMatch;const L=arithmetic(left)(1),R=arithmetic(right)(1),f=arithmetic(integrand);
  const calculated=integrate(f,L,R),expected=value(answer);
  if(!same(calculated,expected,.0001))throw Error("Wrong definite integral "+calculated+" expected "+expected);
  definiteCoverage.add(id);definiteCases++;
 }
 if(id==="int-riemann"||id==="extra-integral-riemann-left"||id==="extra-integral-riemann-midpoint"){
  const m=p.statement.match(/f\(x\)\s*=\s*(.+?) on \[0, (\d+)\]/);
  const m2=p.statement.match(/∫\s*from 0 to (\d+) of \((.+?)\) dx/);
  const m3=p.statement.match(/using (\d+) (right-endpoint|midpoint) rectangles|with (\d+) equal-width LEFT-endpoint rectangles|using (\d+) midpoint rectangles/);
  const upper=m?Number(m[2]):m2?Number(m2[1]):NaN,fun=arithmetic(m?m[1]:m2?m2[2]:""),n=Number(m3?.[1]||m3?.[3]||m3?.[4]);
  if(!Number.isFinite(upper)||!n)throw Error("Cannot read Riemann setup");
  const dx=upper/n;let sum=0;for(let i=0;i<n;i++){const sample=id==="int-riemann"?(i+1)*dx:id==="extra-integral-riemann-left"?i*dx:(i+.5)*dx;sum+=fun(sample)*dx;}
  if(!same(sum,value(answer),1e-11))throw Error("Wrong Riemann sum "+sum+" key "+value(answer));
  otherCoverage.add(id);otherCases++;
 }
 if(id==="int-signed-area"){
  const a=Number(p.statement.match(/x³ on \[−(\d+),/)[1]),total=integrate(x=>Math.abs(x**3),-a,a);
  if(!same(total,value(answer),.0001))throw Error("Incorrect geometric area");otherCoverage.add(id);otherCases++;
 }
 if(id==="extra-integral-net-change"||id==="int-average"||id==="extra-integral-average-trig"){
  let integral,denom=1;
  if(id==="extra-integral-net-change"){const [a,b,L]=capture(p.statement,/R\(x\)=(\d+)x\+(\d+).*x=0 to x=(\d+)/);integral=integrate(x=>a*x+b,0,L);}
  else if(id==="int-average"){const [a,L]=capture(p.statement,/f\(x\) = (\d+)x² on \[0, (\d+)\]/);integral=integrate(x=>a*x*x,0,L);denom=L;}
  else {const [a]=capture(p.statement,/of (\d+)sin\(x\) on/);integral=integrate(x=>a*Math.sin(x),0,Math.PI);denom=Math.PI;}
  if(!same(integral/denom,value(answer)))throw Error("Incorrect average or accumulated change");otherCoverage.add(id);otherCases++;
 }
}catch(e){if(errors.length<50)errors.push({id:family.id,seed,reason:String(e)});}
const result={geometricFamilies:geometricCoverage.size,geometricCases,definiteFamilies:definiteCoverage.size,definiteCases,otherFamilies:otherCoverage.size,otherCases,errors};
console.log("Independent definite-integral, Riemann-sum and applications verification",JSON.stringify(result));
if(errors.length||result.geometricFamilies!==24||result.definiteFamilies!==7||result.otherFamilies!==7)process.exitCode=1;
