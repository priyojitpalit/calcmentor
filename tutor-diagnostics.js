/* CalcMentor misconception diagnostics. Claims only errors confirmed by an explicit pattern.
   No remote AI service, probabilistic guesses, or access to student accounts. */
(function(){
"use strict";
const M=window.CalcMath;
const match=(text,re)=>{const m=String(text).match(re);return m?m.slice(1):null;};
function micro(prompt,answer,explanation,hint){
 return {prompt,answer:String(answer),type:"expr",explanation,hint};
}
function result(code,title,explanation,repair){
 return {code,title,explanation,repair:repair||null,confidence:"pattern"};
}
function equivalent(student,candidate){
 try{return M.check(String(student),{type:"expr",answer:String(candidate)}).ok;}catch(_){return false;}
}
function diagnose({family,problem,step,submitted}){
 const text=String(submitted??"").trim(),id=String(family||problem?.id||"");
 if(!text||!step)return null;
 const s=problem?.statement||"",key=step.answer;
 if(step.type==="choice"){
  const selected=step.options?.find(x=>String(x.value)===text)?.label;
  if(!selected)return null;
  return {code:"choice-reasoning",title:"Check the condition behind your choice",
   explanation:step.hints?.[0]||"Check the conditions of the rule before selecting it.",
   repair:null,confidence:"step"};
 }
 if(step.type==="expr"||step.type==="number"){
  let m,a,b,n,inside,missing;
  if(id==="deriv-chain-power"&&/full composition/.test(step.q)){
   m=match(s,/Differentiate \((\d+)x\^2 \+ (\d+)\)\^(\d+)/);
   if(m){[a,b,n]=m;inside=a+"*x^2+"+b;
    missing=n+"*("+inside+")^"+(Number(n)-1);
    if(equivalent(text,missing))return result("missing-inner-derivative","Missing the inner derivative",
     "You differentiated the outside power, but the chain rule also multiplies by the derivative of "+a+"x²+"+b+".",
     micro("Differentiate the inner function "+a+"x²+"+b+".",2*Number(a)+"*x",
       "The power rule gives 2·"+a+"x. Multiply this by your outside derivative.","Differentiate "+a+"x² first."));}
  }
  if(id==="deriv-exponential"&&/full derivative/.test(step.q)){
   m=match(s,/exp\((\d+)x\^2 \+ (\d+)x\)/);if(m){[a,b]=m;
    if(equivalent(text,"exp("+a+"*x^2+"+b+"*x)"))
     return result("missing-inner-derivative","An exponential needs its exponent's derivative",
      "d[exp(u)]/dx = exp(u)·u'. The exp(u) part is present; its multiplier u' is missing.",
      micro("Find u'(x) for u(x)="+a+"x²+"+b+"x.",2*Number(a)+"*x+"+b,
       "Differentiate each polynomial term before multiplying by exp(u).","Use the power rule separately on the x² and x terms."));}
  }
  if(id==="deriv-log"&&/full/.test(step.q)){
   m=match(s,/ln\((\d+)x\^2 \+ (\d+)\)/);if(m){[a,b]=m;
    if(equivalent(text,"1/("+a+"*x^2+"+b+")"))
     return result("missing-inner-derivative","The logarithm's inside also changes",
      "d[ln(u)]/dx = u'/u, not merely 1/u.",
      micro("Differentiate u(x)="+a+"x²+"+b+".",2*Number(a)+"*x",
        "Place this derivative in the numerator of u'/u.","The derivative of a constant is zero."));}
  }
  if(id==="extra-deriv-sqrt-linear"){
   m=match(s,/sqrt\((\d+)x\+(\d+)\)/);if(m){[a,b]=m;
    if(equivalent(text,"1/(2*sqrt("+a+"*x+"+b+"))"))
     return result("missing-inner-derivative","The square-root derivative is missing a factor",
      "The derivative of √u is u'/(2√u). Your denominator is right, but u' was omitted.",
      micro("Find d/dx("+a+"x+"+b+").",a,"Multiply your original result by this derivative.","The slope of ax+b is a."));}
  }
  if(id==="extra-deriv-sqrt-quadratic"){
   m=match(s,/sqrt\(x²\+(\d+)x\+(\d+)\)/);if(m){[a,b]=m;
    if(equivalent(text,"1/(2*sqrt(x^2+"+a+"*x+"+b+"))"))
     return result("missing-inner-derivative","Missing derivative of the quadratic",
      "For √u(x), multiply 1/(2√u) by u'(x).",
      micro("Differentiate x²+"+a+"x+"+b+".","2*x+"+a,
       "This derivative belongs in the numerator of the square-root derivative.","Derivative of x² is 2x."));}
  }
  if(id==="extra-deriv-atan-quad"){
   m=match(s,/atan\(x²\+(\d+)x\+(\d+)\)/);if(m){[a,b]=m;
    inside="x^2+"+a+"*x+"+b;
    if(equivalent(text,"1/(1+("+inside+")^2)"))
     return result("missing-inner-derivative","Inverse tangent also needs a chain factor",
      "d[atan(u)]/dx = u'/(1+u²). The numerator is the derivative of the quadratic inside atan.",
      micro("Differentiate "+inside+".","2*x+"+a,
       "Place this derivative above the denominator you already found.","Use the derivative of x² and the constant multiple rule."));}
  }
  if(["extra-deriv-sec","extra-deriv-csc","extra-deriv-cot"].includes(id)){
   m=match(s,/(?:sec|csc|cot)\((\d+)x/);if(m){
    a=m[0];const f=id.endsWith("sec")?"sec("+a+"*x)*tan("+a+"*x)"
      :id.endsWith("csc")?"-csc("+a+"*x)*cot("+a+"*x)"
      :"-csc("+a+"*x"+((match(s,/cot\(\d+x\+(\d+)\)/)||[])[0]?"+"+match(s,/cot\(\d+x\+(\d+)\)/)[0]:"")+")^2";
    if(equivalent(text,f))return result("missing-inner-derivative","Differentiate the inner angle too",
     "The trigonometric derivative is correct in form, but the argument "+a+"x has derivative "+a+".",
     micro("Differentiate "+a+"x with respect to x.",a,"Multiply your derivative by that constant.","d(ax)/dx=a."));}
  }
  if(id==="deriv-product"&&/Find the derivative/.test(step.q)){
   m=match(s,/x\^(\d+) sin\((\d+)x\)/);if(m){[n,a]=m;
    const left=n+"*x^"+(Number(n)-1)+"*sin("+a+"*x)";
    const right=a+"*x^"+n+"*cos("+a+"*x)";
    if(equivalent(text,left)||equivalent(text,right)){
     const missed=equivalent(text,left)?"differentiate the sine factor too":"differentiate the power factor too";
     return result("product-rule-term","The product rule has two terms",
      "The derivative of uv is u'v + uv'. You calculated one of the terms; "+missed+".",
      micro("How many terms does the product-rule formula (uv)' contain?",2,
       "Both u'v and uv' must be included.","Write u'v + uv'."));}
   }
  }
  if(id==="limits-sine"&&/Evaluate the limit/.test(step.q)){
   m=match(s,/sin\((\d+)x\)\/\((\d+)x\)/);if(m){[a,b]=m;
    if(equivalent(text,b+"/"+a))return result("inverted-limit-factor","The limit multiplier was reversed",
     "Rewrite sin("+a+"x)/("+b+"x) as ("+a+"/"+b+")·[sin("+a+"x)/("+a+"x)]. The outside factor is numerator frequency divided by denominator coefficient.",
     micro("Evaluate lim(x→0) sin(5x)/(5x).",1,
      "The standard sine limit is 1 when numerator and denominator have the same angle.","Use the standard limit in radians."));}
  }
  if(["int-sub-power","extra-integral-sub-cubic"].includes(id)&&/antiderivative/.test(step.q)){
   m=match(s,/\^(\d+) dx/);if(m){
    n=Number(m[0]);const correctAnswer=String(step.answer),candidate=correctAnswer.replace(new RegExp("/"+(n+1)+"$"),"");
    if(candidate!==correctAnswer&&equivalent(text,candidate))
     return result("integration-power-denominator","The reverse power rule includes division",
      "∫u^n du = u^(n+1)/(n+1) + C. Your exponent increased correctly, but you did not divide by "+(n+1)+".",
      micro("Find an antiderivative of u^"+n+" (use x instead of u).","x^"+(n+1)+"/"+(n+1),
       "Increase the power to "+(n+1)+" and divide by "+(n+1)+".","Reverse the power rule."));
   }
  }
  if(step.type==="expr"&&equivalent(text,"-("+key+")")){
   return result("sign-reversal","Check the sign",
    "Your expression is the negative of the expected one at the tested inputs. Recheck subtraction order, negative derivatives, and the signs in each rule.",
    micro("What is d/dx[−x²] ?","-2*x","The minus sign remains after differentiation.","The derivative of x² is 2x."));
  }
  if(step.type==="expr"&&equivalent(text,"2*("+key+")")){
   return result("extra-factor-two","An extra factor of two appeared",
    "The expression is twice the expected result. Recheck coefficients and whether a chain-rule factor was applied more than once.",
    micro("What is d/dx[x²] ?","2*x","Differentiate x² once, not twice.","Use the power rule."));
  }
 }
 return null; // No unsupported claims about what the student misunderstood.
}
window.CalcDiagnostics=Object.freeze({diagnose});
})();
