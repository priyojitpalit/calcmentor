// Deterministic tests for misconception recognition, prerequisite repair and review scheduling.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
 "extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
 "grading-categories.js","tutor-learning.js","tutor-diagnostics.js"]){
 vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
}
const {CalcBank:B,CalcLearning:L,CalcDiagnostics:D,CalcMath:M}=sandbox.window;
const at=Date.UTC(2026,9,23,12),day=86400000;
assert.equal(L.skills.length,23);
assert.equal(new Set(B.families.map(f=>L.skillOf(f.id))).size,23);
assert.ok(B.families.every(f=>L.skillOf(f.id)),"Unmapped problem family");
assert.equal(L.plan(L.fresh(),{now:at}).family.id,"functions-composition");
assert.equal(L.plan(L.fresh(),{now:at}).mode,"guided");
const p=B.generate("deriv-chain-power",17171),inner=p.steps[0],full=p.steps[1];
const m=p.statement.match(/Differentiate \((\d+)x\^2 \+ (\d+)\)\^(\d+)/);
assert.ok(m);
const missing=m[3]+"*("+m[1]+"*x^2+"+m[2]+")^"+(Number(m[3])-1);
assert.equal(M.check(missing,full).ok,false);
let diag=D.diagnose({family:p.id,problem:p,step:full,submitted:missing});
assert.equal(diag.code,"missing-inner-derivative");
assert.ok(diag.repair&&M.check(diag.repair.answer,{type:"expr",answer:inner.answer}).ok);
assert.equal(D.diagnose({family:p.id,problem:p,step:inner,submitted:"x+7"}),null,
 "Must not falsely diagnose the inner-derivative step as a chain-rule omission");
const sqrt=B.generate("extra-deriv-sqrt-linear",71919);
const radical=sqrt.statement.match(/sqrt\((\d+)x\+(\d+)\)/);
diag=D.diagnose({family:sqrt.id,problem:sqrt,step:sqrt.steps[0],
 submitted:"1/(2*sqrt("+radical[1]+"*x+"+radical[2]+"))"});
assert.equal(diag.code,"missing-inner-derivative");
const exponential=B.generate("deriv-exponential",312312);
const em=exponential.statement.match(/exp\((\d+)x\^2 \+ (\d+)x\)/);
diag=D.diagnose({family:exponential.id,problem:exponential,step:exponential.steps.at(-1),
 submitted:"exp("+em[1]+"*x^2+"+em[2]+"*x)"});
assert.equal(diag.code,"missing-inner-derivative");
const lim=B.generate("limits-sine",14141),lm=lim.statement.match(/sin\((\d+)x\)\/\((\d+)x\)/);
diag=D.diagnose({family:lim.id,problem:lim,step:lim.steps.at(-1),
 submitted:lm[2]+"/"+lm[1]});
if(lm[1]!==lm[2])assert.equal(diag.code,"inverted-limit-factor");
assert.equal(D.diagnose({family:lim.id,problem:lim,step:lim.steps.at(-1),submitted:"abcabc"}),null);
let state=L.fresh();
assert.equal(L.dueCount(state,at),0);
state=L.recordCompletion(state,{family:"functions-composition",seed:100,independent:true,hadError:false,at});
assert.equal(state.skills.composition.level,1);
assert.equal(state.skills.composition.independent,1);
assert.equal(L.dueCount(state,at),0);
assert.equal(L.dueCount(state,at+day),1);
assert.equal(L.plan(state,{now:at+day,onlyDue:true}).skill.id,"composition");
const dueBefore=state.skills.composition.dueAt;
state=L.recordCompletion(state,{family:"functions-composition",seed:100,independent:true,hadError:false,at:at+day});
assert.equal(state.skills.composition.level,1,"Repeating same generated question must not raise mastery");
assert.equal(state.skills.composition.dueAt,dueBefore,"Replaying a problem must not defer a due review");
state=L.recordCompletion(state,{family:"functions-composition",seed:101,independent:true,hadError:false,at:at+day});
assert.equal(state.skills.composition.level,2);
assert.equal(state.skills.composition.reviewed,1);
state=L.recordCompletion(state,{family:"functions-composition",seed:102,independent:true,hadError:false,at:at+4*day});
assert.equal(state.skills.composition.level,3);
assert.equal(L.plan(state,{now:at+4*day,onlyDue:true}),null);
const priority=L.plan(state,{now:at+4*day});
assert.ok(priority&&priority.family);
let personalized=L.fresh();
personalized=L.recordMiss(personalized,{family:"deriv-chain-power",code:"missing-inner-derivative",at});
assert.equal(personalized.skills["derivative-chain"].mistakes["missing-inner-derivative"],1);
const recovery=L.plan(personalized,{now:at});
assert.equal(recovery.skill.id,"derivative-basic","Should suggest an unlearned prerequisite before repeating the weak chain rule");
personalized=L.recordRepair(personalized,{family:"deriv-chain-power",at});
assert.equal(personalized.skills["derivative-chain"].level,0,"Solving micro repair must not prove full mastery");
personalized=L.recordCompletion(personalized,{family:"deriv-chain-power",seed:77,independent:false,hadError:true,at});
assert.equal(personalized.skills["derivative-chain"].level,0);
assert.equal(personalized.skills["derivative-chain"].supported,1);
assert.equal(L.dueCount(personalized,at),1);
assert.equal(L.plan(personalized,{now:at,onlyDue:true}).skill.id,"derivative-chain");
const json=JSON.parse(JSON.stringify(personalized));
assert.equal(L.hydrate(json).skills["derivative-chain"].repairs,1);
const all=L.skills.map(s=>s.id);
for(const skill of L.skills)for(const prerequisite of skill.prerequisites)
 assert.ok(all.includes(prerequisite),"Invalid prerequisite "+prerequisite);
console.log("PASS: 218 family-skill mappings, confirmed error patterns, repair questions, mastery, no repeat credit, spaced reviews and prerequisite-based practice.");
