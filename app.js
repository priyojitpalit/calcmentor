/* CalcMentor application – progressive steps, deliberate practice, visual laboratories. */
(function(){
"use strict";
const B=window.CalcBank,M=window.CalcMath,byId=id=>document.getElementById(id);
const e=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const pretty=s=>e(s).replace(/\^\(([-−]?\d+)\)/g,(_,n)=>"<sup>"+n+"</sup>").replace(/\^(-?\d+)/g,(_,n)=>"<sup>"+n+"</sup>").replace(/sqrt\(/g,"√(").replace(/\bpi\b/g,"π").replace(/\bexp\(/g,"exp(").replace(/\*/g,"·");
const safeId=s=>B.families.some(x=>x.id===s);
const targetLevel=(new URLSearchParams(location.search)).get("level")||"all";
const initialFamily=(new URLSearchParams(location.search)).get("family");
const initialSeed=Number((new URLSearchParams(location.search)).get("seed"));
const cacheKey="calcmentor-v2-progress";
function load(){
 try{const d=JSON.parse(localStorage.getItem(cacheKey)||"{}");return {topics:d.topics||{},history:Array.isArray(d.history)?d.history:[]};}
 catch(_){return {topics:{},history:[]};}
}
let progress=load(),state={family:safeId(initialFamily)?initialFamily:"apps-opt-box",seed:Number.isSafeInteger(initialSeed)&&initialSeed>0?initialSeed:(Math.floor(Math.random()*2147483000)+1),view:"practice",level:["all","2","3","4"].includes(targetLevel)?targetLevel:"all",mode:"guided",stepIndex:0,done:[],wrong:false,hintCount:0,shownHint:0,reveal:false,completed:false,solutionViewed:false,directFinal:false};
let activeProblem=null;
function save(){try{localStorage.setItem(cacheKey,JSON.stringify(progress));}catch(_){}}
function setLink(){
 if(location.protocol==="http:"||location.protocol==="https:"){
  const q=new URLSearchParams();q.set("family",state.family);q.set("seed",String(state.seed));
  history.replaceState(null,"",location.pathname+"?"+q);
 }
}
function renderNav(){
 const query=byId("searchFamily").value.toLowerCase().trim();
 const current=state.family,groups=B.groups;
 byId("chapters").innerHTML=groups.map(g=>{
  const fam=B.families.filter(f=>f.group===g.id&&(!query||(f.title+" "+f.topic+" "+g.name).toLowerCase().includes(query)));
  if(!fam.length)return "";
  const expanded=query||g.id===B.families.find(x=>x.id===current)?.group||document.querySelector('[data-group="'+g.id+'"].expanded');
  return '<div class="chapter"><button type="button" class="chapter-title" data-group="'+g.id+'" aria-expanded="'+!!expanded+'"><span>'+e(g.name)+'</span><span class="count">'+fam.length+' '+(expanded?"▾":"▸")+'</span></button>'+
  '<div class="chapter-body" data-body="'+g.id+'" '+(expanded?"":"hidden")+">"+
  fam.map(f=>'<button type="button" class="family-btn '+(f.id===current?"active":"")+'" data-family="'+f.id+'"><span>'+e(f.title)+'</span>'+(progress.topics[f.id]?.solved?'<span class="mark" title="Practiced">✓</span>':"")+"</button>").join("")+"</div></div>";
 }).join("");
}
function renderInfo(){
 let solved=progress.history.length,unaided=progress.history.filter(h=>h.unaided).length,seen=Object.values(progress.topics).filter(v=>v.solved).length;
 byId("metricSolved").textContent=String(solved);
 byId("metricIndependent").textContent=String(unaided);
 byId("metricTopics").textContent=seen+"/"+B.families.length;
}
function changeView(view){
 state.view=view;
 ["practice","visual","progress"].forEach(v=>{byId(v+"View").hidden=v!==view;byId("tab-"+v).classList.toggle("active",v===view);byId("tab-"+v).setAttribute("aria-current",v===view?"page":"false");});
 if(view==="visual"){drawSecant();drawRiemann();}
 if(view==="progress")renderProgress();
}
function setFamily(id,seed){
 if(!safeId(id))return;
 state.family=id;state.seed=seed||Math.floor(Math.random()*2147483646)+1;
 state.stepIndex=0;state.done=[];state.wrong=false;state.hintCount=0;state.shownHint=0;state.reveal=false;state.completed=false;state.solutionViewed=false;state.directFinal=false;
 activeProblem=B.generate(id,state.seed);
 setLink();renderNav();renderProblem();changeView("practice");
}
function currentSteps(){return state.mode==="guided"?activeProblem.steps:[activeProblem.steps[activeProblem.steps.length-1]];}
function renderProblem(){
 const f=B.families.find(x=>x.id===state.family),p=activeProblem,steps=currentSteps();
 byId("problemTopic").textContent=p.topic;
 byId("problemTitle").textContent=p.title;
 byId("problemStatement").innerHTML=pretty(p.statement);
 byId("problemLevel").textContent="Level "+p.level+" / 4";
 byId("problemCount").textContent=state.mode==="guided"?steps.length+" assessed steps":"Independent final-answer mode";
 byId("modeButton").textContent=state.mode==="guided"?"Switch to final answer":"Switch to guided steps";
 byId("levelSelect").value=state.level;
 const trail=byId("doneSteps");
 trail.innerHTML=state.done.map((d,i)=>'<div class="done-step"><strong>✓</strong><span><b>Step '+(i+1)+'</b>: '+e(d.q)+' <span style="color:#64748b">('+e(d.answer)+')</span></span></div>').join("");
 const root=byId("stepArea");
 if(state.completed){
  root.innerHTML='<div class="panel complete"><h3>Problem completed</h3><p>'+ (state.solutionViewed?'The full solution was viewed during this attempt.':state.directFinal?'Your final answer is correct. You did not need to submit the intermediate steps.':'Your answers passed the mathematical checks.') +
    ' Select another version or switch topics to continue.</p><div class="practice-actions"><button class="btn btn-primary" id="completeNew">Another version</button><button class="btn" id="completeMixed">Mixed practice</button></div></div>';
  byId("completeNew").onclick=()=>setFamily(state.family);
  byId("completeMixed").onclick=()=>mixed();
  renderInfo();return;
 }
 const s=steps[state.stepIndex];if(!s)return;
 const response=s.type==="choice"
   ?'<div class="choices" role="radiogroup" aria-label="Select an answer">'+s.options.map(c=>'<label class="option"><input type="radio" name="answerChoice" value="'+e(c.value)+'"><span>'+e(c.label)+'</span></label>').join("")+'</div>'
   :'<div class="response"><input class="answer" id="answerInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your mathematical answer" placeholder="'+(s.type==="number"?"Enter a number or exact expression":"Enter a mathematical expression")+'"><button class="btn btn-primary" id="checkButton">Check</button></div>';
 root.innerHTML='<div class="panel step-card"><div class="step-count">Step '+(state.stepIndex+1)+' of '+steps.length+'</div><h3>'+pretty(s.q)+'</h3>'+response+
 (s.type==="choice"?'<button class="btn btn-primary" id="checkButton">Check selection</button>':'<div class="keyboard-help">Use ^ for powers, * for multiplication, sqrt(...), sin(...), ln(...), pi. Equivalent expressions are accepted where supported. If you already know the final answer, enter it here; guided steps are optional.</div>')+
 '<div class="practice-actions"><button class="btn btn-small" id="hintBtn">Hint ('+state.shownHint+'/2)</button><button class="btn btn-small btn-plain" id="revealBtn">Show worked solution</button><button class="btn btn-small btn-plain" id="skipBtn" title="Try another parameter version">New numbers</button></div>'+
 '<div id="hintBlock"></div><div id="feedback" aria-live="polite"></div></div>';
 byId("checkButton").onclick=checkStep;
 const input=byId("answerInput");if(input){input.addEventListener("keydown",evt=>{if(evt.key==="Enter")checkStep();});}
 byId("hintBtn").onclick=showHint;byId("revealBtn").onclick=()=>{state.solutionViewed=true;state.reveal=!state.reveal;renderWorked();};byId("skipBtn").onclick=()=>setFamily(state.family);
 renderHints();renderWorked();
}
function showHint(){
 state.shownHint=Math.min(2,state.shownHint+1);state.hintCount++;
 renderHints();
}
function renderHints(){
 const p=currentSteps()[state.stepIndex];
 const hint=byId("hintBlock"),button=byId("hintBtn");
 if(!hint||!button)return;
 button.textContent="Hint ("+state.shownHint+"/2)";
 button.disabled=state.shownHint===2;
 hint.innerHTML=state.shownHint?'<div class="hint-box"><b>Hint '+state.shownHint+'</b><div>'+e(p.hints[state.shownHint-1])+'</div></div>':"";
}
function renderWorked(){
 const old=byId("workedPath");if(old)old.remove();
 if(!state.reveal)return;
 const steps=activeProblem.steps;
 const area=document.createElement("div");
 area.id="workedPath";area.className="worked";
 area.innerHTML='<h3>Worked solution</h3><ol>'+steps.map(s=>'<li><strong>'+e(s.q)+'</strong><span>'+e(s.why)+'</span></li>').join("")+'</ol><p style="font-size:12px;color:#64748b;margin:0">Viewing the full solution is recorded as a supported attempt, not independent practice.</p>';
 byId("stepArea").querySelector(".step-card")?.appendChild(area);
}
function showFeedback(message,correct){
 const target=byId("feedback");if(target)target.innerHTML='<div class="feedback '+(correct?"correct":"wrong")+'">'+e(message)+'</div>';
}
function checkStep(){
 const steps=currentSteps(), step=steps[state.stepIndex];if(!step)return;
 const selected=step.type==="choice"?document.querySelector('input[name="answerChoice"]:checked')?.value:byId("answerInput")?.value;
 // In guided mode, the mathematical checker also compares a response with later
 // steps. The student may supply a fully correct answer without following the scaffold.
 const evaluation=M.evaluateAttempt(selected,steps,state.stepIndex);
 if(evaluation.kind==="final"){
  state.directFinal=true;
  state.done.push({q:"Final answer (entered directly)",answer:String(selected).trim()});
  state.stepIndex=steps.length;
  finishProblem();return;
 }
 if(evaluation.kind==="later"){
  showFeedback(evaluation.message,true);
  return;
 }
 if(evaluation.kind==="incorrect"){
  if(selected!==undefined&&String(selected).trim())state.wrong=true;
  const feedback=evaluation.parseError||!String(selected??"").trim()
    ? evaluation.message
    : "That does not answer this step. "+step.hints[0];
  showFeedback(feedback,false);
  return;
 }
 const modelAnswer=step.type==="choice"?step.options.find(v=>v.value===String(step.answer))?.label:step.answer;
 state.done.push({q:step.q,answer:modelAnswer||step.answer});
 state.stepIndex++;state.shownHint=0;state.reveal=false;
 if(state.stepIndex>=steps.length){finishProblem();}else{renderProblem();}
}
function finishProblem(){
 state.completed=true;
 const topic=progress.topics[state.family]||{solved:0,independent:0,withHelp:0};
 topic.solved++;
 const unaided=!state.wrong&&!state.hintCount&&!state.solutionViewed;
 if(unaided)topic.independent++;else topic.withHelp++;
 progress.topics[state.family]=topic;
 progress.history.unshift({id:state.family,topic:activeProblem.title,date:new Date().toISOString(),unaided,hints:state.hintCount,wrong:state.wrong,solutionViewed:state.solutionViewed});
 progress.history=progress.history.slice(0,200);
 save();renderNav();renderProblem();
}
function mixed(){
 const candidates=B.families.filter(f=>state.level==="all"||String(f.level)===state.level);
 const next=candidates[Math.floor(Math.random()*candidates.length)]||B.families[0];
 setFamily(next.id);
}
function anotherTopic(){
 const group=B.families.find(f=>f.id===state.family)?.group;
 const options=B.families.filter(f=>f.group===group&&f.id!==state.family&&(state.level==="all"||String(f.level)===state.level));
 if(!options.length){mixed();return;}
 setFamily(options[Math.floor(Math.random()*options.length)].id);
}
function practiceWeak(){
 const ranked=B.families.map(f=>{
  const p=progress.topics[f.id];return {f,score:p?.withHelp?((p.withHelp+1)/(p.solved+1)):0};
 }).sort((a,b)=>b.score-a.score);
 const selected=ranked[0].score>0?ranked[0].f:B.families.find(f=>f.level===4);
 setFamily(selected.id);
}
function renderProgress(){
 const h=progress.history,ids=Object.keys(progress.topics);
 byId("progressTotal").textContent=h.length;
 byId("progressIndependent").textContent=h.filter(i=>i.unaided).length;
 byId("progressTopics").textContent=ids.filter(i=>progress.topics[i].solved>0).length+"/"+B.families.length;
 const grouped=B.groups.map(g=>{
  const fam=B.families.filter(f=>f.group===g.id),seen=fam.filter(f=>progress.topics[f.id]?.solved).length;
  return '<tr><td>'+e(g.name)+'</td><td>'+seen+' / '+fam.length+'</td><td>'+fam.reduce((n,f)=>n+(progress.topics[f.id]?.independent||0),0)+'</td></tr>';
 });
 byId("progressTable").innerHTML=grouped.join("");
 byId("recentTable").innerHTML=h.length?h.slice(0,12).map(v=>'<tr><td>'+e(v.topic)+'</td><td>'+(v.unaided?"Independent":"With support")+'</td><td>'+new Date(v.date).toLocaleDateString()+'</td></tr>').join(""):'<tr><td colspan="3" class="empty">No completed problems yet.</td></tr>';
}
function line(ctx,x1,y1,x2,y2,color,width=1,dash=[]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);}
function graphCanvas(id,callback){
 const canvas=byId(id);if(!canvas)return;const rect=canvas.getBoundingClientRect();const scale=Math.min(2,window.devicePixelRatio||1);const W=Math.max(320,Math.round(rect.width)),H=290;
 canvas.width=Math.round(W*scale);canvas.height=Math.round(H*scale);canvas.style.height=H+"px";
 const ctx=canvas.getContext("2d");ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,W,H);
 callback(ctx,W,H);
}
function axes(ctx,W,H,xb,xe,yb,ye){
 const left=45,right=15,top=14,bottom=29,pw=W-left-right,ph=H-top-bottom;
 const px=x=>left+(x-xb)/(xe-xb)*pw,py=y=>top+(ye-y)/(ye-yb)*ph;
 ctx.font="11px system-ui";ctx.fillStyle="#6b7a89";ctx.lineWidth=.8;
 const dx=(xe-xb)<=5?.5:1,dy=(ye-yb)<=6?1:2;
 for(let x=Math.ceil(xb/dx)*dx;x<=xe;x+=dx){line(ctx,px(x),top,px(x),H-bottom,"#edf1f5");ctx.fillText(String(+x.toFixed(1)),px(x)-7,H-11);}
 for(let y=Math.ceil(yb/dy)*dy;y<=ye;y+=dy){line(ctx,left,py(y),W-right,py(y),"#edf1f5");ctx.fillText(String(+y.toFixed(1)),5,py(y)+4);}
 if(xb<=0&&xe>=0)line(ctx,px(0),top,px(0),H-bottom,"#9aabbc");
 if(yb<=0&&ye>=0)line(ctx,left,py(0),W-right,py(0),"#9aabbc");
 return {px,py};
}
function drawSecant(){
 const a=Number(byId("pointSlider").value),h=Number(byId("hSlider").value);
 byId("pointValue").textContent=a.toFixed(1);byId("hValue").textContent=h.toFixed(2);
 const sec=2*a+h,tan=2*a;
 byId("secantResult").innerHTML='Secant slope: <b>'+sec.toFixed(3)+'</b> &nbsp; Tangent slope: <b>'+tan.toFixed(3)+'</b> &nbsp; Difference: <b>'+Math.abs(h).toFixed(3)+'</b>';
 graphCanvas("secantPlot",(ctx,W,H)=>{
  const {px,py}=axes(ctx,W,H,-4,4,-2,17);
  function fn(x){return x*x;}
  function plot(f,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();for(let i=0;i<=250;i++){const x=-4+8*i/250,y=f(x);if(i===0)ctx.moveTo(px(x),py(y));else ctx.lineTo(px(x),py(y));}ctx.stroke();}
  plot(fn,"#2c5f9d",2.5);
  plot(x=>a*a+tan*(x-a),"#1b946e",1.8);
  plot(x=>a*a+sec*(x-a),"#d38631",1.8);
  for(const x of [a,a+h]){ctx.beginPath();ctx.arc(px(x),py(fn(x)),4,0,2*Math.PI);ctx.fillStyle="#203e64";ctx.fill();}
 });
}
function drawRiemann(){
 const n=Number(byId("rectangleSlider").value);byId("rectangleValue").textContent=n;
 const exact=14/3,dx=2/n,approx=0;
 let sum=0;for(let i=1;i<=n;i++)sum+=(1+(i*dx)**2)*dx;
 byId("riemannResult").innerHTML='Right sum: <b>'+sum.toFixed(6)+'</b> &nbsp; Exact integral: <b>'+exact.toFixed(6)+'</b> &nbsp; Error: <b>'+Math.abs(sum-exact).toFixed(6)+'</b>';
 graphCanvas("riemannPlot",(ctx,W,H)=>{
  const {px,py}=axes(ctx,W,H,-.15,2.15,0,5.5);
  for(let i=1;i<=n;i++){const x=i*dx,prev=(i-1)*dx,v=1+x*x;ctx.fillStyle="rgba(37,92,154,.12)";ctx.fillRect(px(prev),py(v),px(x)-px(prev),py(0)-py(v));ctx.strokeStyle="rgba(37,92,154,.43)";ctx.lineWidth=.6;ctx.strokeRect(px(prev),py(v),px(x)-px(prev),py(0)-py(v));}
  ctx.beginPath();for(let i=0;i<=200;i++){const x=2*i/200,y=1+x*x;if(i===0)ctx.moveTo(px(x),py(y));else ctx.lineTo(px(x),py(y));}ctx.lineWidth=2;ctx.strokeStyle="#21528b";ctx.stroke();
 });
}
function wire(){
 document.querySelectorAll("[data-view]").forEach(btn=>btn.onclick=()=>changeView(btn.dataset.view));
 byId("chapters").addEventListener("click",event=>{
  const family=event.target.closest("[data-family]");if(family){setFamily(family.dataset.family);return;}
  const header=event.target.closest(".chapter-title");if(header){
   const body=byId("chapters").querySelector('[data-body="'+header.dataset.group+'"]');
   if(body){body.hidden=!body.hidden;header.classList.toggle("expanded",!body.hidden);header.setAttribute("aria-expanded",String(!body.hidden));}
  }
 });
 byId("searchFamily").addEventListener("input",renderNav);
 byId("levelSelect").addEventListener("change",evt=>{state.level=evt.target.value;});
 byId("modeButton").onclick=()=>{state.mode=state.mode==="guided"?"independent":"guided";setFamily(state.family,state.seed);};
 byId("newVariant").onclick=()=>setFamily(state.family);
 byId("newTopic").onclick=anotherTopic;
 byId("mixedButton").onclick=mixed;
 byId("weakButton").onclick=practiceWeak;
 byId("copyLink").onclick=async()=>{
  if(location.protocol==="file:"){alert("Share links work after the website is published on GitHub Pages.");return;}
  try{await navigator.clipboard.writeText(location.href);byId("copyLink").textContent="Link copied";setTimeout(()=>byId("copyLink").textContent="Copy problem link",1800);}
  catch(_){window.prompt("Copy this problem link:",location.href);}
 };
 byId("pointSlider").addEventListener("input",drawSecant);
 byId("hSlider").addEventListener("input",drawSecant);
 byId("rectangleSlider").addEventListener("input",drawRiemann);
 window.addEventListener("resize",()=>{if(state.view==="visual"){drawSecant();drawRiemann();}});
 byId("exportButton").onclick=()=>{
  const rows=[["Date","Topic","Problem ID","Independent","Hints","Incorrect submission","Solution viewed"],...progress.history.map(h=>[h.date,h.topic,h.id,h.unaided,h.hints,h.wrong,h.solutionViewed])];
  const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const link=document.createElement("a");link.href=url;link.download="calcmentor-practice.csv";link.click();setTimeout(()=>URL.revokeObjectURL(url),500);
 };
 byId("resetButton").onclick=()=>{if(confirm("Clear all CalcMentor practice history on this device?")){progress={topics:{},history:[]};save();renderProgress();renderInfo();renderNav();}};
}
wire();setFamily(state.family,state.seed);renderInfo();
})();