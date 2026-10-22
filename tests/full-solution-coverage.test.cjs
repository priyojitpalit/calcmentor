// Full-derivation quality gate: every problem has parameter-specific worked calculations.
// Run: node tests/full-solution-coverage.test.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),sandbox={window:{}};vm.createContext(sandbox);
const originalFiles=["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
 "extra-derivatives.js","extra-applications.js","extra-integrals.js",
 "extra-integral-applications.js","grading-categories.js","worked-solutions.js"];
const solutionFiles=["complete-solutions-core.js","complete-solutions-functions.js",
 "complete-solutions-limits.js","complete-solutions-derivatives.js",
 "complete-solutions-applications.js","complete-solutions-integrals.js",
 "complete-solutions-integral-applications.js"];
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),sandbox,{filename:f});
originalFiles.forEach(load);
const {CalcBank}=sandbox.window;
const originalDetailed=new Set(CalcBank.families.filter(f=>sandbox.window.CalcSolutions.build(CalcBank.generate(f.id,31415)).detailed).map(f=>f.id));
solutionFiles.forEach(load);
assert.equal(CalcBank.families.length,218,"Problem family count changed unexpectedly");
assert.equal(originalDetailed.size,40,"Baseline detailed solutions changed; update coverage expectations after reviewing");
let reviewed=0;const expanded=new Set,byUnit={};
const seeds=[1,2,3,7,8,13,19,47,71,95,31415,71423,1000001,123456789,987653,2147483644,4294967294];
for(const family of CalcBank.families){
 for(const seed of seeds){
  const problem=CalcBank.generate(family.id,seed);
  const sol=sandbox.window.CalcSolutions.build(problem);
  assert.equal(sol.detailed,true,family.id+": returned an outline rather than a worked solution at seed "+seed);
  assert.ok(sol.items.length>=2,family.id+": too few working stages");
  if(!originalDetailed.has(family.id)){
   expanded.add(family.id);
   assert.ok(sol.items.length>=3,family.id+": new worked derivation needs at least 3 stages");
  }
  const seen=new Set;
  for(const [j,step] of sol.items.entries()){
   assert.ok(typeof step.title==="string"&&step.title.trim(),family.id+" empty stage heading "+j);
   assert.ok(typeof step.equation==="string"&&step.equation.trim(),family.id+" empty mathematical work "+j);
   assert.ok(typeof step.note==="string",family.id+" missing note string "+j);
   assert.ok(!/\b(?:NaN|undefined|null)\b/.test(step.equation),family.id+" invalid calculation "+j+": "+step.equation);
   assert.ok(step.equation.length<1800,family.id+" unbounded calculation "+j);
   seen.add(step.equation);
  }
  assert.ok(seen.size>=2,family.id+" repeats the same answer rather than showing calculation stages");
  reviewed++;
 }
 byUnit[family.group]=(byUnit[family.group]||0)+1;
}
assert.equal(expanded.size,178,"The original 178 answer-only outlines were not all upgraded");
// Check complete substitution in every generated f(g(x)) composition, including terms like 6u.
let compositionFamiliesChecked=0;
for(const family of CalcBank.families){
 const sample=CalcBank.generate(family.id,71423);
 const match=sample.statement.match(/^Given f\\(u\\)=(.+?) and g\\(x\\)=(.+?), determine f\\(g\\(x\\)\\)\\.$/);
 if(!match)continue;
 const expected="f(g(x)) = "+match[1].replace(/u/g,"("+match[2]+")");
 const lines=sandbox.window.CalcSolutions.build(sample).items.map(x=>x.equation);
 assert.ok(lines.includes(expected),family.id+": incomplete substitution in worked explanation; expected "+expected);
 compositionFamiliesChecked++;
}
assert.ok(compositionFamiliesChecked>=20,"Composition-specific verification was skipped");
const fns=CalcBank.generate("functions-composition",71423);
const comp=sandbox.window.CalcSolutions.build(fns).items.map(x=>x.equation).join("\n");
assert.match(comp,/f\(g\(x\)\)/,"Composition must show explicit function substitution");
const opt=CalcBank.generate("extra-opt-river",71423);
const optWork=sandbox.window.CalcSolutions.build(opt).items.map(x=>x.equation).join("\n");
assert.match(optWork,/A'(?:\(|=)/,"Optimization must show the objective derivative");
assert.match(optWork,/A''(?:\(|=)/,"Optimization must justify the maximum");
const motion=CalcBank.generate("extra-integral-particle-position",71423);
const motionWork=sandbox.window.CalcSolutions.build(motion).items.map(x=>x.equation).join("\n");
assert.match(motionWork,/∫₀/,"Motion work must show integrated velocity");
console.log("PASS worked mathematical solutions:",reviewed,"generated problems,",originalDetailed.size,
 "previously detailed and",expanded.size,"newly expanded; unit counts:",JSON.stringify(byUnit));
