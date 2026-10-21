// Run: node tests/smoke.test.cjs
// No npm install or external packages needed.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname,"..");
const sandbox = {window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js"]){
  vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
}
const {CalcMath,CalcBank} = sandbox.window;
assert.equal(CalcBank.families.length,59,"Unexpected change to available problem families");
let validated=0;
for(const family of CalcBank.families){
 for(let seed=1;seed<=75;seed++){
   const p=CalcBank.generate(family.id,seed);
   assert.ok(p.statement && p.steps.length>0,family.id+": missing steps");
   assert.ok(p.level>=2 && p.level<=4,family.id+": invalid difficulty");
   for(const s of p.steps){
     assert.ok(s.q && s.hints.length===2 && s.why,family.id+": missing pedagogy");
     if(s.type==="choice"){
       assert.ok(s.options.some(o=>o.value===s.answer),family.id+": invalid option");
     }
     const result=CalcMath.check(String(s.answer),s);
     assert.equal(result.ok,true,family.id+": expected answer rejected: "+s.answer+" ("+result.message+")");
     validated++;
   }
 }
}
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
