/* CalcMentor learning model. Browser-local, deterministic, and testable. */
(function(){
"use strict";
const B=window.CalcBank;
const skills=[
 ["composition","Function composition","foundations",[]],
 ["domains","Domains and restrictions","foundations",["composition"]],
 ["inverses","Inverse functions","foundations",["composition"]],
 ["limit-algebra","Algebraic limits","limits",["domains"]],
 ["limit-behavior","One-sided limits and infinity","limits",["limit-algebra"]],
 ["continuity","Continuity and limit theorems","limits",["limit-behavior"]],
 ["derivative-basic","Derivative definition and power rules","differentiation",["limit-algebra"]],
 ["derivative-chain","Chain rule and nested derivatives","differentiation",["derivative-basic","composition"]],
 ["derivative-product","Product and quotient rules","differentiation",["derivative-basic"]],
 ["derivative-implicit","Implicit and logarithmic differentiation","differentiation",["derivative-chain"]],
 ["derivative-trig","Trig and inverse-trig derivatives","differentiation",["derivative-chain"]],
 ["rates","Related rates","applications",["derivative-chain"]],
 ["optimization","Optimization and extrema","applications",["derivative-basic"]],
 ["graph-analysis","Derivative signs and graph behavior","applications",["derivative-basic"]],
 ["theorems","Mean Value Theorem and approximations","applications",["derivative-basic"]],
 ["motion","Position, velocity and acceleration","applications",["derivative-basic"]],
 ["antiderivatives","Antiderivative rules","integration",["derivative-basic"]],
 ["substitution","Integration by substitution","integration",["antiderivatives","derivative-chain"]],
 ["riemann","Riemann sums and definite integrals","integration",["limit-algebra"]],
 ["ftc","Fundamental Theorem of Calculus","integration",["antiderivatives","riemann"]],
 ["integral-area","Areas and accumulated quantities","integral-applications",["ftc"]],
 ["integral-volume","Volumes and cross-sections","integral-applications",["integral-area"]],
 ["integral-models","Work, surplus, and physical models","integral-applications",["ftc"]]
].map(([id,name,group,prerequisites])=>Object.freeze({id,name,group,prerequisites}));
const byId=new Map(skills.map(s=>[s.id,s]));
const familySkill=new Map();
function chooseSkill(f){
 const id=f.id.toLowerCase(),topic=(f.topic||"").toLowerCase(),group=f.group;
 if(group==="foundations"){
  if(/inverse/.test(id+" "+topic))return "inverses";
  if(/domain|excluded|restriction/.test(id+" "+topic))return "domains";
  return "composition";
 }
 if(group==="limits"){
  if(/continu|ivt|classify|removable|piecewise/.test(id+" "+topic))return "continuity";
  if(/one-sided|vertical|infinity|absolute-left|absolute-ratio/.test(id+" "+topic))return "limit-behavior";
  return "limit-algebra";
 }
 if(group==="differentiation"){
  if(/implicit|logarithmic|log-xpower|exp-x2/.test(id))return "derivative-implicit";
  if(/product|quotient/.test(id))return "derivative-product";
  if(/trig|sin|cos|sec|csc|cot|atan|asin|acos|tangent-sine|inverse-trig|hyperbolic/.test(id))return "derivative-trig";
  if(/chain|exp|sqrt|negative-power|ln|log10|rational-asymptote/.test(id))return "derivative-chain";
  return "derivative-basic";
 }
 if(group==="applications"){
  if(/related/.test(id))return "rates";
  if(/opt|profit|revenue|nearest|fixed-sum/.test(id))return "optimization";
  if(/motion|velocity|acceleration/.test(id))return "motion";
  if(/mvt|rolle|lineariz|newton|lhopital/.test(id))return "theorems";
  return "graph-analysis";
 }
 if(group==="integration"){
  if(/riemann|signed-area|definite|even|odd|absolute-value|average/.test(id))return "riemann";
  if(/ftc/.test(id))return "ftc";
  if(/sub/.test(id))return "substitution";
  return "antiderivatives";
 }
 if(group==="integral-applications"){
  if(/washer|shell|disk|cone|cross-section|slicing/.test(id))return "integral-volume";
  if(/work|spring|mass|surplus|density|particle|displacement/.test(id))return "integral-models";
  return "integral-area";
 }
 throw Error("Unmapped course unit "+group);
}
for(const f of B.families){
 const skill=chooseSkill(f);if(!byId.has(skill))throw Error("Unmapped skill");
 familySkill.set(f.id,skill);
}
const intervals=[0,1,3,7,14]; // days: an estimate for review scheduling, not proof of retention
const day=86400000;
function fresh(){return {version:1,skills:{},families:{},events:[]};}
function validDate(value){const ms=Date.parse(value);return Number.isFinite(ms)?ms:0;}
function hydrate(obj){
 if(!obj||typeof obj!=="object")return fresh();
 return {version:1,skills:obj.skills&&typeof obj.skills==="object"?obj.skills:{},
 families:obj.families&&typeof obj.families==="object"?obj.families:{},
 events:Array.isArray(obj.events)?obj.events.slice(-160):[]};
}
function recordFor(state,id){
 if(!state.skills[id])state.skills[id]={level:0,independent:0,supported:0,misses:0,repairs:0,
 reviewed:0,lastAt:null,dueAt:null,seen:[],mistakes:{}};
 return state.skills[id];
}
function status(record,now=Date.now()){
 if(!record||!record.independent)return "Not yet demonstrated";
 if(record.dueAt&&validDate(record.dueAt)<=now)return "Review due";
 if(record.level>=3&&record.reviewed>=1)return "Retained in review";
 if(record.level>=3)return "Promising; review pending";
 return "Developing";
}
function recordMiss(state,{family,code,at}){
 const s=hydrate(state),id=familySkill.get(family);
 if(!id||!code)return s;
 const item=recordFor(s,id);
 item.misses++;
 item.mistakes[code]=(item.mistakes[code]||0)+1;
 item.lastMistake=code;
 item.dueAt=new Date(at||Date.now()).toISOString();
 s.events.push({type:"misconception",skill:id,family,code,date:new Date(at||Date.now()).toISOString()});
 s.events=s.events.slice(-160);
 return s;
}
function recordRepair(state,{family,at}){
 const s=hydrate(state),id=familySkill.get(family);
 if(id)recordFor(s,id).repairs++;
 s.events.push({type:"repair",skill:id,family,date:new Date(at||Date.now()).toISOString()});
 s.events=s.events.slice(-160);
 return s;
}
function recordCompletion(state,{family,seed,independent,hadError,at}){
 const s=hydrate(state),id=familySkill.get(family);
 if(!id)return s;
 const time=typeof at==="number"?at:validDate(at)||Date.now();
 const row=recordFor(s,id),f=s.families[family]||(s.families[family]={attempts:0,independent:0});
 const instance=family+":"+seed;
 const repeated=row.seen.includes(instance);
 const wasDue=row.dueAt&&validDate(row.dueAt)<=time;
 f.attempts++;if(independent)f.independent++;
 if(independent&&!repeated){
  row.independent++;row.level=Math.min(4,row.level+1);
  if(wasDue&&row.independent>1)row.reviewed++;
 }else if(!independent){
  row.supported++;
  if(hadError)row.level=Math.max(0,row.level-1);
 }
 row.seen=[...row.seen.filter(k=>k!==instance),instance].slice(-120);
 row.lastAt=new Date(time).toISOString();
 // Repeating exactly the same generated question is not new evidence of retention.
 // It must not move an already-due review into the future.
 const wait=independent&&!repeated?intervals[row.level]:0;
 if(!repeated||!independent)row.dueAt=new Date(time+wait*day).toISOString();
 s.events.push({type:"completion",skill:id,family,date:row.lastAt,independent:!!independent&&!repeated});
 s.events=s.events.slice(-160);
 return s;
}
function plan(state,{now=Date.now(),exclude=null,onlyDue=false}={}){
 const s=hydrate(state);
 const ordered=B.families;
 const groups=new Map(skills.map(skill=>[skill.id,ordered.filter(f=>familySkill.get(f.id)===skill.id)]));
 const studied=skills.filter(sk=>s.skills[sk.id]&&
  (s.skills[sk.id].independent+s.skills[sk.id].supported+s.skills[sk.id].misses)>0);
 function pick(skill,reason){
  const fams=groups.get(skill.id)||[];
  if(!fams.length)return null;
  const ranked=fams.slice().sort((a,b)=>{
   const x=s.families[a.id]||{},y=s.families[b.id]||{};
   const scoreX=(x.attempts||0)*5+(a.id===exclude?3:0);
   const scoreY=(y.attempts||0)*5+(b.id===exclude?3:0);
   return scoreX-scoreY||ordered.indexOf(a)-ordered.indexOf(b);
  });
  return {family:ranked[0],skill,reason,mode:(s.skills[skill.id]?.level||0)>=3?"independent":"guided"};
 }
 const due=studied.filter(sk=>{
  const x=s.skills[sk.id];return x.dueAt&&validDate(x.dueAt)<=now;
 }).sort((a,b)=>validDate(s.skills[a.id].dueAt)-validDate(s.skills[b.id].dueAt)||
 (s.skills[a.id].level||0)-(s.skills[b.id].level||0));
 if(due.length){
  const sk=due[0],level=s.skills[sk.id].level;
  if(level<=1){
   const weakPrereq=sk.prerequisites.map(id=>byId.get(id)).find(p=>{
    const x=s.skills[p.id];return !x||x.level===0;
   });
   if(weakPrereq&&!onlyDue&&s.skills[sk.id].misses>0)
    return pick(weakPrereq,"Review a prerequisite for "+sk.name);
  }
  return pick(sk,"Scheduled review: "+sk.name);
 }
 if(onlyDue)return null;
 if(studied.length){
  const ranked=studied.slice().sort((a,b)=>(s.skills[a.id].level||0)-(s.skills[b.id].level||0)||
   (s.skills[b.id].misses||0)-(s.skills[a.id].misses||0));
  const weak=ranked[0];
  if(s.skills[weak.id].level<=1)return pick(weak,"Strengthen "+weak.name);
 }
 const unseen=skills.find(sk=>(groups.get(sk.id)||[]).length&&(!s.skills[sk.id]||!s.skills[sk.id].independent));
 if(unseen)return pick(unseen,"Build the next skill: "+unseen.name);
 const weak=skills.filter(sk=>(groups.get(sk.id)||[]).length).sort((a,b)=>
 (s.skills[a.id]?.level||0)-(s.skills[b.id]?.level||0))[0];
 return weak?pick(weak,"Continue practicing "+weak.name):null;
}
function dueCount(state,now=Date.now()){
 const s=hydrate(state);
 return skills.filter(sk=>{const r=s.skills[sk.id];return r?.dueAt&&validDate(r.dueAt)<=now}).length;
}
window.CalcLearning=Object.freeze({skills,skillOf:family=>familySkill.get(family),
 getSkill:family=>byId.get(familySkill.get(family)),fresh,hydrate,recordMiss,recordRepair,
 recordCompletion,plan,dueCount,status,day});
})();
