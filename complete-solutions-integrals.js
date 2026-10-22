/* Integration: change of variables, primitives, exact bounds and accumulation. */
(function(){
"use strict";
const H=window.CalcSolutionDetails,{item:I,grab:G,answer:A}=H;
H.register("integration",p=>{
 const s=p.statement,id=p.id,z=A(p),ant=p.steps.at(-1).type==="antiderivative";
 let m,a,b,c,k,L,n,u;
 function primitive(inside,change,base,restore,info){
  return [I("Identify the inner expression or standard antiderivative","u="+inside,info||"Recognize the derivative needed for the reverse chain rule."),
   I("Compute the change of variable","du="+change+" dx"),
   I("Integrate in the new variable","∫...du = "+base),
   I("Return to the original variable","F(x)="+restore+" + C"),
   I("Match the expected primitive",z+" + C","Differentiating the answer returns the original integrand.")];
 }
 switch(id){
 case "int-sub-log":
  m=G(s,/∫ (\d+)x\/\((\d+)x\^2 \+ (\d+)\)/);if(!m)return null;[a,b,c]=m;
  return primitive(b+"x²+"+c,a+"x","ln|u|","ln|"+b+"x²+"+c+"|","The numerator is exactly the derivative of the denominator.");
 case "int-sub-trig":
  m=G(s,/∫ (\d+)cos\((\d+)x \+ (\d+)\)/);if(!m)return null;[a,b,c]=m;
  return primitive(b+"x+"+c,a,"sin(u)","sin("+b+"x+"+c+")","Here a=b, so the constant factor becomes du.");
 case "int-definite-sub":
  m=G(s,/∫ from 0 to (\d+) of 2x\/\(x² \+ (\d+)\)/);if(!m)return null;[L,a]=m;
  return [I("Substitute the denominator","u=x²+"+a+", du=2x dx"),
   I("Transform the lower bound","x=0 → u="+a),
   I("Transform the upper bound","x="+L+" → u="+(Number(L)**2+Number(a))),
   I("Rewrite the definite integral","∫₍"+a+"₎^("+(Number(L)**2+Number(a))+") (1/u) du"),
   I("Evaluate the logarithm","[ln|u|]₍"+a+"₎^("+(Number(L)**2+Number(a))+")=ln("+(Number(L)**2+Number(a))+"/"+a+")="+z)];
 case "int-signed-area":
  m=G(s,/f\(x\) = x³ on \[−(\d+), (\d+)\]/);if(!m)return null;[a,b]=m;
  return [I("Check symmetry","x³ is odd: f(−x)=−f(x)"),
   I("Compute the signed definite integral","∫₋"+a+"^"+b+" x³ dx=0","Positive and negative signed regions cancel."),
   I("Write total geometric area as an absolute-value integral","Area=∫₋"+a+"^"+b+" |x³|dx"),
   I("Use symmetry to convert to a positive integral","Area=2∫₀^"+b+" x³ dx"),
   I("Integrate and evaluate","Area=2[x⁴/4]₀^"+b+"="+z)];
 case "int-average":
  m=G(s,/f\(x\) = (\d+)x² on \[0, (\d+)\]/);if(!m)return null;[a,L]=m;
  return [I("Recall average value on [a,b]","f_avg=[1/(b−a)]∫ₐᵇ f(x)dx"),
   I("Find the definite integral","∫₀^"+L+" "+a+"x² dx=["+a+"x³/3]₀^"+L+"="+A(p,0)),
   I("Divide by the interval length","f_avg=("+A(p,0)+")/"+L),
   I("State the average value","f_avg="+z)];
 case "extra-integral-reciprocal":
  m=G(s,/of (\d+)\/x/);if(!m)return null;[a]=m;
  return [I("Identify the exceptional power x^(−1)","∫x^(−1)dx=ln|x|+C"),
   I("Use the constant multiple rule","∫"+a+"/x dx="+a+"∫(1/x)dx"),
   I("Integrate","F(x)="+a+"ln|x|+C"),
   I("Check by differentiating","F'(x)="+a+"/x on x≠0;  F(x)="+z+"+C")];
 case "extra-integral-log-affine":
  m=G(s,/Integrate (\d+)\/\((\d+)x\+(\d+)\)/);if(!m)return null;[a,b,c]=m;
  return primitive(b+"x+"+c,b,"ln|u|",z,"Numerator "+a+" matches du/dx="+b+".");
 case "extra-integral-negative-powers":
  m=G(s,/of (\d+)\/x\^(\d+)/);if(!m)return null;[a,n]=m;
  return [I("Rewrite the quotient as a power",""+a+"/x^"+n+"="+a+"x^(−"+n+")"),
    I("Recall the reverse power rule","∫x^r dx=x^(r+1)/(r+1)+C when r≠−1"),
    I("Increase the exponent and divide","∫"+a+"x^(−"+n+")dx="+a+"x^("+(1-Number(n))+")/("+(1-Number(n))+")+C"),
    I("Express the result as a reciprocal","F(x)="+z+"+C")];
 case "extra-integral-root-power":
  m=G(s,/of (\d+)sqrt\(x\)/);if(!m)return null;[a]=m;
  return [I("Rewrite the radical as a power","√x=x^(1/2)"),
   I("Integrate with the power rule","∫"+a+"x^(1/2)dx="+a+"x^(3/2)/(3/2)+C"),
   I("Simplify division by a fraction","F(x)=(2·"+a+"/3)x^(3/2)+C"),
   I("Check the primitive","F(x)="+z+"+C")];
 case "extra-integral-sec2":case "extra-integral-csc2":case "extra-integral-sectan":case "extra-integral-csccot":
  m=G(s,/of (\d+)(?:sec|csc)\((\d+)x\)/);
  if(!m)m=G(s,/∫ (\d+)(?:sec|csc)\((\d+)x\)/);
  if(!m)return null;[a,b]=m;
  let rule="";
  if(id.endsWith("sec2"))rule="d[tan(u)]/du=sec²(u)";
  if(id.endsWith("csc2"))rule="d[cot(u)]/du=−csc²(u)";
  if(id.endsWith("sectan"))rule="d[sec(u)]/du=sec(u)tan(u)";
  if(id.endsWith("csccot"))rule="d[csc(u)]/du=−csc(u)cot(u)";
  return [I("Recognize the trigonometric reverse derivative",rule),
   I("Substitute the angle","u="+b+"x; du="+b+"dx"),
   I("Account for the coefficient","A factor of "+a+"/"+b+" multiplies the primitive, with the sign from the derivative identity."),
   I("Write the original-variable antiderivative","F(x)="+z+"+C")];
 case "extra-integral-arctan":
  m=G(s,/∫ (\d+)\/\(1\+\((\d+)x\)(?:²|\^2)\)/);if(!m)return null;[a,b]=m;
  return [I("Recall the inverse tangent primitive","∫1/(1+u²)du=atan(u)+C"),
   I("Use u="+b+"x","du="+b+"dx"),
   I("Balance the coefficient","∫"+a+"/(1+("+b+"x)²)dx=("+a+"/"+b+")atan("+b+"x)+C"),
   I("Record the antiderivative","F(x)="+z+"+C")];
 case "extra-integral-arcsin":
  m=G(s,/of (\d+)\/sqrt\(1−\(x\/(\d+)\)²\)/);if(!m)return null;[a,b]=m;
  return [I("Recall the arcsine derivative","d[asin(u)]/du=1/√(1−u²)"),
   I("Use u=x/"+b,"du=dx/"+b),
   I("Compensate for du","dx="+b+"du; integral="+a+"·"+b+"∫du/√(1−u²)"),
   I("Return to x","F(x)="+z+"+C")];
 case "extra-integral-sub-root":
  m=G(s,/∫ (\d+)\/sqrt\((\d+)x\+(\d+)\)/);if(!m)return null;[a,b,c]=m;
  return primitive(b+"x+"+c,b,"2√u","2√("+b+"x+"+c+")","The numerator equals the derivative of the radical's argument.");
 case "extra-integral-sub-expsquare":
  m=G(s,/∫ (\d+)x exp\((\d+)x²\+(\d+)\)/);if(!m)return null;[a,b,c]=m;
  return primitive(b+"x²+"+c,a+"x","exp(u)","exp("+b+"x²+"+c+")");
 case "extra-integral-trig-cos2":
  m=G(s,/∫ (\d+)sin\((\d+)x\+1\)/);if(!m)return null;[a,b]=m;
  return [I("Choose the angle as a substitution","u="+b+"x+1; du="+b+"dx"),
   I("Integrate sine using its cosine primitive","∫sin(u)du=−cos(u)+C"),
   I("Include the coefficient of dx","F(x)=−("+a+"/"+b+")cos("+b+"x+1)+C"),
   I("State the result","F(x)="+z+"+C")];
 case "extra-integral-definite-sine":
  m=G(s,/of (\d+)sin\(x\)/);if(!m)return null;[a]=m;
  return [I("Find a primitive","F(x)=−"+a+"cos(x)"),
   I("Use the Fundamental Theorem","∫₀^π "+a+"sin(x)dx = F(π)−F(0)"),
   I("Compute endpoint contributions","−"+a+"cos(π)−[−"+a+"cos(0)]="+a+"+"+a),
   I("Evaluate","Integral = "+z)];
 case "extra-integral-definite-cos":
  m=G(s,/of (\d+)cos\(x\)/);if(!m)return null;[a]=m;
  return [I("Find a primitive","F(x)="+a+"sin(x)"),
   I("Evaluate over the interval","∫₀^(π/2) "+a+"cos(x)dx=F(π/2)−F(0)"),
   I("Use standard unit-circle values","sin(π/2)=1, sin(0)=0"),
   I("Compute","Integral="+z)];
 case "extra-integral-even":
  m=G(s,/from −(\d+) to (\d+) of \(x²\+(\d+)\)/);if(!m)return null;[a,b,c]=m;
  return [I("Check evenness","f(−x)=(-x)²+"+c+"=f(x)"),
   I("Reduce the symmetric interval","∫₋"+a+"^"+b+"f(x)dx=2∫₀^"+b+"(x²+"+c+")dx"),
   I("Integrate the polynomial","2[x³/3+"+c+"x]₀^"+b),
   I("Evaluate endpoints","Integral = "+z)];
 case "extra-integral-odd":
  m=G(s,/from −(\d+) to (\d+) of \(x⁵\+(\d+)x³\)/);if(!m)return null;[a,b,c]=m;
  return [I("Check parity","f(−x)=−x⁵−"+c+"x³=−f(x)"),
   I("Use symmetric bounds","[−"+a+","+b+"]"),
   I("Apply the odd-function integral property","∫₋a^a f(x)dx=0"),
   I("Conclude the signed integral","Integral = "+z,"The positive and negative contributions cancel.")];
 case "extra-integral-absolute-value":
  m=G(s,/from 0 to (\d+) of abs\(x−(\d+)\)/);if(!m)return null;[L,a]=m;
  return [I("Find where the absolute-value formula changes","x="+a),
   I("Split the definite integral","∫₀^"+L+"|x−"+a+"|dx=∫₀^"+a+"("+a+"−x)dx+∫_"+a+"^"+L+"(x−"+a+")dx"),
   I("Find both triangle areas","area₁="+a+"²/2; area₂="+a+"²/2"),
   I("Add the positive contributions","Area="+a+"²="+z)];
 case "extra-integral-net-change":
  m=G(s,/R\(x\)=(\d+)x\+(\d+).*x=0 to x=(\d+)/);if(!m)return null;[a,b,L]=m;
  return [I("Accumulate the time-varying inflow","Volume = ∫₀^"+L+"R(t)dt"),
   I("Use the rate formula","V=∫₀^"+L+"("+a+"t+"+b+")dt"),
   I("Find a primitive","F(t)="+a+"t²/2+"+b+"t"),
   I("Evaluate the two bounds","V=F("+L+")−F(0)="+z+" liters")];
 case "extra-integral-ftc-upper-cube":
  m=G(s,/from 1 to x³ of \(t²\+(\d+)t\+(\d+)\)/);if(!m)return null;[a,b]=m;
  return [I("Identify the integrand function","f(t)=t²+"+a+"t+"+b),
   I("Identify the variable upper bound","u(x)=x³;  u'(x)=3x²"),
   I("Apply Fundamental Theorem with chain rule","G'(x)=f(u(x))u'(x)"),
   I("Evaluate integrand at the bound and multiply","G'(x)=[(x³)²+"+a+"x³+"+b+"]3x²="+z)];
 case "extra-integral-ftc-lower":
  m=G(s,/from x to (\d+) of exp\(t²\)/);if(!m)return null;[a]=m;
  return [I("Recognize the moving LOWER limit","H(x)=∫_x^"+a+"exp(t²)dt"),
   I("Swap the integral limits","H(x)=−∫_"+a+"^x exp(t²)dt"),
   I("Use the Fundamental Theorem","H'(x)=−exp(x²)"),
   I("Report the result","H'(x)="+z,"No elementary primitive of exp(t²) is needed.")];
 case "extra-integral-average-trig":
  m=G(s,/of (\d+)sin\(x\) on \[0,pi\]/);if(!m)return null;[a]=m;
  return [I("Write the average-value definition","f_avg=(1/π)∫₀^π "+a+"sin(x)dx"),
   I("Integrate the sine","∫"+a+"sin(x)dx=−"+a+"cos(x)+C"),
   I("Evaluate endpoints","∫₀^π "+a+"sin(x)dx=2("+a+")"),
   I("Divide by interval length π","f_avg="+z)];
 }
 return null;
});
})();