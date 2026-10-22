// Worked-solution rendering regression tests. Run: node tests/worked-solutions.test.cjs
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
"extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
"grading-categories.js","worked-solutions.js"])
 vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
const {CalcBank,CalcSolutions}=sandbox.window,enhanced=new Set;
let checked=0;
for(const family of CalcBank.families){
 for(let i=1;i<=20;i++){
  const seed=(Math.imul(i,0x9e3779b1)+1234567)>>>0;
  const problem=CalcBank.generate(family.id,seed),sol=CalcSolutions.build(problem);
  assert.ok(sol&&Array.isArray(sol.items)&&sol.items.length,"Missing solution: "+family.id);
  for(const [j,step] of sol.items.entries()){
   assert.equal(typeof step.title,"string");
   assert.ok(step.title.trim(),"Empty solution heading: "+family.id);
   assert.equal(typeof step.equation,"string");
   assert.equal(typeof step.note,"string");
   assert.ok(!/\b(?:NaN|undefined|null)\b/.test(step.equation),"Malformed math: "+family.id+" "+j);
  }
  if(sol.detailed){
   enhanced.add(family.id);
   assert.ok(sol.items.length>=2,"Incomplete detailed derivation: "+family.id);
  } else {
   assert.equal(sol.items.length,problem.steps.length,"Outline lost assessed steps: "+family.id);
   for(const [j,step] of sol.items.entries())assert.ok(step.equation,"Expected answer omitted: "+family.id+" step "+j);
  }
  checked++;
 }
}
assert.equal(CalcBank.families.length,218);
assert.ok(enhanced.size>=40,"Too few explicit worked derivation families");
for(const id of ["functions-composition","limits-factor","deriv-chain-power","apps-opt-box","int-sub-power","int-definite-poly","int-riemann","intapp-disk","extra-integral-particle-position"]){
 assert.ok(enhanced.has(id),"Missing textbook-style worked derivation for "+id);
}
const motion=CalcBank.generate("extra-integral-particle-position",71423),worked=CalcSolutions.build(motion);
assert.ok(worked.items.some(item=>item.equation.includes("∫₀")),"Motion solution must include a displacement integral");
const example=CalcBank.generate("functions-composition",314159),eqs=CalcSolutions.build(example).items.map(s=>s.equation).join(" ");
assert.ok(eqs.includes("f(g(x))"),"Composition must explicitly show substitution");
console.log("Worked-solution regression passed:",checked,"generated problems;",enhanced.size,"explicit worked derivation families.");
