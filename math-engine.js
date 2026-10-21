/* CalcMentor mathematics engine – no network, no eval of student text. */
(function(){
  "use strict";
  const FUNCTIONS={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,
    sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,sqrt:Math.sqrt,abs:Math.abs,
    ln:Math.log,log:Math.log,log10:Math.log10,exp:Math.exp,sec:x=>1/Math.cos(x),
    csc:x=>1/Math.sin(x),cot:x=>1/Math.tan(x)};
  function tokenize(source){
    const s=String(source).trim().replace(/[−–]/g,"-").replace(/π/g,"pi").replace(/×/g,"*").replace(/÷/g,"/");
    if(s.length>400)throw Error("Expression is too long.");
    const raw=[],re=/\s*([0-9]+(?:\.[0-9]*)?|\.[0-9]+|[a-zA-Z_][a-zA-Z_0-9]*|[()+\-*/^])\s*/gy;
    let pos=0,m;
    while(pos<s.length){
      re.lastIndex=pos;m=re.exec(s);
      if(!m||m.index!==pos)throw Error("Unsupported character near “"+s.slice(pos,pos+12)+"”.");
      raw.push(m[1]);pos=re.lastIndex;
    }
    if(!raw.length)throw Error("Enter an answer.");
    const out=[];
    const atomEnd=t=>t===")"||/^(?:\d|\.)/.test(t)||/^[A-Za-z_]/.test(t);
    const atomStart=t=>t==="("||/^(?:\d|\.)/.test(t)||/^[A-Za-z_]/.test(t);
    for(let i=0;i<raw.length;i++){
      const t=raw[i],prev=raw[i-1];
      if(i&&atomEnd(prev)&&atomStart(t)&&!(FUNCTIONS[prev]&&t==="("))out.push("*");
      out.push(t);
    }
    return out;
  }
  function parse(source){
    const tokens=tokenize(source);let i=0;
    const peek=()=>tokens[i],take=()=>tokens[i++];
    function primary(){
      const t=take();
      if(t===undefined)throw Error("The expression ends unexpectedly.");
      if(t==="("){const value=add();if(take()!==")")throw Error("A closing parenthesis is missing.");return value;}
      if(/^(?:\d|\.)/.test(t)){const n=Number(t);if(!Number.isFinite(n))throw Error("Invalid number.");return ()=>n;}
      if(Object.prototype.hasOwnProperty.call(FUNCTIONS,t)){
        if(take()!=="(")throw Error("Write "+t+"(...) with parentheses.");
        const v=add();
        if(take()!==")")throw Error("Close the argument of "+t+".");
        return vars=>FUNCTIONS[t](v(vars));
      }
      if(t==="x")return vars=>vars.x;
      if(t==="y")return vars=>vars.y;
      if(t==="pi")return ()=>Math.PI;
      if(t==="e")return ()=>Math.E;
      if(t==="C"||t==="c")return vars=>vars.C||0;
      throw Error("Unknown symbol “"+t+"”. Use x, y, pi, e, and supported functions.");
    }
    function power(){
      const left=primary();
      if(peek()==="^"){take();const right=unary();return vars=>Math.pow(left(vars),right(vars));}
      return left;
    }
    function unary(){
      if(peek()==="+"){take();return unary();}
      if(peek()==="-"){take();const f=unary();return vars=>-f(vars);}
      return power();
    }
    function mul(){
      let left=unary();
      while(peek()==="*"||peek()==="/"){
        const op=take(),right=unary(),old=left;
        left=op==="*"?vars=>old(vars)*right(vars):vars=>old(vars)/right(vars);
      }
      return left;
    }
    function add(){
      let left=mul();
      while(peek()==="+"||peek()==="-"){
        const op=take(),right=mul(),old=left;
        left=op==="+"?vars=>old(vars)+right(vars):vars=>old(vars)-right(vars);
      }
      return left;
    }
    const fn=add();
    if(i!==tokens.length)throw Error("Unexpected symbol “"+peek()+"”. Check your parentheses and operators.");
    return fn;
  }
  function close(a,b,tol=0.00003){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*(1+Math.max(Math.abs(a),Math.abs(b)));}
  function check(input,step){
    const raw=String(input||"").trim();
    if(!raw)return {ok:false,message:"Enter an answer before checking."};
    if(step.type==="choice"){
      const ok=raw===step.answer;
      return {ok,message:ok?"Correct.":("Not quite. Revisit the condition used in this step.")};
    }
    if(step.type==="text"){
      const forms=Array.isArray(step.answer)?step.answer:[step.answer];
      const norm=x=>String(x).toLowerCase().replace(/[\s.,]/g,"");
      return {ok:forms.some(a=>norm(a)===norm(raw)),message:"Check the requested notation or conclusion."};
    }
    if(step.type==="number"&&/\b(?:x|y)\b/i.test(raw))return {ok:false,message:"This step asks for a number, not a function of x or y."};
    let student,expected=[];
    try{
      student=parse(raw);
      for(const ex of (Array.isArray(step.answer)?step.answer:[step.answer]))expected.push(parse(String(ex)));
    }catch(e){return {ok:false,message:e.message,parseError:true};}
    if(step.type==="number"){
      try{
        const a=student({x:1,y:1,C:0});
        const ok=expected.some(fn=>close(a,fn({x:1,y:1,C:0}),0.0003));
        return {ok,message:ok?"Correct.":"That value does not match. Check the arithmetic and signs."};
      }catch(e){return {ok:false,message:"Check your numerical expression."};}
    }
    const xs=[-3.7,-2.3,-1.35,-0.4,0,0.35,0.85,1.7,2.6,4.1,5.3];
    const ys=[1.2,1.9,2.6,1.6,0.7,2.9,3.4,0.3,1.3,2.3,0.8];
    let best=false;
    for(const f of expected){
      let n=0,wrong=0,validA=0,validB=0;
      for(let j=0;j<xs.length;j++){
        const vars={x:xs[j],y:ys[j],C:0};
        let a,b;try{a=student(vars);b=f(vars);}catch(e){continue;}
        if(Number.isFinite(a))validA++;
        if(Number.isFinite(b))validB++;
        if(Number.isFinite(a)&&Number.isFinite(b)){n++;if(!close(a,b,0.00003))wrong++;}
        else if(Number.isFinite(a)!==Number.isFinite(b))wrong++;
      }
      if(n>=4&&wrong===0&&Math.abs(validA-validB)<=2){best=true;break;}
    }
    return {ok:best,message:best?"Mathematically equivalent.":"Not equivalent to the expected expression. Check the calculus rule, signs, and missing factors."};
  }
  function seeded(seed){let state=(Number(seed)>>>0)||1987;return ()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};}
  const integer=(rng,min,max)=>Math.floor(rng()*(max-min+1))+min;
  const pick=(rng,list)=>list[integer(rng,0,list.length-1)];
  window.CalcMath={parse,check,seeded,integer,pick,close,version:"2.0"};
})();