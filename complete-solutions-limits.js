/* Worked calculus limits: substitutions, factorizations, sides, theorem conditions. */
(function(){
"use strict";
const H=window.CalcSolutionDetails,{item:I,grab:G,answer:A}=H;
H.register("limits",p=>{
 const s=p.statement,id=p.id,z=A(p),first=A(p,0);
 let m,a,b,c,k,t;
 switch(id){
 case "limits-polynomial":
  m=G(s,/lim\(x → ([−\d]+)\) \[(.*?)\]/);if(!m)return null;
  return [I("Identify continuity of the polynomial","P(x)="+m[1],"A polynomial is continuous at every real input."),
  I("Apply the limit law","lim(x→"+m[0]+")P(x)=P("+m[0]+")"),
  I("Replace x by the approached value","P("+m[0]+")="+m[1].replace(/x/g,"("+m[0]+")")),
  I("Perform the arithmetic","lim = "+z)];
 case "limits-sine":case "extra-limit-trig-ratio":case "extra-limit-tangent":
  m=G(s,/sin\((\d+)x\)\/\((\d+)x\)/);if(!m&&id==="extra-limit-trig-ratio")m=G(s,/sin\((\d+)x\)\/sin\((\d+)x\)/);
  if(!m&&id==="extra-limit-tangent")m=G(s,/tan\((\d+)x\)\/\((\d+)x\)/);
  if(!m)return null;[a,b]=m;
  return [I("Recall the standard small-angle limit","lim(u→0) sin(u)/u = 1","For tangent, tan(u)/u = [sin(u)/u]/cos(u) → 1."),
   I("Rewrite using matching arguments",id==="extra-limit-trig-ratio"
      ?"sin("+a+"x)/sin("+b+"x) = ("+a+"/"+b+") · [sin("+a+"x)/("+a+"x)]/[sin("+b+"x)/("+b+"x)]"
      :(id==="extra-limit-tangent"?"tan("+a+"x)/("+b+"x) = ("+a+"/"+b+") · tan("+a+"x)/("+a+"x)"
      :"sin("+a+"x)/("+b+"x) = ("+a+"/"+b+") · sin("+a+"x)/("+a+"x)")),
   I("Let x approach zero","("+a+"/"+b+")·1="+z)];
 case "limits-cosine":case "extra-limit-cos-quotient":
  m=G(s,/cos\((\d+)x\)/);if(!m)return null;[a]=m;
  return [I("Apply the half-angle identity","1−cos(u)=2sin²(u/2)"),
   I("Replace u by the given angle","1−cos("+a+"x)=2sin²("+a+"x/2)"),
   I("Divide by x² and extract the standard limit","[1−cos("+a+"x)]/x² = ("+a+"²/2)·[sin("+a+"x/2)/("+a+"x/2)]²"),
   I("Account for the sign of the stated numerator","lim = "+z,id==="extra-limit-cos-quotient"?"Here cos(u)−1 is the NEGATIVE of 1−cos(u).":"The squared sine ratio tends to one.")];
 case "limits-one-sided":case "limits-continuity":
  m=G(s,/x < (\d+).*f\(x\) = (\d+)x \+ (\d+).*x ≥ 0.*f\(x\) = (\d+)x \+ (\d+)/);
  if(id==="limits-one-sided"&&m){
   const [,a,b,c,d]=m;return [I("Identify the left-hand formula","f(x)="+a+"x+"+b+" for x<0"),
    I("Evaluate the left limit","lim(x→0⁻) f(x)="+b),
    I("Use the second formula for x approaching from the right","lim(x→0⁺) f(x)="+d),
    I("Compare the one-sided limits","left="+b+", right="+d,"A two-sided limit exists exactly when they are equal."),
    I("Conclude","lim(x→0) f(x): "+z)];
  }
  if(id==="limits-continuity"){
   m=G(s,/x < (\d+), let f\(x\) = (\d+)x \+ (\d+)\. For x ≥ \d+, let f\(x\) = (\d+)x \+ k/);if(!m)return null;
   const [point,a,b,c]=m,left=Number(a)*Number(point)+Number(b);
   return [I("Use continuity to match both branches","lim(x→"+point+"⁻)f(x) = f("+point+")"),
    I("Evaluate the left branch",a+"("+point+")+"+b+"="+left),
    I("Evaluate the right branch at its endpoint",c+"("+point+")+k = "+left),
    I("Isolate the unknown constant","k="+left+"−"+(Number(c)*Number(point))+"="+z)];
  }
  return null;
 case "limits-infinity":case "extra-limit-infinity-lower":case "extra-limit-infinity-higher":case "extra-limit-infinity-negative":
  m=G(s,/\((\d+)x([²³])[^)]*\)\/\((\d+)x([²³])/);
  if(id==="limits-infinity"){
    m=G(s,/\((\d+)x\^3.*\)\/\((\d+)x\^3/);if(!m)return null;
    return [I("Compare numerator and denominator degrees","degree(numerator)=degree(denominator)=3"),
    I("Divide by x³","[(leading numerator coefficient)+O(1/x²)]/[(leading denominator coefficient)+O(1/x)]"),
    I("Discard lower-order terms at infinity","lim = "+m[0]+"/"+m[1]+" = "+z,"The lower-degree terms vanish after dividing by x³.")];
  }
  if(!m)return null;
  return [I("Find the degrees of the numerator and denominator","numerator degree="+(m[1]==="³"?3:2)+", denominator degree="+(m[3]==="³"?3:2)),
   I("Divide by the highest denominator power","The dominant behavior is ("+m[0]+"/"+m[2]+")x^("+(Number(m[1]==="³"?3:2)-Number(m[3]==="³"?3:2))+")"),
   I("Use the sign of x as it approaches the specified infinity",id==="extra-limit-infinity-negative"?"x→−∞":"x→+∞"),
   I("Evaluate the resulting growth or decay","lim = "+z)];
 case "limits-vertical":
  m=G(s,/lim\(x → (\d+)⁺\) (\d+)\/\(x − (\d+)\)/);if(!m)return null;
  return [I("Read the direction","x→"+m[0]+" from the right"),
   I("Determine the denominator's sign","x−"+m[2]+" → 0⁺"),
   I("Determine the numerator's sign",m[1]+" > 0"),
   I("Conclude the unbounded behavior",m[1]+"/(x−"+m[2]+") → "+z)];
 case "limits-exponential":case "extra-limit-exponential-quotient":
  m=G(s,/exp\((\d+)x\)/);if(!m)return null;a=m[0];
  if(id==="extra-limit-exponential-quotient"){
   m=G(s,/exp\((\d+)x\)−exp\((\d+)x\)/);if(!m)return null;[a,b]=m;
   return [I("Split the numerator","[exp("+a+"x)−exp("+b+"x)]/x = [exp("+a+"x)−1]/x − [exp("+b+"x)−1]/x"),
    I("Apply the derivative-limit identity","lim(x→0)[exp(kx)−1]/x = k"),
    I("Subtract the two contributions","lim = "+a+"−"+b+" = "+z)];
  }
  return [I("Use u="+a+"x","When x→0, u→0."),
    I("Rewrite the quotient","[exp("+a+"x)−1]/x = "+a+"·[exp(u)−1]/u"),
    I("Use exp'(0)=1","lim(u→0)[exp(u)−1]/u=1"),
    I("Obtain the limit","lim = "+a+"·1 = "+z)];
 case "limits-squeeze":case "extra-limit-squeeze-bound":
  m=G(s,/x(?:\^(\d+)|³)(?:\s*)?(?:sin|cos)\(/);if(!m)return null;
  const power=m[0]||"3",trig=s.includes("cos(")?"cos":"sin";
  return [I("Bound the oscillatory factor","−1 ≤ "+trig+"(1/x) ≤ 1"),
   I("Multiply by the shrinking factor","−|x|^"+power+" ≤ x^"+power+trig+"(...) ≤ |x|^"+power),
   I("Evaluate the outer limits","lim(x→0)|x|^"+power+"=0"),
   I("Apply the Squeeze Theorem","lim = "+z)];
 case "extra-limit-absolute-ratio":case "extra-limit-absolute-left":
  m=G(s,/abs\(x−(\d+)\)\/\(x−(\d+)\)/);if(!m)return null;
  return [I("Identify the side of approach",id.endsWith("left")?"x<"+m[0]:"x>"+m[0]),
   I("Remove the absolute value using its definition","|x−"+m[0]+"|="+(id.endsWith("left")?"−(x−"+m[0]+")":"x−"+m[0])),
   I("Cancel the nonzero denominator","|x−"+m[0]+"|/(x−"+m[0]+")="+z),
   I("Take the corresponding one-sided limit","lim = "+z)];
 case "extra-limit-removable-hole":
  m=G(s,/h\(x\)=\(x−(\d+)\)\(x\+(\d+)\)\/\(x−(\d+)\)/);if(!m)return null;
  return [I("Factor is already visible","h(x)=[(x−"+m[0]+")(x+"+m[1]+")]/(x−"+m[2]+")"),
   I("Cancel for x≠"+m[0],"h(x)=x+"+m[1]),
   I("Use the continuous expression to evaluate the limit","lim(x→"+m[0]+")h(x)="+m[0]+"+"+m[1]),
   I("Finish the arithmetic","lim = "+z)];
 case "extra-limit-sqrt-difference":
  m=G(s,/sqrt\(x\)−(\d+)\]\/\(x−(\d+)\)/);if(!m)return null;
  return [I("Multiply by the conjugate","[√x−"+m[0]+"]/(x−"+m[1]+") · [√x+"+m[0]+"]/[√x+"+m[0]+"]"),
   I("Simplify the difference of squares","[x−"+m[0]+"²]/[(x−"+m[1]+")(√x+"+m[0]+")]"),
   I("Cancel the common x−"+m[1]+" factor","=1/(√x+"+m[0]+")"),
   I("Evaluate at x="+m[1],"lim = 1/(2·"+m[0]+")="+z)];
 case "extra-limit-logarithm":
  m=G(s,/ln\(1\+(\d+)x\)\/\((\d+)x\)/);if(!m)return null;
  return [I("Recall the log difference quotient","lim(u→0) ln(1+u)/u = 1"),
   I("Choose a matching substitution","u="+m[0]+"x"),
   I("Factor the coefficients","ln(1+"+m[0]+"x)/("+m[1]+"x)=("+m[0]+"/"+m[1]+")·[ln(1+u)/u]"),
   I("Take the limit","lim = "+z)];
 case "extra-limit-infinity-radical":case "extra-limit-absolute-infinity":
  m=G(s,/sqrt\((\d+)?x²\+(\d+)\)\/x/);if(!m)return null;
  const factor=m[0]?m[0]:"1",constant=m[1];
  return [I("Factor x² out of the radicand","√("+factor+"x²+"+constant+")=|x|√("+factor+"+"+constant+"/x²)"),
    I("Divide by x","√("+factor+"x²+"+constant+")/x=(|x|/x)√("+factor+"+"+constant+"/x²)"),
    I("Find the sign of |x|/x",id==="extra-limit-absolute-infinity"?"As x→−∞, |x|/x=−1.":"As x→+∞, |x|/x=+1."),
    I("Let the reciprocal term vanish",""+constant+"/x²→0"),
    I("Complete the limit","lim = "+z)];
 case "extra-limit-removable-parameter":
  m=G(s,/x²−(\d+)\)\/\(x−(\d+)\)/);if(!m)return null;
  return [I("Factor the difference of squares","x²−"+m[0]+"=(x−"+m[1]+")(x+"+m[1]+")"),
   I("Cancel the common factor for x≠"+m[1],"(x²−"+m[0]+")/(x−"+m[1]+")=x+"+m[1]),
   I("Take the limit at the hole","lim(x→"+m[1]+") = "+m[1]+"+"+m[1]),
   I("Choose f("+m[1]+") to match the limit","k="+z)];
 case "extra-limit-piecewise-condition":
  m=G(s,/f\(x\)=(\d+)x\+(\d+) for x<0/);if(!m)return null;
  return [I("Compute the left approach","lim(x→0⁻)f(x)="+m[1]),
   I("Compute the right approach","lim(x→0⁺)f(x)="+m[1]),
   I("Apply the two-sided limit criterion","Both one-sided limits equal "+m[1]),
   I("Separate limits from function values",z,"The value f(0) may differ without changing the limit.")];
 case "extra-limit-ivt":
  m=G(s,/f\(x\)=x³−(\d+)x−(\d+).*x=0 and x=(\d+)/);if(!m)return null;
  return [I("Check continuity","f(x)=x³−"+m[0]+"x−"+m[1]+" is polynomial and continuous"),
    I("Evaluate the left endpoint","f(0)=−"+m[1]+"<0"),
    I("Evaluate the right endpoint","f("+m[2]+")="+m[2]+"³−"+m[0]+"("+m[2]+")−"+m[1]+">0"),
    I("Invoke the Intermediate Value Theorem",z,"The continuous function changes sign, so it must equal zero somewhere between the endpoints.")];
 case "extra-limit-classify-infinite":
  m=G(s,/f\(x\)=1\/\(x−(\d+)\)²/);if(!m)return null;
  return [I("Locate the undefined point","x="+m[0]),
   I("Analyze the denominator","(x−"+m[0]+")² → 0⁺ from either side"),
   I("Evaluate the one-sided behavior","f(x)→+∞ as x→"+m[0]+"⁺ and x→"+m[0]+"⁻"),
   I("Classify the discontinuity",z)];
 case "extra-limit-classify-jump":
  m=G(s,/f\(x\)=(\d+) for x<0 and f\(x\)=(\d+) for x≥0/);if(!m)return null;
  return [I("Compute left-hand limit","lim(x→0⁻)f(x)="+m[0]),
   I("Compute right-hand limit","lim(x→0⁺)f(x)="+m[1]),
   I("Compare the limits",m[0]+" ≠ "+m[1]),
   I("Classify the discontinuity",z,"The two finite one-sided limits differ.")];
 case "extra-limit-lhopital-higher":
  m=G(s,/exp\((\d+)x\)−1−(\d+)x/);if(!m)return null;
  return [I("Check the indeterminate form","[exp("+m[0]+"x)−1−"+m[1]+"x]/x² → 0/0"),
   I("Differentiate numerator and denominator","["+m[0]+"exp("+m[0]+"x)−"+m[1]+"]/(2x) → 0/0"),
   I("Differentiate a second time","["+Number(m[0])**2+"exp("+m[0]+"x)]/2"),
   I("Evaluate x=0","lim = "+Number(m[0])**2+"/2 = "+z)];
 case "extra-limit-critical-trig":
  m=G(s,/sin\(x\)\/\(x−(\d+)\)/);if(!m)return null;
  return [I("Identify continuous numerator and denominator","sin(x) is continuous; x−"+m[0]+" is continuous"),
   I("Determine when the denominator vanishes","x−"+m[0]+"=0"),
   I("Solve for the excluded x-coordinate","x="+z),
   I("Interpret the discontinuity","The rational expression is undefined there; all other real inputs are allowed.")];
 case "extra-limit-slope-secant":
  m=G(s,/\[\((\d+)\+h\)²−(\d+)\]\/h/);if(!m)return null;
  return [I("Expand the shifted square","("+m[0]+"+h)²="+Number(m[0])**2+"+"+(2*Number(m[0]))+"h+h²"),
   I("Subtract the original value","["+m[0]+"²+"+(2*Number(m[0]))+"h+h²−"+m[1]+"]/h"),
   I("Cancel h for h≠0","= "+(2*Number(m[0]))+"+h"),
   I("Take h→0","lim = "+z)];
 }
 return null;
});
})();