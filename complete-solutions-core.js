/* Complete CalcMentor solution authoring registry. Loaded after worked-solutions.js. */
(function(){
"use strict";
const original=window.CalcSolutions.build,methods=[];
function item(title,equation,note=""){return {title:String(title),equation:String(equation||""),note:String(note||"")};}
const grab=(s,pattern)=>{const m=s.match(pattern);return m?m.slice(1):null;};
const coeff=x=>Number(x);
function answer(p,i=-1){
 const s=i<0?p.steps.at(-1):p.steps[i];
 if(!s)return "";
 return s.type==="choice"?(s.options?.find(o=>String(o.value)===String(s.answer))?.label||s.answer):String(s.answer);
}
function trace(p,lines){
 if(!Array.isArray(lines)||lines.length<3||lines.some(x=>!x||!x.title||!x.equation))return null;
 const out=lines.map(z=>item(z.title,z.equation,z.note));
 const last=answer(p);
 // Always close with the actual generated answer; methods derive their working independently.
 if(!out.some(x=>x.equation.replace(/\s/g,"").includes(String(last).replace(/\s/g,"")))){
  out.push(item("Final answer",last+(p.steps.at(-1).type==="antiderivative"?" + C":""),"This is the result corresponding to the original question."));
 }
 return out;
}
window.CalcSolutionDetails={
 item,grab,coeff,answer,trace,
 register:(group,fn)=>methods.push({group,fn}),
 covered:(p)=>original(p).detailed||methods.some(m=>m.group===p.group&&Array.isArray(m.fn(p)))
};
window.CalcSolutions.build=p=>{
 const existing=original(p);
 if(existing.detailed)return existing;
 for(const m of methods){
  if(m.group!==p.group)continue;
  let steps;
  try{steps=m.fn(p)}catch(e){continue;}
  if(!steps)continue;
  const final=trace(p,steps);
  if(final)return {detailed:true,items:final};
 }
 return existing;
};
})();