// Test recognized misconception patterns across varying coefficients rather than one example.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const sandbox={window:{}},root=path.resolve(__dirname,"..");vm.createContext(sandbox);
for(const f of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
 "extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
 "grading-categories.js","tutor-diagnostics.js"])
 vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),sandbox,{filename:f});
const {CalcBank:B,CalcDiagnostics:D,CalcMath:M}=sandbox.window;
let checked=0,withRepair=0,skippedEqual=0;
const cases=[
 ["deriv-chain-power",p=>{
  const [a,b,n]=p.statement.match(/Differentiate \((\d+)x\^2 \+ (\d+)\)\^(\d+)/).slice(1).map(Number);
  return {guess:n+"*("+a+"*x^2+"+b+")^"+(n-1),repair:2*a+"*x",code:"missing-inner-derivative"};}],
 ["deriv-exponential",p=>{
  const [a,b]=p.statement.match(/exp\((\d+)x\^2 \+ (\d+)x\)/).slice(1).map(Number);
  return {guess:"exp("+a+"*x^2+"+b+"*x)",repair:2*a+"*x+"+b,code:"missing-inner-derivative"};}],
 ["extra-deriv-sqrt-linear",p=>{
  const [a,b]=p.statement.match(/sqrt\((\d+)x\+(\d+)\)/).slice(1).map(Number);
  return {guess:"1/(2*sqrt("+a+"*x+"+b+"))",repair:String(a),code:"missing-inner-derivative"};}],
 ["extra-deriv-sqrt-quadratic",p=>{
  const [a,b]=p.statement.match(/sqrt\(x²\+(\d+)x\+(\d+)\)/).slice(1).map(Number);
  return {guess:"1/(2*sqrt(x^2+"+a+"*x+"+b+"))",repair:"2*x+"+a,code:"missing-inner-derivative"};}],
 ["extra-deriv-atan-quad",p=>{
  const [a,b]=p.statement.match(/atan\(x²\+(\d+)x\+(\d+)\)/).slice(1).map(Number);
  return {guess:"1/(1+(x^2+"+a+"*x+"+b+")^2)",repair:"2*x+"+a,code:"missing-inner-derivative"};}],
 ["deriv-product",p=>{
  const [n,a]=p.statement.match(/x\^(\d+) sin\((\d+)x\)/).slice(1).map(Number);
  return {guess:n+"*x^"+(n-1)+"*sin("+a+"*x)",repair:"2",code:"product-rule-term"};}],
 ["limits-sine",p=>{
  const [a,b]=p.statement.match(/sin\((\d+)x\)\/\((\d+)x\)/).slice(1).map(Number);
  return {guess:b+"/"+a,repair:"1",code:"inverted-limit-factor",skip:a===b};}],
 ["int-sub-power",p=>{
  const n=Number(p.statement.match(/\^(\d+) dx/)[1]);
  return {guess:p.steps.at(-1).answer.replace(new RegExp("/"+(n+1)+"$"),""),repair:"x^"+(n+1)+"/"+(n+1),
   code:"integration-power-denominator"};}],
 ["extra-integral-sub-cubic",p=>{
  const n=Number(p.statement.match(/\^(\d+) dx/)[1]);
  return {guess:p.steps.at(-1).answer.replace(new RegExp("/"+(n+1)+"$"),""),repair:"x^"+(n+1)+"/"+(n+1),
   code:"integration-power-denominator"};}]
];
for(const [id,derive] of cases)for(let i=1;i<=80;i++){
 const seed=(Math.imul(i,0x9e3779b1)+1234567)>>>0,p=B.generate(id,seed);
 const x=derive(p);if(x.skip){skippedEqual++;continue;}
 const step=p.steps.at(-1);
 assert.equal(M.check(x.guess,step).ok,false,id+" must reject the misconception itself");
 const d=D.diagnose({family:id,problem:p,step,submitted:x.guess});
 assert.ok(d,id+" must identify the genuine mistake at seed "+seed);
 assert.equal(d.code,x.code,id+" incorrect error category");
 assert.ok(d.repair&&d.explanation&&d.repair.explanation&&d.repair.hint);
 assert.equal(M.check(x.repair,{type:"expr",answer:d.repair.answer}).ok,true,
 id+" repair answer must agree with independently derived prerequisite");
 assert.equal(D.diagnose({family:id,problem:p,step,submitted:step.answer}),null,
 id+" must not diagnose a correct answer as a misconception");
 checked++;withRepair++;
}
assert.ok(checked>=600);
console.log("PASS diagnostic bank:",checked,"genuine misconception examples across",cases.length,
 "error families; valid repair mathematics; no false diagnosis on answer keys;",skippedEqual,"degenerate equal-coefficient cases skipped.");
