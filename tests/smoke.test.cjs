// Run: node tests/smoke.test.cjs
// No npm install or external packages needed.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname,"..");
const sandbox = {window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js","extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js","grading-categories.js"]){
  vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
}
const {CalcMath,CalcBank} = sandbox.window;
assert.equal(CalcBank.families.length,218,"Unexpected change to available problem families");
assert.equal(CalcBank.gradingCategories.antiderivativeFamilyCount,21,"Antiderivative response categories were not loaded");
assert.equal(new Set(CalcBank.families.map(f=>f.id)).size,CalcBank.families.length,"Duplicate problem family IDs");
for(const g of CalcBank.groups) {
 assert.ok(CalcBank.families.filter(f=>f.group===g.id).length>=20,g.name+": insufficient subject coverage");
}
let validated=0;
for(const family of CalcBank.families){
 for(let seed=1;seed<=100;seed++){
   const p=CalcBank.generate(family.id,seed);
   assert.ok(p.statement && p.steps.length>0,family.id+": missing steps");
   assert.ok(typeof p.title==="string"&&typeof p.topic==="string",family.id+": missing metadata");
   assert.ok(p.level>=2 && p.level<=4,family.id+": invalid difficulty");
   for(const s of p.steps){
     assert.ok(s.q && s.hints.length===2 && s.why,family.id+": missing pedagogy");
     if(s.type==="choice"){
       assert.ok(s.options.some(o=>o.value===s.answer),family.id+": invalid option");
     }
     const result=CalcMath.check(String(s.answer),s);
     assert.equal(result.ok,true,family.id+": expected answer rejected: "+s.answer+" ("+result.message+")");
     if(s.type==="antiderivative"){
       assert.equal(CalcMath.check("("+s.answer+")+7",s).ok,true,
         family.id+": valid additive constant rejected");
       assert.equal(CalcMath.check("("+s.answer+")+C",s).ok,true,
         family.id+": integration constant C rejected");
       assert.equal(CalcMath.check("("+s.answer+")+0.01*x",s).ok,false,
         family.id+": nonconstant perturbation accepted");
     }else if(s.type==="expr"&&seed<=5){
       assert.equal(CalcMath.check("("+s.answer+")+0.00001",s).ok,false,
         family.id+": incorrect algebraic offset accepted");
     }
     validated++;
   }
 }
}
// Regression: users may supply the correct final answer at the first guided step.
const screenshot = CalcBank.generate("functions-composition",1735962324);
assert.equal(screenshot.steps[0].answer,"5*x+2");
assert.equal(screenshot.steps[1].answer,"(5*x+2)^2+4");
const submittedFinal = CalcMath.evaluateAttempt("(5*x+2)^2+4", screenshot.steps, 0);
assert.equal(submittedFinal.kind,"final");
assert.equal(submittedFinal.ok,true);
assert.equal(CalcMath.evaluateAttempt("5*x+2",screenshot.steps,0).kind,"current");
assert.equal(CalcMath.evaluateAttempt("5*x+3",screenshot.steps,0).kind,"incorrect");
for (const family of CalcBank.families) {
  const problem=CalcBank.generate(family.id,12345);
  for (let i=0;i<problem.steps.length;i++) {
    const step=problem.steps[i];
    assert.equal(CalcMath.evaluateAttempt(String(step.answer),problem.steps,i).kind,"current",
      family.id+" expected the correct current-step answer");
  }
  const final=problem.steps.at(-1);
  if(problem.steps.length>1 && problem.steps[0].type!=="choice" &&
    final.type!=="choice" && final.type!=="text") {
    const classification=CalcMath.evaluateAttempt(String(final.answer),problem.steps,0);
    assert.ok(classification.kind==="final"||classification.kind==="current",
      family.id+" rejected its own final answer during an earlier step");
  }
}
// Previously reproduced grading defects from the MTH 121 audit.
assert.equal(CalcMath.check("x+0.00001",{type:"expr",answer:"x"}).ok,false);
assert.equal(CalcMath.check("x^2/2+7",{type:"antiderivative",answer:"x^2/2"}).ok,true);
assert.equal(CalcMath.check("x^2/2+2*pi",{type:"antiderivative",answer:"x^2/2"}).ok,true);
assert.equal(CalcMath.check("x^2/2+C",{type:"antiderivative",answer:"x^2/2"}).ok,true);
assert.equal(CalcMath.check("x^2/2+C*x",{type:"antiderivative",answer:"x^2/2"}).ok,false);
assert.equal(CalcMath.check("x^2/2+7",{type:"expr",answer:"x^2/2"}).ok,false);
assert.equal(CalcMath.check("(x^2)/x",{type:"expr",answer:"x"}).ok,false);
assert.equal(CalcMath.check("x^2",{type:"expr",answer:"x^3"}).ok,false);
assert.equal(CalcMath.check("2*x + 2*x",{type:"expr",answer:"4*x"}).ok,true);
assert.equal(CalcMath.check("(x+1)^2",{type:"expr",answer:"x^2+2*x+1"}).ok,true);
assert.equal(CalcMath.check("-x^2",{type:"expr",answer:"-(x^2)"}).ok,true);
assert.equal(CalcMath.check("sin(x)^2+cos(x)^2",{type:"expr",answer:"1"}).ok,true);
assert.equal(CalcMath.check("1/(x-2)",{type:"expr",answer:"1/(x+2)"}).ok,false);
assert.equal(CalcMath.check("2pi",{type:"number",answer:"2*pi"}).ok,true);
assert.equal(CalcMath.check("x",{type:"number",answer:"1"}).ok,false);
assert.equal(CalcMath.check("not-a-math-expression",{type:"expr",answer:"x"}).ok,false);
console.log("PASS: "+CalcBank.families.length+" families, "+validated+" generated answers, expression-parser regression checks.");
