/* Expanded worked solutions — functions, compositions, inverses and domains. */
(function(){
"use strict";
const H=window.CalcSolutionDetails,{item:I,grab:G,answer:A}=H;
H.register("foundations",p=>{
 const s=p.statement,id=p.id,final=A(p);
 let m,a,b,c,n,v,inner,outer;
 if(id.startsWith("extra-")&&id!=="extra-evaluate-at-point"){
   m=G(s,/^Given f\(u\)=(.+?) and g\(x\)=(.+?), determine f\(g\(x\)\)\./);
   if(m){
    [outer,inner]=m;
    const result=outer.replace(/\bu\b/g,"("+inner+")");
    const note=/(?:ln|sqrt|1\/|asin|acos)/.test(outer)
      ?"Check that the argument satisfies the outer function's domain restrictions.":"Evaluate the inner function before the outside function.";
    return [I("Identify the inner function","g(x) = "+inner,note),
      I("Write the outer rule with a placeholder","f(u) = "+outer,"The variable u stands for the entire output of g."),
      I("Substitute g(x) into every occurrence of u","f(g(x)) = "+result,"Apply every exponent, denominator, or trigonometric operation to the complete inner expression."),
      I("State the composite in standard mathematical notation","f(g(x)) = "+final,"Retain parentheses when powers or quotients apply to the whole input.")];
   }
 }
 switch(id){
 case "extra-evaluate-at-point":
  m=G(s,/f\(u\)=(.+?) and g\(x\)=(.+?)\. Find f\(g\((\d+)\)\)/);
  if(!m)return null;
  return [I("Evaluate the inner function at the given input","g("+m[2]+") = "+m[1].replace(/x/g,"("+m[2]+")")),
   I("Simplify the inner result","g("+m[2]+") = "+A(p,0)),
   I("Use that value as the input to the outside function","f(g("+m[2]+")) = "+m[0].replace(/\bu\b/g,"("+A(p,0)+")")),
   I("Finish the arithmetic","f(g("+m[2]+")) = "+final)];
 case "extra-nested-triple":
  m=G(s,/f\(u\)=(.+?), g\(u\)=(.+?), and h\(x\)=(.+?)\. Determine/);if(!m)return null;
  return [I("Begin with the innermost map","h(x)="+m[2]),
  I("Substitute h into g","g(h(x))="+m[1].replace(/\bu\b/g,"("+m[2]+")")),
  I("Simplify the middle composition","g(h(x))="+A(p,0)),
  I("Apply f to the entire result","f(g(h(x)))="+m[0].replace(/\bu\b/g,"("+A(p,0)+")")),
  I("Write the nested composition","f(g(h(x)))="+final)];
 case "extra-reverse-order":
  m=G(s,/f\(x\)=(.+?) and g\(u\)=(.+?), find/);if(!m)return null;
  return [I("Read the composition right to left","g(f(x)) means apply f first"),
  I("Compute the inside function","f(x)="+m[0]),
  I("Use f(x) as the argument of g","g(f(x))="+m[1].replace(/\bu\b/g,"("+m[0]+")")),
  I("Simplify the expression","g(f(x))="+final)];
 case "extra-piecewise-input":
  m=G(s,/g\(x\)=(.+?) if x<0, and g\(x\)=(.+?) if x≥0\. Calculate f\(g\((\d+)\)\)/);if(!m)return null;
  return [I("Determine which branch applies","x="+m[2]+" ≥ 0","The nonnegative branch, not the negative-input branch, must be used."),
   I("Substitute the input into that branch","g("+m[2]+") = "+m[1].replace(/x/g,m[2])),
   I("Evaluate g numerically","g("+m[2]+") = "+A(p,0)),
   I("Apply f(u)=u² to the result","f(g("+m[2]+"))=("+A(p,0)+")² = "+final)];
 case "extra-unknown-parameter":
  m=G(s,/f\(u\)=u\+(\d+), g\(x\)=(\d+)x\+t\. If f\(g\((\d+)\)\)=(\d+)/);if(!m)return null;
  [c,a,n,v]=m;
  return [I("Evaluate the inner function at the given input","g("+n+")="+a+"("+n+")+t"),
   I("Apply the outside function","f(g("+n+"))="+a+"("+n+")+t+"+c),
   I("Use the stated composite output",v+"="+(Number(a)*Number(n)+Number(c))+"+t"),
   I("Isolate the parameter","t="+v+"−"+(Number(a)*Number(n)+Number(c))+"="+final)];
 case "extra-rational-domain":
  m=G(s,/f\(u\)=1\/\(u−(\d+)\) and g\(x\)=(\d+)x\+(\d+)\./);if(!m)return null;
  [c,a,b]=m;
  return [I("Form the composite denominator","g(x)−"+c+"="+a+"x+"+b+"−"+c),
   I("Use the rational-function restriction","g(x)−"+c+" ≠ 0","Division by zero is undefined."),
   I("Solve the excluded-input equation",a+"x+"+b+"−"+c+"=0"),
   I("Report the excluded x-value","x=("+c+"−"+b+")/"+a+" = "+final)];
 case "extra-inverse-quadratic":
  m=G(s,/f\(x\)=\(x−(\d+)\)²\+(\d+), with x≥(\d+)/);if(!m)return null;
  [a,b]=m;
  return [I("Replace the function output with y","y=(x−"+a+")²+"+b),
   I("Isolate the squared expression","y−"+b+"=(x−"+a+")²"),
   I("Take the permitted square-root branch","√(y−"+b+")=x−"+a,"The domain restriction x≥"+a+" selects the nonnegative square root."),
   I("Solve for x","x="+A(p,0)),
   I("Exchange x and y","f⁻¹(x)="+final,"The inverse's domain is x≥"+b+".")];
 case "extra-inverse-reciprocal":
  m=G(s,/f\(x\)=(\d+)\/\(x−(\d+)\)/);if(!m)return null;[a,b]=m;
  return [I("Set output equal to y","y="+a+"/(x−"+b+")"),
   I("Clear the denominator","y(x−"+b+")="+a),
   I("Isolate x","x−"+b+"="+a+"/y → x="+A(p,0)),
   I("Exchange input and output","f⁻¹(x)="+final,"The inverse cannot take x=0.")];
 case "extra-domain-reciprocal-radical":
  m=G(s,/1\/sqrt\((\d+)x−(\d+)\)/);if(!m)return null;[a,b]=m;
  return [I("Identify both domain restrictions","√("+a+"x−"+b+") must be real AND nonzero"),
   I("Combine them into a strict inequality",a+"x−"+b+">0"),
   I("Solve the inequality","x>"+b+"/"+a),
   I("State the allowed interval","("+b+"/"+a+",∞)","The boundary x="+final+" is excluded because the denominator would be zero.")];
 }
 return null;
});
})();