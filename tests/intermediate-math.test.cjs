// Independently derive selected intermediate worked-solution equations from problem statements.
// Unlike layout tests, this checks the mathematical values shown in intermediate steps.
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const sandbox={window:{}},root=path.resolve(__dirname,"..");vm.createContext(sandbox);
for(const f of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
"extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
"grading-categories.js","worked-solutions.js","complete-solutions-core.js",
"complete-solutions-functions.js","complete-solutions-limits.js","complete-solutions-derivatives.js",
"complete-solutions-applications.js","complete-solutions-integrals.js","complete-solutions-integral-applications.js"])
 vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),sandbox,{filename:f});
const B=sandbox.window.CalcBank;let checks=0;
function data(s,re,id){const m=s.match(re);assert.ok(m,id+": cannot derive reference data from problem statement: "+s);return m.slice(1).map(Number);}
function equations(id,seed){const p=B.generate(id,seed),steps=sandbox.window.CalcSolutions.build(p).items;
 assert.ok(steps.every(x=>x.equation&&!/\bNaN\b/.test(x.equation)),id+": incomplete solution");
 return {p,steps:steps.map(x=>x.equation),whole:steps.map(x=>x.equation).join(" | ")};
}
function requireLine(steps,fragment,id){assert.ok(steps.some(s=>s.includes(fragment)),id+": missing or wrong intermediate line: "+fragment);}
for(let i=1;i<=30;i++){
 const seed=(Math.imul(i,0x9e3779b1)+1234567)>>>0;
 {
  const {p,steps}=equations("functions-composition",seed);
  const [c,a,b]=data(p.statement,/f\(u\) = u\^2 \+ (\d+) and g\(x\) = (\d+)x \+ (\d+)/,"composition");
  requireLine(steps,"("+a+"x + "+b+")² + "+c,"composition");
  requireLine(steps,""+(a*a)+"x² + "+(2*a*b)+"x + "+(b*b+c),"composition");
  checks++;
 }
 {
  const {p,steps}=equations("limits-factor",seed);
  const [point,sum,constant]=data(p.statement,/lim\(x → (\d+)\) \(x\^2 − (\d+)x \+ (\d+)\)/,"factor");
  const q=sum-point;assert.equal(point*q,constant);
  requireLine(steps,"(x − "+point+")(x − "+q+")","factor");
  requireLine(steps," = "+(point-q),"factor");checks++;
 }
 {
  const {p,steps}=equations("deriv-chain-power",seed);
  const [a,b,n]=data(p.statement,/Differentiate \((\d+)x\^2 \+ (\d+)\)\^(\d+)/,"chain");
  requireLine(steps,"du/dx="+(2*a)+"x","chain");
  requireLine(steps,""+(2*a*n)+"x("+a+"x²+"+b+")^"+(n-1),"chain");checks++;
 }
 {
  const {p,steps}=equations("extra-opt-river",seed);
  const [P]=data(p.statement,/have (\d+) m of fencing/,"river");
  requireLine(steps,"A'(x)="+P+"−4x=0 → x="+(P/4),"river");
  requireLine(steps,"A''(x)=−4","river");checks++;
 }
 {
  const {p,steps}=equations("extra-related-sphere",seed);
  const [r,v]=data(p.statement,/radius (\d+) cm and radius increasing (\d+) cm\/s/,"sphere");
  requireLine(steps,"4π("+r+")²("+v+")="+(4*r*r*v)+"π","sphere");checks++;
 }
 {
  const {p,steps}=equations("extra-integral-ftc-upper-cube",seed);
  const [a,b]=data(p.statement,/t²\+(\d+)t\+(\d+)/,"ftc");
  requireLine(steps,"u'(x)=3x²","ftc");
  requireLine(steps,"[(x³)²+"+a+"x³+"+b+"]3x²","ftc");checks++;
 }
 {
  const {p,steps}=equations("int-sub-power",seed);
  const [c,b,a,b2,k,n]=data(p.statement,/∫ \((\d+)x \+ (\d+)\)\((\d+)x\^2 \+ (\d+)x \+ (\d+)\)\^(\d+) dx/,"substitution");
  assert.equal(c,2*a);assert.equal(b,b2);
  requireLine(steps,"du=("+c+"x+"+b+") dx","substitution");
  requireLine(steps,"u^"+(n+1)+"/"+(n+1),"substitution");checks++;
 }
 {
  const {p,steps}=equations("int-riemann",seed);
  const [a,b,L,N]=data(p.statement,/f\(x\) = (\d+)x \+ (\d+) on \[0, (\d+)\].*using (\d+) right-endpoint/,"Riemann");
  const sum=a*L*L*(N+1)/(2*N)+b*L;
  requireLine(steps,"Δx=("+L+"−0)/"+N+"="+(L/N),"Riemann");
  requireLine(steps,"Rₙ="+sum,"Riemann");
  checks++;
 }
 {
  const {p,steps}=equations("extra-integral-shell-parabola",seed);
  const [a,L]=data(p.statement,/y=(\d+)x².*on \[0,(\d+)\]/,"shell");
  requireLine(steps,"2π∫₀^"+L+" x("+a+"x²)dx","shell");
  requireLine(steps,"V="+(a*L**4)+"π/2","shell");checks++;
 }
 {
  const {p,steps}=equations("extra-integral-particle-position",seed);
  const [s0,a,b,L]=data(p.statement,/position (\d+) m and has velocity v\(t\)=(\d+)t\+(\d+) m\/s over \[0,(\d+)\]/,"motion");
  const displacement=a*L*L/2+b*L;
  requireLine(steps,"Δs=["+a+"t²/2+"+b+"t]₀^"+L+" = "+displacement,"motion");
  requireLine(steps,"s("+L+")="+s0+"+"+displacement+"="+(s0+displacement)+" m","motion");checks++;
 }
}
console.log("PASS independently verified intermediate worked-solution equations in",checks,"parameterized reference cases.");
