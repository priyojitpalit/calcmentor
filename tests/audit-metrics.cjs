// Run: node tests/audit-metrics.cjs
// Diagnostic audit; does not modify the site or test runner's exit status.
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const files=["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
 "extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js"];
const sandbox={window:{}};vm.createContext(sandbox);
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),sandbox,{filename:f});
const {CalcMath,CalcBank}=sandbox.window;
let levels={},groups={},stepCounts={},responseTypes={};
let uniqueFamilies=0,lowDiversity=[],badExpected=[],uniqueQuestionCount=0;
let sampleSeed=20261021>>>0;
const next=()=>((sampleSeed=Math.imul(1664525,sampleSeed)+1013904223>>>0));
for(const fam of CalcBank.families){
 levels[fam.level]=(levels[fam.level]||0)+1;
 groups[fam.group]=(groups[fam.group]||0)+1;
 const p=CalcBank.generate(fam.id,71839);
 stepCounts[p.steps.length]=(stepCounts[p.steps.length]||0)+1;
 for(const step of p.steps)responseTypes[step.type]=(responseTypes[step.type]||0)+1;
 const questions=new Set;
 for(let i=0;i<300;i++){
   const generated=CalcBank.generate(fam.id,next());
   questions.add(generated.statement);
   for(const [index,step] of generated.steps.entries()){
     if(!CalcMath.check(String(step.answer),step).ok)badExpected.push({id:fam.id,index,seed:sampleSeed});
   }
 }
 uniqueQuestionCount+=questions.size;
 if(questions.size<100)lowDiversity.push({id:fam.id,uniqueStatements:questions.size});
}
const probes={
 wrongExpressionNearAccepted:CalcMath.check("x+0.00001",{type:"expr",answer:"x"}).ok,
 validAntiderivativeConstantAccepted:CalcMath.check("x^2/2+7",{type:"expr",answer:"x^2/2"}).ok,
 symbolicCInAntiderivativeAccepted:CalcMath.check("x^2/2+C",{type:"expr",answer:"x^2/2"}).ok,
};
console.log(JSON.stringify({
 familyCount:CalcBank.families.length,
 groups,levels,stepCounts,responseTypes,
 generatedVariationSample:300,
 familiesWithUnder100SampledStatements:lowDiversity.length,
 tenLowestVariationFamilies:lowDiversity.sort((a,b)=>a.uniqueStatements-b.uniqueStatements).slice(0,10),
 expectedAnswersRejected:badExpected.length,
 gradingProbes:probes
},null,2));
