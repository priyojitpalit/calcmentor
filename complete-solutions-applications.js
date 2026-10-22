/* Full derivative-application working: objective, constraints, derivatives and interpretation. */
(function(){
"use strict";
const H=window.CalcSolutionDetails,{item:I,grab:G,answer:A}=H;
H.register("applications",p=>{
 const s=p.statement,id=p.id,z=A(p);let m,a,b,c,d,L,q,x,domain;
 function opt(objective,derivative,eq,verify,context){
  return [I("Construct the objective function",objective,context||"Identify the quantity to optimize."),
  I("Differentiate the objective",derivative),
  I("Set the derivative equal to zero",eq),
  I("Check and interpret the critical point","Result: "+z,verify)];
 }
 switch(id){
 case "apps-critical":
  m=G(s,/f\(x\) = x\^3 − (\d+)x \+ (\d+)/);if(!m)return null;[a,b]=m;
  return [I("Differentiate the polynomial","f'(x)=3x²−"+a),
    I("Set the derivative equal to zero","3x²−"+a+"=0"),
    I("Solve the critical-point equation","x²="+a+"/3 → x=±√("+a+"/3)"),
    I("Select the requested positive critical number","x="+z,"The negative root is also critical.")];
 case "apps-monotonicity":
  m=G(s,/f\(x\) = x\^3 − (\d+)x/);if(!m)return null;[a]=m;
  return [I("Compute the derivative","f'(x)=3x²−"+a),
   I("Solve for derivative zeros","3x²−"+a+"=0 → x=±√("+a+"/3)"),
   I("Build the sign chart","3x²−"+a+">0 outside the two roots; <0 between","A quadratic with positive leading coefficient is positive outside its roots."),
   I("Report the increasing intervals",z,"The function increases exactly where f'(x)>0.")];
 case "apps-concavity":
  m=G(s,/f\(x\) = x\^3 \+ (\d+)x\^2 \+ (\d+)x/);if(!m)return null;[a,b]=m;
  return [I("Find the first derivative","f'(x)=3x²+"+(2*Number(a))+"x+"+b),
    I("Differentiate again","f''(x)=6x+"+(2*Number(a))),
    I("Find the candidate inflection point","6x+"+(2*Number(a))+"=0"),
    I("Check that f'' changes sign","f'' is linear with positive slope"),
    I("Conclude the inflection x-coordinate","x="+z)];
 case "apps-absolute":
  m=G(s,/f\(x\) = x\^2 − (\d+)x \+ (\d+) on \[0, (\d+)\]/);if(!m)return null;[a,b,L]=m;
  x=Number(a)/2;
  return [I("Differentiate the objective","f'(x)=2x−"+a),
   I("Find the interior critical point","2x−"+a+"=0 → x="+x),
   I("Evaluate all candidates","f(0)="+b+";  f("+x+")="+(x*x-Number(a)*x+Number(b))+";  f("+L+")="+(Number(L)**2-Number(a)*Number(L)+Number(b))),
   I("Compare candidate values on the closed interval","Absolute minimum = "+z,"By the Extreme Value Theorem, a continuous function attains its absolute extrema at a critical point or an endpoint.")];
 case "apps-mvt":
  m=G(s,/f\(x\) = x\^2 \+ (\d+)x on \[(\d+), (\d+)\]/);if(!m)return null;[a,b,L]=m;
  return [I("Verify the Mean Value Theorem's hypotheses","Polynomial f is continuous on ["+b+","+L+"] and differentiable in ("+b+","+L+")"),
    I("Compute the secant slope","[f("+L+")−f("+b+")]/("+L+"−"+b+") = "+A(p,0)),
    I("Differentiate the polynomial","f'(x)=2x+"+a),
    I("Equate tangent slope to average slope","2c+"+a+"="+A(p,0)),
    I("Solve for an interior point","c="+z)];
 case "apps-linearization":
  m=G(s,/sqrt\(x\) at x = (\d+) to approximate sqrt\((\d+)\)/);if(!m)return null;[a,b]=m;
  return [I("Write the derivative","f'(x)=1/(2√x)"),
   I("Evaluate base value and slope","f("+a+")="+Math.sqrt(Number(a))+"; f'("+a+")="+A(p,0)),
   I("Construct the tangent approximation","L(x)=f("+a+")+f'("+a+")(x−"+a+")"),
   I("Use x="+b,"L("+b+")="+Math.sqrt(Number(a))+"+"+A(p,0)+"("+b+"−"+a+")"),
   I("Calculate the requested estimate","L("+b+")="+z)];
 case "apps-newton":
  m=G(s,/sqrt\((\d+)\).*x₀ = (\d+)/);if(!m)return null;[a,b]=m;
  return [I("Choose the root equation","f(x)=x²−"+a),
   I("Differentiate","f'(x)=2x"),
   I("State Newton's iteration","x₁=x₀−f(x₀)/f'(x₀)"),
   I("Insert the starting guess","x₁="+b+"−("+b+"²−"+a+")/(2·"+b+")"),
   I("Compute one iteration","x₁="+z)];
 case "apps-lhopital":
  m=G(s,/exp\((\d+)x\) − 1/);if(!m)return null;[a]=m;
  return [I("Check the original form","lim(x→0)[exp("+a+"x)−1]/sin(x)=0/0"),
   I("Differentiate numerator and denominator independently","lim(x→0) "+a+"exp("+a+"x)/cos(x)"),
   I("Substitute the limiting input","["+a+"exp(0)]/cos(0)="+a+"·1/1"),
   I("Conclude","lim = "+z)];
 case "apps-business":
  m=G(s,/p\(q\) = (\d+) − (\d+)q.*MR\((\d+)\)/);if(!m)return null;[a,b,q]=m;
  return [I("Use revenue = price times quantity","R(q)=q·p(q)"),
   I("Substitute the demand relation","R(q)=q("+a+"−"+b+"q)="+a+"q−"+b+"q²"),
   I("Differentiate for marginal revenue","MR(q)=R'(q)="+a+"−"+(2*Number(b))+"q"),
   I("Evaluate the requested quantity","MR("+q+")="+a+"−"+(2*Number(b))+"("+q+")="+z)];
 case "extra-opt-square-perimeter":
  m=G(s,/fixed area (\d+) m²/);if(!m)return null;[a]=m;
  return opt("A=xy="+a+" → y="+a+"/x;  P(x)=2x+2("+a+"/x)",
   "P'(x)=2−2("+a+")/x²","2−2("+a+")/x²=0 → x²="+a,"P''(x)=4("+a+")/x³>0 for x>0.");
 case "extra-opt-fixed-sum":
  m=G(s,/have sum (\d+)/);if(!m)return null;[a]=m;
  return opt("x+y="+a+" → y="+a+"−x; product Q(x)=x("+a+"−x)",
   "Q'(x)="+a+"−2x",a+"−2x=0","Q''(x)=−2<0; this is a maximum.");
 case "extra-opt-demand-revenue":
  m=G(s,/p\(x\)=(\d+)−(\d+)x/);if(!m)return null;[a,b]=m;
  return opt("R(x)=xp(x)=x("+a+"−"+b+"x)="+a+"x−"+b+"x²",
  "R'(x)="+a+"−"+(2*Number(b))+"x",a+"−"+(2*Number(b))+"x=0","R''(x)=−"+(2*Number(b))+"<0: maximum revenue.");
 case "extra-opt-profit-with-cost":
  m=G(s,/p\(x\)=(\d+)−(\d+)x; cost is C\(x\)=(\d+)\+(\d+)x/);if(!m)return null;[a,b,c,d]=m;
  return opt("P(x)=R(x)−C(x)=x("+a+"−"+b+"x)−("+c+"+"+d+"x)",
  "P'(x)=("+a+"−"+d+")−"+(2*Number(b))+"x",
  "("+a+"−"+d+")−"+(2*Number(b))+"x=0",
  "P''(x)=−"+(2*Number(b))+"<0. Fixed cost affects profit but not the maximizing output.");
 case "extra-opt-rectangle-line":
  m=G(s,/line y=(\d+)−(\d+)x/);if(!m)return null;[a,b]=m;
  return opt("A(x)=x·y=x("+a+"−"+b+"x)","A'(x)="+a+"−"+(2*Number(b))+"x",a+"−"+(2*Number(b))+"x=0",
  "A''(x)=−"+(2*Number(b))+"<0; the critical point gives maximal area.");
 case "extra-opt-nearest-point":
  m=G(s,/nearest to \(0,(\d+)\)/);if(!m)return null;[a]=m;
  return [I("Use squared distance to avoid unnecessary radicals","D²=x²+(y−"+a+")²"),
   I("Apply the parabola condition y=x²","D²(x)=x²+(x²−"+a+")²"),
   I("Differentiate squared distance","(D²)'=2x+4x(x²−"+a+")=2x[1+2(x²−"+a+")]"),
   I("Solve the nonzero stationary condition","1+2(x²−"+a+")=0 → x²="+(Number(a)-.5)),
   I("Choose the positive minimizing coordinate","x="+z,"Compare stationary values with x=0; the positive nonzero critical point yields the minimum distance.")];
 case "extra-related-surface":
  m=G(s,/radius of a sphere is (\d+) cm and increasing at (\d+) cm\/s/);if(!m)return null;[a,b]=m;
  return [I("Relate area to radius","A=4πr²"),
   I("Differentiate with respect to time","dA/dt=8πr(dr/dt)"),
   I("Substitute instantaneous radius and radial speed","dA/dt=8π("+a+")("+b+")"),
   I("Compute the rate","dA/dt="+z+" cm²/s")];
 case "extra-related-cylinder":
  m=G(s,/fixed radius (\d+) m at (\d+) m\/min/);if(!m)return null;[a,b]=m;
  return [I("Write the cylinder volume","V=πr²h"),
    I("Hold radius fixed while differentiating","dV/dt=πr² dh/dt"),
    I("Substitute known radius and rising speed","dV/dt=π("+a+")²("+b+")"),
    I("Compute inflow volume per minute","dV/dt="+z+" m³/min")];
 case "extra-related-cube":
  m=G(s,/edge length (\d+) cm.*increasing at (\d+) cm\/s/);if(!m)return null;[a,b]=m;
  return [I("Express volume through side length","V=s³"),
   I("Differentiate with respect to time","dV/dt=3s²(ds/dt)"),
   I("Insert measured side and speed","dV/dt=3("+a+")²("+b+")"),
   I("Evaluate with cubic units","dV/dt="+z+" cm³/s")];
 case "extra-related-circle-radius":
  m=G(s,/radius (\d+) cm.*area increasing at (\d+)π/);if(!m)return null;[a,b]=m;
  return [I("Start from circle area","A=πr²"),
   I("Differentiate both sides with respect to time","dA/dt=2πr(dr/dt)"),
   I("Solve for radial speed","dr/dt=(dA/dt)/(2πr)"),
   I("Substitute the specified values","dr/dt=("+b+"π)/(2π·"+a+")="+z+" cm/s")];
 case "extra-related-rectangle":
  m=G(s,/width (\d+) m and height (\d+) m.*at (\d+) m\/s.*at (\d+) m\/s/);if(!m)return null;[a,b,c,d]=m;
  return [I("Represent the changing area","A(t)=w(t)h(t)"),
   I("Differentiate using product rule","dA/dt=h(dw/dt)+w(dh/dt)"),
   I("Insert widths and rates","dA/dt="+b+"("+c+")+"+a+"("+d+")"),
   I("Evaluate","dA/dt="+z+" m²/s")];
 case "extra-critical-quartic":
  m=G(s,/f\(x\)=\(x²−(\d+)\)²/);if(!m)return null;[a]=m;
  return [I("Apply power and chain rules","f'(x)=2(x²−"+a+")·2x"),
   I("Factor the derivative","f'(x)=4x(x²−"+a+")"),
   I("Set each factor equal to zero","x=0 or x²="+a),
   I("Give the requested positive critical number","x="+z)];
 case "extra-critical-derivative-unbounded":
  m=G(s,/f\(x\)=\(x−(\d+)\)\^\(1\/3\)/);if(!m)return null;[a]=m;
  return [I("Use the power rule","f'(x)=(1/3)(x−"+a+")^(−2/3)"),
   I("Identify where the derivative is undefined","(x−"+a+")^(2/3)=0 at x="+a),
   I("Check that the original function is defined","f("+a+")=0"),
   I("Report the critical number","x="+z,"A defined point with undefined derivative counts as critical.")];
 case "extra-sign-cubic":
  m=G(s,/f'\(x\)=\(x\+(\d+)\)\(x−(\d+)\)/);if(!m)return null;[a,b]=m;
  return [I("Set the derivative factors to zero","(x+"+a+")(x−"+b+")=0 → x=−"+a+", "+b),
   I("Construct sign regions","(−∞,−"+a+"), (−"+a+","+b+"), ("+b+",∞)"),
   I("Test the sign between the critical numbers","At x=0, f'(0)=("+a+")(−"+b+")<0"),
   I("State where f is decreasing",z)];
 case "extra-second-derivative-test":
  m=G(s,/f\(x\)=x²−(\d+)x\+(\d+).*x=(\d+)/);if(!m)return null;[a,b,c]=m;
  return [I("Find the first derivative","f'(x)=2x−"+a),
   I("Verify stationarity","f'("+c+")=2("+c+")−"+a+"=0"),
   I("Evaluate the second derivative","f''(x)=2>0"),
   I("Classify the critical point",z,"Positive second derivative means locally concave up.")];
 case "extra-rolle-theorem":
  m=G(s,/f\(x\)=x²−(\d+) on \[−(\d+), (\d+)\]/);if(!m)return null;
  return [I("Check continuity and differentiability","Polynomials satisfy both hypotheses on any closed interval."),
   I("Check endpoint equality","f(−"+m[1]+")=f("+m[2]+")=0"),
   I("Differentiate the function","f'(x)=2x"),
   I("Find a point with f'(c)=0","2c=0 → c="+z)];
 case "extra-mvt-power":
  m=G(s,/on \[−(\d+), (\d+)\]/);if(!m)return null;[a,b]=m;
  return [I("Confirm the Mean Value Theorem applies","f(x)=x³ is continuous on the closed interval and differentiable inside."),
   I("Compute the average slope","[f("+b+")−f(−"+a+")]/("+b+"+"+a+")="+A(p,0)),
   I("Compute derivative at an unknown interior point","f'(c)=3c²"),
   I("Set tangent slope equal to secant slope","3c²="+A(p,0)),
   I("Select the positive solution","c="+z)];
 case "extra-linearize-ln":
  m=G(s,/ln\(1\+1\/(\d+)\)/);if(!m)return null;[a]=m;
  return [I("Use f(x)=ln(1+x) near x=0","f(0)=0"),
   I("Differentiate at the base point","f'(x)=1/(1+x) → f'(0)=1"),
   I("Construct the linear approximation","L(x)=f(0)+f'(0)x=x"),
   I("Evaluate at the small positive input","ln(1+1/"+a+")≈L(1/"+a+")="+z)];
 case "extra-newton-cubic":
  m=G(s,/cube root of (\d+).*x₀=(\d+)/);if(!m)return null;[a,b]=m;
  return [I("Convert root extraction to a zero","f(x)=x³−"+a),
   I("Differentiate the function","f'(x)=3x²"),
   I("State one Newton iteration","x₁=x₀−f(x₀)/f'(x₀)"),
   I("Substitute the initial value","x₁="+b+"−("+b+"³−"+a+")/[3("+b+")²]"),
   I("Give the new estimate","x₁="+z)];
 case "extra-motion-rest":
  m=G(s,/s\(t\)=t³−(\d+)t/);if(!m)return null;[a]=m;
  return [I("Velocity is the derivative of position","v(t)=s'(t)=3t²−"+a),
   I("Rest requires instantaneous velocity zero","3t²−"+a+"=0"),
   I("Solve for possible times","t=±√("+a+"/3)"),
   I("Use t≥0 to select the physical time","t="+z)];
 case "extra-motion-velocity-sign":
  m=G(s,/v\(t\)=(\d+)−2t and acceleration is a\(t\)=−2/);if(!m)return null;[a]=m;
  return [I("Evaluate velocity at the requested instant","v(0)="+a+">0"),
   I("Read the acceleration","a(0)=−2<0"),
   I("Compare the two signs","v(0)·a(0)<0"),
   I("Describe speed behavior",z,"Speed decreases when nonzero velocity and acceleration have opposite signs.")];
 }
 return null;
});
})();