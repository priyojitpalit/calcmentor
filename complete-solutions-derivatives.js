/* Differentiation: differentiated factors, inner derivatives, implicit and log steps. */
(function(){
"use strict";
const H=window.CalcSolutionDetails,{item:I,grab:G,answer:A}=H;
H.register("differentiation",p=>{
 const s=p.statement,id=p.id,z=A(p);let m,a,b,c,k,n,u,du,F,rule;
 function chain(name,inner,innerD,outerDerivative,description){
  return [I("Identify the inner function","u="+inner),
   I("Differentiate the inner function","du/dx="+innerD),
   I("Apply the outside differentiation rule",outerDerivative,"Use the chain rule: outer derivative evaluated at u, multiplied by du/dx."),
   I("Substitute the given expression","dy/dx="+z,description||"Keep the inner derivative as a factor.")];
 }
 switch(id){
 case "deriv-definition":
  m=G(s,/f\(x\) = (\d+)x\^2 \+ (\d+)x \+ (\d+)/);if(!m)return null;[a,b,c]=m;
  return [I("Start from the derivative definition","f'(x)=lim(h→0)[f(x+h)−f(x)]/h"),
   I("Write the shifted polynomial","f(x+h)="+a+"(x+h)²+"+b+"(x+h)+"+c),
   I("Expand and subtract f(x)","f(x+h)−f(x)="+(2*Number(a))+"xh+"+a+"h²+"+b+"h"),
   I("Cancel h before taking the limit","[f(x+h)−f(x)]/h="+(2*Number(a))+"x+"+a+"h+"+b),
   I("Evaluate h→0","f'(x)="+z)];
 case "deriv-power":
  m=G(s,/f\(x\) = (\d+)x\^(\d+) \+ (\d+)x\^\(−(\d+)\)/);if(!m)return null;[a,n,b,k]=m;
  return [I("Use the power rule for any real exponent","d[cx^r]/dx = cr x^(r−1)"),
   I("Differentiate the positive-power term",a+"·"+n+"x^"+(Number(n)-1)+"="+(Number(a)*Number(n))+"x^"+(Number(n)-1)),
   I("Differentiate the negative-power term",b+"·(−"+k+")x^(−"+(Number(k)+1)+")=−"+(Number(b)*Number(k))+"x^(−"+(Number(k)+1)+")"),
   I("Add both derivatives","f'(x)="+z)];
 case "deriv-exponential-product":
  m=G(s,/y = \((\d+)x\^2 \+ (\d+)\) exp\((\d+)x\)/);if(!m)return null;[a,b,c]=m;
  return [I("Choose the factors","u="+a+"x²+"+b+", v=exp("+c+"x)"),
   I("Differentiate the factors","u'="+(2*Number(a))+"x, v'="+c+"exp("+c+"x)"),
   I("Apply the product rule","y'=u'v+uv'"),
   I("Substitute both derivatives","y'="+z)];
 case "deriv-quotient":
  m=G(s,/y = \((\d+)x \+ (\d+)\)\/\((\d+)x \+ (\d+)\)/);if(!m)return null;[a,b,c,k]=m;
  return [I("Choose numerator and denominator","u="+a+"x+"+b+", v="+c+"x+"+k),
   I("Differentiate them","u'="+a+", v'="+c),
   I("Apply the quotient rule","y'=(v·u'−u·v')/v²"),
   I("Insert the specific expressions","y'=[("+c+"x+"+k+")"+a+"−("+a+"x+"+b+")"+c+"]/("+c+"x+"+k+")²"),
   I("Simplify the numerator","y'="+z)];
 case "deriv-nested-chain":
  m=G(s,/sin\(\((\d+)x \+ (\d+)\)\^(\d+)\)/);if(!m)return null;[a,b,n]=m;
  return [I("Identify all three layers","y=sin(u), u=v^"+n+", v="+a+"x+"+b),
   I("Differentiate the inside","dv/dx="+a),
   I("Differentiate the inner power","du/dx="+n+"v^"+(Number(n)-1)+"·"+a+"="+(Number(n)*Number(a))+"("+a+"x+"+b+")^"+(Number(n)-1)),
   I("Apply the sine chain rule","y'=cos(u)·du/dx"),
   I("Write the complete derivative","dy/dx="+z)];
 case "deriv-log":
  m=G(s,/ln\((\d+)x\^2 \+ (\d+)\)/);if(!m)return null;[a,b]=m;
  return chain("log",a+"x²+"+b,(2*Number(a))+"x","d[ln(u)]/dx=(1/u)(du/dx)","Use the original inside expression as the denominator.");
 case "deriv-inverse-trig":
  m=G(s,/atan\((\d+)x − (\d+)\)/);if(!m)return null;[a,b]=m;
  return chain("arctan",a+"x−"+b,a,"d[atan(u)]/dx=u'/(1+u²)");
 case "deriv-hyperbolic":
  m=G(s,/sinh\((\d+)x \+ (\d+)\)/);if(!m)return null;[a,b]=m;
  return chain("sinh",a+"x+"+b,a,"d[sinh(u)]/dx=cosh(u)·u'");
 case "deriv-second":
  m=G(s,/f\(x\) = (\d+)x\^4 \+ (\d+)x\^3 \+ (\d+)x\^2/);if(!m)return null;[a,b,c]=m;
  return [I("Differentiate once using the power rule","f'(x)="+(4*Number(a))+"x³+"+(3*Number(b))+"x²+"+(2*Number(c))+"x"),
   I("Differentiate the result again","f''(x)="+(12*Number(a))+"x²+"+(6*Number(b))+"x+"+(2*Number(c))),
   I("Interpret the second derivative","f''(x)="+z,"The second derivative measures how the first derivative changes.")];
 case "deriv-logarithmic":
  m=G(s,/y = x\^\(x \+ (\d+)\)/);if(!m)return null;[a]=m;
  return [I("Take the logarithm of both sides","ln(y)=(x+"+a+")ln(x)","Since x>0, ln(x) is defined."),
   I("Differentiate implicitly","y'/y = ln(x)+(x+"+a+")/x","Use the product rule on the right."),
   I("Multiply through by y","y'=y[ln(x)+(x+"+a+")/x]"),
   I("Substitute y=x^(x+"+a+")","y'="+z)];
 case "deriv-tangent":
  m=G(s,/f\(x\) = x\^3 − (\d+)x\^2 \+ (\d+)x at x = (\d+)/);if(!m)return null;[a,b,c]=m;
  return [I("Evaluate the point of tangency","f("+c+")="+c+"³−"+a+"("+c+")²+"+b+"("+c+")"),
   I("Differentiate the cubic","f'(x)=3x²−"+(2*Number(a))+"x+"+b),
   I("Substitute the tangency x-coordinate","m=f'("+c+")="+A(p,0)),
   I("Use point-slope form","y−f("+c+")=m(x−"+c+")"),
   I("Write the required right side of y","y="+z)];
 case "extra-deriv-sec":case "extra-deriv-csc":case "extra-deriv-cot":
  m=G(s,/(sec|csc|cot)\((\d+)x(?:\+(\d+))?\)/);if(!m)return null;[F,a,b]=m;u=a+"x"+(b?"+"+b:"");
  rule=F==="sec"?"d[sec(u)]/dx=sec(u)tan(u)u'":F==="csc"?"d[csc(u)]/dx=−csc(u)cot(u)u'":"d[cot(u)]/dx=−csc²(u)u'";
  return chain(F,u,a,rule);
 case "extra-deriv-trig-square":
  m=G(s,/sin\((\d+)x\)\]\^(\d+)/);if(!m)return null;[a,n]=m;
  return [I("Identify the nested functions","u=sin("+a+"x), y=u^"+n),
   I("Differentiate the inner trigonometric function","u'="+a+"cos("+a+"x)"),
   I("Use the power rule outside","y'="+n+"u^"+(Number(n)-1)+"u'"),
   I("Substitute both expressions","y'="+z)];
 case "extra-deriv-trig-product":
  m=G(s,/sin\((\d+)x\)cos\((\d+)x\)/);if(!m)return null;[a,b]=m;
  return [I("Split into factors","u=sin("+a+"x), v=cos("+b+"x)"),
   I("Differentiate both factors","u'="+a+"cos("+a+"x), v'=−"+b+"sin("+b+"x)"),
   I("Apply the product rule","(uv)'=u'v+uv'"),
   I("Collect both terms","f'(x)="+z)];
 case "extra-deriv-trig-quotient":
 case "extra-deriv-exp-quotient":
  m=id==="extra-deriv-trig-quotient"
   ?G(s,/sin\((\d+)x\)\/\(x²\+(\d+)\)/)
   :G(s,/exp\((\d+)x\)\/\(x²\+(\d+)\)/);
  if(!m)return null;[a,b]=m;F=id==="extra-deriv-trig-quotient"?"sin":"exp";du=a+(F==="sin"?"cos":"exp")+"("+a+"x)";
  return [I("Identify quotient parts","u="+F+"("+a+"x), v=x²+"+b),
   I("Differentiate both parts","u'="+du+", v'=2x"),
   I("Apply the quotient rule","(u/v)'=(vu'−uv')/v²"),
   I("Write the full derivative","f'(x)="+z)];
 case "extra-deriv-sqrt-quadratic":
  m=G(s,/sqrt\(x²\+(\d+)x\+(\d+)\)/);if(!m)return null;[a,b]=m;
  return chain("sqrt","x²+"+a+"x+"+b,"2x+"+a,"d[sqrt(u)]/dx=u'/(2sqrt(u))");
 case "extra-deriv-negative-power":
  m=G(s,/1\/\(x²\+(\d+)x\+(\d+)\)²/);if(!m)return null;[a,b]=m;
  return chain("power","x²+"+a+"x+"+b,"2x+"+a,"d[u^(−2)]/dx=−2u^(−3)u'");
 case "extra-deriv-ln-abs":
  m=G(s,/ln\(abs\(x−(\d+)\)\)/);if(!m)return null;[a]=m;
  return chain("absolute log","x−"+a,"1","d[ln|u|]/dx=u'/u","Valid for x≠"+a+".");
 case "extra-deriv-log10":
  m=G(s,/log10\((\d+)x\+1\)/);if(!m)return null;[a]=m;
  return chain("log10",a+"x+1",a,"d[log₁₀(u)]/dx=u'/(u ln 10)");
 case "extra-deriv-arcsin":case "extra-deriv-arccos":
  m=G(s,/(?:asin|acos)\(x\/(\d+)\)/);if(!m)return null;[a]=m;
  return chain("inverse trig","x/"+a,"1/"+a,id.endsWith("arcsin")?"d[asin(u)]/dx=u'/sqrt(1−u²)":"d[acos(u)]/dx=−u'/sqrt(1−u²)");
 case "extra-deriv-atan-quad":
  m=G(s,/atan\(x²\+(\d+)x\+(\d+)\)/);if(!m)return null;[a,b]=m;
  return chain("atan","x²+"+a+"x+"+b,"2x+"+a,"d[atan(u)]/dx=u'/(1+u²)");
 case "extra-deriv-implicit-circle":
  m=G(s,/x²\+y²=(\d+)/);if(!m)return null;
  return [I("Differentiate x²+y² with respect to x","2x+2y(dy/dx)=0","Use the chain rule on y² because y depends on x."),
   I("Isolate the y-derivative term","2y(dy/dx)=−2x"),
   I("Divide through by 2y","dy/dx="+z)];
 case "extra-deriv-implicit-ellipse":
  m=G(s,/(\d+)x²\+(\d+)y²=1/);if(!m)return null;[a,b]=m;
  return [I("Differentiate both sides","2("+a+")x+2("+b+")y y'=0"),
   I("Gather terms containing y'","2("+b+")y y'=−2("+a+")x"),
   I("Solve for the derivative","y'="+z)];
 case "extra-deriv-implicit-mixed":
  m=G(s,/x²y\+(\d+)y³=(\d+)/);if(!m)return null;[a,b]=m;
  return [I("Differentiate the product x²y","d(x²y)/dx=2xy+x²y'"),
   I("Differentiate the cubic in y","d("+a+"y³)/dx="+(3*Number(a))+"y²y'"),
   I("Combine the implicit derivatives","2xy+x²y'+"+(3*Number(a))+"y²y'=0"),
   I("Isolate the unknown derivative","y'="+z)];
 case "extra-deriv-implicit-trig":
  m=G(s,/sin\(y\)\+(\d+)x=y²/);if(!m)return null;[a]=m;
  return [I("Differentiate both sides implicitly","cos(y)y'+"+a+"=2yy'"),
   I("Gather all y' terms","(cos(y)−2y)y'=−"+a),
   I("Divide by the coefficient of y'","y'="+z)];
 case "extra-deriv-log-xpower":
  m=G(s,/y=x\^\((\d+)x\)/);if(!m)return null;[a]=m;
  return [I("Take logs because both base and exponent vary","ln(y)="+a+"x ln(x)"),
   I("Differentiate implicitly","y'/y="+a+"ln(x)+"+a),
   I("Multiply by y","y'=y("+a+"ln(x)+"+a+")"),
   I("Return to the original function","y'="+z)];
 case "extra-deriv-exp-x2":
  m=G(s,/y=\((\d+)x²\)\^x/);if(!m)return null;[a]=m;
  return [I("Take the natural logarithm","ln(y)=x ln("+a+"x²)"),
   I("Differentiate both sides","y'/y=ln("+a+"x²)+x·(2/x)"),
   I("Simplify the log derivative","y'/y=ln("+a+"x²)+2"),
   I("Multiply by y=("+a+"x²)^x","y'="+z)];
 case "extra-deriv-nth-cos":
  m=G(s,/f\(x\)=(\d+)cos\((\d+)x\)/);if(!m)return null;[a,b]=m;
  return [I("First derivative","f'(x)=−"+(Number(a)*Number(b))+"sin("+b+"x)"),
   I("Second derivative","f''(x)=−"+(Number(a)*Number(b)**2)+"cos("+b+"x)"),
   I("Third derivative","f'''(x)="+z)];
 case "extra-deriv-velocity-acc":
  m=G(s,/s\(x\)=(\d+)x³−(\d+)x²\+(\d+)x/);if(!m)return null;[a,b,c]=m;
  return [I("Position function","s(x)="+a+"x³−"+b+"x²+"+c+"x"),
   I("Differentiate position to find velocity","v(x)=s'(x)="+(3*Number(a))+"x²−"+(2*Number(b))+"x+"+c),
   I("Differentiate velocity to find acceleration","a(x)=v'(x)="+z)];
 case "extra-deriv-tangent-sine":
  m=G(s,/f\(x\)=(\d+)sin\((\d+)x\)/);if(!m)return null;[a,b]=m;
  return [I("Find the point at x=0","f(0)="+a+"sin(0)=0"),
   I("Differentiate the sine","f'(x)="+(Number(a)*Number(b))+"cos("+b+"x)"),
   I("Evaluate the tangent slope","m=f'(0)="+A(p,0)),
   I("Use point-slope form","y−0=m(x−0)"),
   I("Write the tangent line","y="+z)];
 case "extra-deriv-definition-point":
  m=G(s,/f'\((\d+)\) for f\(x\)=(\d+)x²/);if(!m)return null;[a,b]=m;
  return [I("Start with the difference quotient","f'("+a+")=lim(h→0)[f("+a+"+h)−f("+a+")]/h"),
   I("Expand the shifted square",b+"("+a+"+h)²−"+b+"("+a+")²="+b+"(2·"+a+"h+h²)"),
   I("Divide through by h","= "+b+"(2·"+a+"+h)"),
   I("Take h→0","f'("+a+")="+z)];
 case "extra-deriv-corner":
  m=G(s,/abs\(x−(\d+)\)/);if(!m)return null;[a]=m;
  return [I("Use the piecewise absolute value","|x−"+a+"| = −(x−"+a+") for x<"+a+"; = x−"+a+" for x≥"+a),
   I("Compute the left derivative","f'("+a+"⁻)=−1"),
   I("Compute the right derivative","f'("+a+"⁺)=+1"),
   I("Compare the one-sided derivatives",z,"The function is continuous there but has a corner.")];
 case "extra-deriv-quotient-polys":
  m=G(s,/\(x²\+(\d+)\)\/\(x²\+(\d+)\)/);if(!m)return null;[a,b]=m;
  return [I("Identify quotient numerator and denominator","u=x²+"+a+", v=x²+"+b),
   I("Differentiate both","u'=2x, v'=2x"),
   I("Apply quotient rule","f'(x)=[(x²+"+b+")(2x)−(x²+"+a+")(2x)]/(x²+"+b+")²"),
   I("Write the simplified derivative","f'(x)="+z)];
 case "extra-deriv-rational-asymptote":
  m=G(s,/1\/\((\d+)x\+(\d+)\)/);if(!m)return null;[a,b]=m;
  return chain("reciprocal",a+"x+"+b,a,"d[u^(−1)]/dx=−u^(−2)u'");
 case "extra-deriv-sine-nested":
  m=G(s,/sin\(cos\((\d+)x\+(\d+)\)\)/);if(!m)return null;[a,b]=m;
  return [I("Identify all nested layers","y=sin(u), u=cos(v), v="+a+"x+"+b),
   I("Differentiate the innermost input","v'="+a),
   I("Differentiate the middle cosine","u'=−sin(v)v'=−"+a+"sin("+a+"x+"+b+")"),
   I("Differentiate the outside sine","y'=cos(u)u'"),
   I("Combine every chain-rule factor","y'="+z)];
 case "extra-deriv-second-log":
  m=G(s,/ln\(x²\+(\d+)\)/);if(!m)return null;[a]=m;
  return [I("Find the first derivative","f'(x)=2x/(x²+"+a+")"),
   I("Apply quotient rule to the derivative","f''(x)=[2(x²+"+a+")−(2x)(2x)]/(x²+"+a+")²"),
   I("Simplify the numerator","= [2"+a+"−2x²]/(x²+"+a+")²"),
   I("State the second derivative","f''(x)="+z)];
 }
 return null;
});
})();