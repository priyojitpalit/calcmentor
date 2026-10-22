/* CalcMentor: transparent solution steps with concrete algebra and calculus working. */
(function(){
"use strict";
const entry=(title,equation,note)=>({title,equation:equation||"",note:note||""});
const grab=(s,re)=>{const m=s.match(re);return m?m.slice(1):null;};
const num=x=>Number(x);
function detailed(p){
 const s=p.statement,id=p.id;
 let m,a,b,c,n,L,r,v,x,p0,P,H;
 switch(id){
 case "functions-composition":
  m=grab(s,/f\(u\) = u\^2 \+ (\d+) and g\(x\) = (\d+)x \+ (\d+)/);
  if(!m)return null;[c,a,b]=m;
  return [entry("Begin with the inside function","g(x) = "+a+"x + "+b,"The output of g becomes the input of f."),
  entry("Substitute into the outside function","f(g(x)) = [g(x)]² + "+c+" = ("+a+"x + "+b+")² + "+c,"Replace every u in f(u) by the entire expression g(x)."),
  entry("Expand if a polynomial form is needed","= "+num(a)**2+"x² + "+(2*num(a)*num(b))+"x + "+(num(b)**2+num(c)),"Either the factored or expanded expression is correct.")];
 case "functions-domain":
  m=grab(s,/sqrt\((\d+)x\s*−\s*(\d+)\)/);if(!m)return null;[a,b]=m;
  return [entry("Require a real square root",a+"x − "+b+" ≥ 0","A negative radicand has no real square root."),
  entry("Solve the inequality",a+"x ≥ "+b+" → x ≥ "+b+"/"+a,"Division is by a positive coefficient."),
  entry("State the domain","["+b+"/"+a+", ∞)","The left endpoint is included because √0 is defined.")];
 case "functions-inverse":
  m=grab(s,/f\(x\) = (\d+)x \+ (\d+)/);if(!m)return null;[a,b]=m;
  return [entry("Write the function with output y","y = "+a+"x + "+b),
  entry("Isolate x",a+"x = y − "+b+" → x = (y − "+b+")/"+a,"Subtract the constant; divide by the slope."),
  entry("Exchange variables","f⁻¹(x) = (x − "+b+")/"+a,"Check by substituting back into f.")];
 case "limits-factor":
  m=grab(s,/x → (\d+)\) \(x\^2 − (\d+)x \+ (\d+)\)\/\(x − (\d+)\)/);if(!m)return null;
  [a,b,c,p0]=m;
  const q=num(b)-num(a);
  return [entry("Factor the numerator","x² − "+b+"x + "+c+" = (x − "+a+")(x − "+q+")","The product of the roots is "+c+"."),
  entry("Cancel away from the hole","[(x − "+a+")(x − "+q+")]/(x − "+a+") = x − "+q,"Cancellation is valid for x≠"+a+"."),
  entry("Take the limit","lim(x→"+a+") (x − "+q+") = "+(num(a)-q),"Evaluate the simplified continuous expression.")];
 case "limits-rationalization":
  m=grab(s,/sqrt\(x \+ (\d+)\) − (\d+)\]\/x/);if(!m)return null;[c,a]=m;
  return [entry("Multiply by the conjugate","[√(x+"+c+") − "+a+"]/x · [√(x+"+c+") + "+a+"]/[√(x+"+c+") + "+a+"]"),
  entry("Apply the difference of squares","[x + "+c+" − "+num(a)**2+"]/[x(√(x+"+c+") + "+a+")] = 1/[√(x+"+c+") + "+a+"]","Since "+c+" = "+a+"², the numerator is x and cancels."),
  entry("Substitute the limiting input","lim(x→0) = 1/("+a+" + "+a+") = 1/"+(2*num(a)))];
 case "extra-limit-fourth-power":
  m=grab(s,/x → (\d+)\) \(x⁴−(\d+)\)\/\(x−(\d+)\)/);if(!m)return null;[a,b,c]=m;
  return [entry("Use a fourth-power difference","x⁴ − "+a+"⁴ = (x − "+a+")(x³ + "+a+"x² + "+num(a)**2+"x + "+num(a)**3+")"),
  entry("Cancel the common factor","= x³ + "+a+"x² + "+num(a)**2+"x + "+num(a)**3,"Only cancel for x ≠ "+a+"."),
  entry("Evaluate at the approached point","= 4("+a+")³ = "+(4*num(a)**3))];
 case "extra-limit-difference-cubes":
  m=grab(s,/x → (\d+)\) \(x³−(\d+)\)\/\(x−(\d+)\)/);if(!m)return null;[a,b,c]=m;
  return [entry("Factor the difference of cubes","x³ − "+a+"³ = (x − "+a+")(x² + "+a+"x + "+num(a)**2+")"),
  entry("Cancel for x≠"+a,"= x² + "+a+"x + "+num(a)**2),
  entry("Evaluate the limit","= 3("+a+")² = "+(3*num(a)**2))];
 case "deriv-product":
  m=grab(s,/d\/dx \[x\^(\d+) sin\((\d+)x\)\]/);if(!m)return null;[n,a]=m;
  return [entry("Identify two factors","u=x^"+n+",  v=sin("+a+"x)"),
  entry("Differentiate each factor","u'="+n+"x^"+(num(n)-1)+",  v'="+a+"cos("+a+"x)"),
  entry("Apply the product rule","(uv)'=u'v+uv'="+n+"x^"+(num(n)-1)+"sin("+a+"x) + "+a+"x^"+n+"cos("+a+"x)")];
 case "deriv-chain-power":
  m=grab(s,/Differentiate \((\d+)x\^2 \+ (\d+)\)\^(\d+)/);if(!m)return null;[a,b,n]=m;
  return [entry("Identify outer and inner functions","u="+a+"x²+"+b+",  y=u^"+n),
  entry("Differentiate the inner function","du/dx="+(2*num(a))+"x"),
  entry("Apply the chain rule","dy/dx = "+n+"u^"+(num(n)-1)+"·du/dx = "+(num(n)*2*num(a))+"x("+a+"x²+"+b+")^"+(num(n)-1))];
 case "extra-deriv-sqrt-linear":
  m=grab(s,/sqrt\((\d+)x\+(\d+)\)/);if(!m)return null;[a,b]=m;
  return [entry("Rewrite the root as a power","f(x)=("+a+"x+"+b+")^(1/2)"),
  entry("Differentiate the outside and inside","f'(x) = (1/2)("+a+"x+"+b+")^(−1/2) · "+a,"Apply the chain rule."),
  entry("Simplify","f'(x) = "+a+"/[2√("+a+"x+"+b+")]")];
 case "deriv-exponential":
  m=grab(s,/exp\((\d+)x\^2 \+ (\d+)x\)/);if(!m)return null;[a,b]=m;
  return [entry("Name the exponent","u(x)="+a+"x²+"+b+"x"),
  entry("Differentiate the exponent","u'(x)="+(2*num(a))+"x+"+b),
  entry("Apply the exponential chain rule","d[exp(u)]/dx = exp(u)u' = exp("+a+"x²+"+b+"x)("+2*num(a)+"x+"+b+")")];
 case "deriv-implicit":
  m=grab(s,/x\^2 \+ (\d+)xy \+ y\^2 = (\d+)/);if(!m)return null;[a,b]=m;
  return [entry("Differentiate both sides with respect to x","2x + "+a+"(y+xy') + 2yy' = 0","Use the product rule on xy; remember y depends on x."),
  entry("Collect the terms containing y'","("+a+"x+2y)y' = −2x − "+a+"y"),
  entry("Isolate the implicit derivative","dy/dx = (−2x − "+a+"y)/("+a+"x + 2y)")];
 case "apps-opt-rectangle":
  m=grab(s,/garden has (\d+) m of fencing/);if(!m)return null;[P]=m;H=num(P)/2;
  return [entry("Use the perimeter constraint","2x + 2y = "+P+" → y = "+H+" − x"),
  entry("Form the area function","A(x)=xy=x("+H+"−x)="+H+"x−x²"),
  entry("Differentiate and find the critical point","A'(x)="+H+"−2x = 0 → x="+(H/2)),
  entry("Check the maximum","A''(x)=−2 < 0","The rectangle is a square, so both sides equal "+H/2+" m.")];
 case "extra-opt-river":
  m=grab(s,/have (\d+) m of fencing/);if(!m)return null;[P]=m;
  return [entry("Write the fencing constraint","2x+y="+P+" → y="+P+"−2x","Only three sides need fencing."),
  entry("Express area in one variable","A(x)=x("+P+"−2x)="+P+"x−2x²"),
  entry("Differentiate and solve","A'(x)="+P+"−4x=0 → x="+(num(P)/4)),
  entry("Verify the maximum","A''(x)=−4 < 0","Width perpendicular to the river is "+num(P)/4+" m.")];
 case "apps-opt-box":
  m=grab(s,/(\d+) cm by (\d+) cm sheet/);if(!m)return null;[L,H]=m;
  return [entry("Write the dimensions after cutting corners","height=x,  base sides="+L+"−2x and "+H+"−2x"),
  entry("Build the volume function","V(x)=x("+L+"−2x)("+H+"−2x)","Physical domain: 0<x<"+Math.min(num(L),num(H))/2+"."),
  entry("Differentiate the volume","V'(x)=("+L+"−2x)("+H+"−2x)−2x("+L+"−2x)−2x("+H+"−2x)"),
  entry("Find the interior maximum","x="+num(L)/6+" cm","For a square sheet, the other critical point at x="+num(L)/2+" is a boundary with zero volume.")];
 case "apps-related-ladder":
  m=grab(s,/A (\d+)-m ladder.*foot is (\d+) m.*at (\d+) m\/s.*top is (\d+) m/);if(!m)return null;[L,a,v,b]=m;
  return [entry("Relate the ladder, foot and height","x²+y²="+L+"²","The ladder length is constant."),
  entry("Differentiate with respect to time","2x(dx/dt)+2y(dy/dt)=0"),
  entry("Solve for the unknown rate","dy/dt=−(x/y)(dx/dt)"),
  entry("Insert the measured values","dy/dt=−("+a+"/"+b+")("+v+")="+(-num(a)/num(b)*num(v))+" m/s","The negative sign means the top is descending.")];
 case "int-sub-power":
  m=grab(s,/∫ \((\d+)x \+ (\d+)\)\((\d+)x\^2 \+ (\d+)x \+ (\d+)\)\^(\d+) dx/);if(!m)return null;
  [a,b,c,p0,P,n]=m;
  return [entry("Choose the inner polynomial","u="+c+"x²+"+p0+"x+"+P),
  entry("Differentiate u","du=("+2*num(c)+"x+"+p0+") dx = ("+a+"x+"+b+")dx","The remaining factor matches du."),
  entry("Integrate with respect to u","∫u^"+n+" du = u^"+(num(n)+1)+"/"+(num(n)+1)+" + C"),
  entry("Substitute back","=("+c+"x²+"+p0+"x+"+P+")^"+(num(n)+1)+"/"+(num(n)+1)+" + C")];
 case "extra-integral-sub-cubic":
  m=grab(s,/∫ (\d+)x² \( (\d+)x³\+(\d+) \)\^(\d+) dx/);if(!m)return null;[a,b,c,n]=m;
  return [entry("Choose the interior expression","u="+b+"x³+"+c),
  entry("Differentiate the substitution","du="+a+"x² dx"),
  entry("Use the power rule","∫u^"+n+"du=u^"+(num(n)+1)+"/"+(num(n)+1)+"+C"),
  entry("Substitute back","("+b+"x³+"+c+")^"+(num(n)+1)+"/"+(num(n)+1)+"+C")];

 case "int-powers":
  m=grab(s,/of (\d+)x\^(\d+) \+ (\d+)x\^(\d+)/);if(!m)return null;[a,n,b,L]=m;
  return [entry("Integrate each term separately","∫("+a+"x^"+n+"+"+b+"x^"+L+")dx=∫"+a+"x^"+n+"dx+∫"+b+"x^"+L+"dx"),
  entry("Apply the reverse power rule","∫x^k dx = x^(k+1)/(k+1) + C","Increase each exponent by one and divide by the new exponent."),
  entry("Write the antiderivative","F(x)="+a+"x^"+(num(n)+1)+"/"+(num(n)+1)+" + "+b+"x^"+(num(L)+1)+"/"+(num(L)+1)+" + C")];
 case "int-trig":
  m=grab(s,/of (\d+)sin\((\d+)x\) \+ (\d+)cos\((\d+)x\)/);if(!m)return null;[a,b,c,L]=m;
  return [entry("Recall the reverse trigonometric derivatives","∫sin(kx)dx=−cos(kx)/k,   ∫cos(kx)dx=sin(kx)/k"),
  entry("Integrate each term with its chain factor","∫"+a+"sin("+b+"x)dx = −("+a+"/"+b+")cos("+b+"x)"),
  entry("Combine the results","F(x)=−("+a+"/"+b+")cos("+b+"x) + ("+c+"/"+L+")sin("+L+"x) + C")];
 case "int-exponential":
  m=grab(s,/of (\d+)exp\((\d+)x \+ (\d+)\)/);if(!m)return null;[a,b,c]=m;
  return [entry("Substitute the exponent","u="+b+"x+"+c+"; du="+b+" dx"),
  entry("Account for the extra coefficient","∫"+a+"exp("+b+"x+"+c+")dx=("+a+"/"+b+")∫exp(u)du"),
  entry("Integrate and return to x","F(x)=("+a+"/"+b+")exp("+b+"x+"+c+")+C")];
 case "int-definite-poly":
  m=grab(s,/from 0 to (\d+) of \((\d+)x² \+ (\d+)\)/);if(!m)return null;[L,a,b]=m;
  return [entry("Identify limits and integrand","∫₀^"+L+" ("+a+"x²+"+b+")dx"),
  entry("Find a primitive","F(x)="+a+"x³/3+"+b+"x"),
  entry("Apply the Fundamental Theorem","F("+L+")−F(0)=("+a+"·"+num(L)**3+"/3+"+b+"·"+L+")−0"),
  entry("Evaluate the result","= "+num(a)*num(L)**3+"/3 + "+num(b)*num(L))];
 case "int-ftc":
  m=grab(s,/∫ from (\d+) to x of \(t³ \+ (\d+)t\)/);if(!m)return null;[a,b]=m;
  return [entry("Apply the Fundamental Theorem","G'(x)=x³+"+b+"x","The derivative of an integral with fixed lower bound and upper bound x is its integrand evaluated at x."),
  entry("Differentiate again","G''(x)=3x²+"+b,"Now differentiate the polynomial from the previous step.")];
 case "int-ftc-chain":
  m=grab(s,/∫ from 0 to x² of cos\((\d+)t²\)/);if(!m)return null;[a]=m;
  return [entry("Identify the moving upper bound","u(x)=x²;  u'(x)=2x"),
  entry("Use the Fundamental Theorem and chain rule","H'(x)=cos("+a+"[u(x)]²)·u'(x)"),
  entry("Substitute x² and simplify","H'(x)=2x cos("+a+"x⁴)")];
 case "extra-integral-ftc-both":
  m=grab(s,/∫ from x to x² of \(t\+(\d+)\)/);if(!m)return null;[a]=m;
  return [entry("Separate the effects of both variable endpoints","F'(x)=f(x²)·(2x)−f(x)·(1)","The changing lower endpoint contributes a negative term."),
  entry("Evaluate the integrand f(t)=t+"+a,"f(x²)=x²+"+a+",   f(x)=x+"+a),
  entry("Write the derivative","F'(x)=2x(x²+"+a+")−(x+"+a+")")];
 case "int-riemann":
  m=grab(s,/f\(x\) = (\d+)x \+ (\d+) on \[0, (\d+)\].*using (\d+) right-endpoint rectangles/);if(!m)return null;[a,b,L,n]=m;
  return [entry("Find the common subinterval width","Δx=("+L+"−0)/"+n+"="+num(L)/num(n)),
  entry("Choose the right endpoints","xᵢ=iΔx = "+L+"i/"+n+",  i=1,...,"+n),
  entry("Write the right Riemann sum","Rₙ=Σᵢ₌₁^"+n+" [("+a+"xᵢ+"+b+")Δx]"),
  entry("Use the arithmetic-series formula","Σᵢ₌₁^"+n+" i="+n+"("+n+"+1)/2"),
  entry("Evaluate","Rₙ="+(num(a)*num(L)**2*(num(n)+1)/(2*num(n))+num(b)*num(L)))];
 case "extra-integral-riemann-left":
  m=grab(s,/from 0 to (\d+) of \((\d+)x\+(\d+)\).*with (\d+) equal-width LEFT-endpoint rectangles/);if(!m)return null;[L,a,b,n]=m;
  return [entry("Partition into equal widths","Δx="+L+"/"+n),
  entry("Use LEFT endpoints","xᵢ=iΔx,  i=0,...,"+(num(n)-1)),
  entry("Form the sum","Lₙ=Σᵢ₌₀^"+(num(n)-1)+" [("+a+"xᵢ+"+b+")Δx]"),
  entry("Sum the arithmetic progression","Σᵢ₌₀^"+(num(n)-1)+"i="+n+"("+(num(n)-1)+")/2"),
  entry("Evaluate","Lₙ="+(num(a)*num(L)**2*(num(n)-1)/(2*num(n))+num(b)*num(L)))];
 case "extra-integral-riemann-midpoint":
  m=grab(s,/from 0 to (\d+) of \((\d+)x\+(\d+)\).*using (\d+) midpoint rectangles/);if(!m)return null;[L,a,b,n]=m;
  return [entry("Partition the interval","Δx="+L+"/"+n),
  entry("Choose midpoint samples","xᵢ=(i−1/2)Δx, i=1,...,"+n),
  entry("Sum rectangle areas","Mₙ=Σᵢ₌₁^"+n+" [("+a+"xᵢ+"+b+")Δx]"),
  entry("Use the exactness of midpoint for linear functions","Mₙ=∫₀^"+L+" ("+a+"x+"+b+")dx = "+(num(a)*num(L)**2/2+num(b)*num(L)))];
 case "extra-opt-open-box-material":
  m=grab(s,/volume (\d+) cm³/);if(!m)return null;[v]=m;
  return [entry("Use the volume constraint","V=x²h="+v+" → h="+v+"/x²"),
  entry("Write the material area (no lid)","S=x²+4xh=x²+4("+v+")/x"),
  entry("Differentiate and set to zero","S'=2x−4("+v+")/x²=0 → x³=2("+v+")"),
  entry("Find the positive minimum","x=∛("+2*num(v)+")="+Math.cbrt(2*num(v))+" cm","S''=2+8V/x³>0 for x>0.")];
 case "extra-opt-closed-cylinder":
  m=grab(s,/volume (\d+)π cm³/);if(!m)return null;[v]=m;
  return [entry("Use the fixed volume","πr²h="+v+"π → h="+v+"/r²"),
  entry("Express closed surface area","S=2πr²+2πrh = 2πr² + 2"+v+"π/r"),
  entry("Set derivative to zero","dS/dr=4πr−2"+v+"π/r²=0 → r³="+v+"/2"),
  entry("Select the positive radius","r=∛("+v+"/2)="+Math.cbrt(num(v)/2)+" cm","The surface area diverges near r=0 and r→∞, so this critical point is the minimum.")];
 case "extra-related-sphere":
  m=grab(s,/radius (\d+) cm and radius increasing (\d+) cm\/s/);if(!m)return null;[a,v]=m;
  return [entry("Write the sphere volume","V=(4/3)πr³"),
  entry("Differentiate with respect to time","dV/dt=4πr²(dr/dt)"),
  entry("Substitute the instantaneous values","=4π("+a+")²("+v+")="+(4*num(a)**2*num(v))+"π cm³/s")];
 case "apps-related-circle":
  m=grab(s,/radius (\d+) cm and is expanding at (\d+) cm\/s/);if(!m)return null;[a,v]=m;
  return [entry("Start from the circle area","A=πr²"),
  entry("Differentiate with respect to time","dA/dt=2πr(dr/dt)"),
  entry("Substitute given values","dA/dt=2π("+a+")("+v+")="+(2*num(a)*num(v))+"π cm²/s")];
 case "extra-domain-log":
  m=grab(s,/ln\((\d+)x−(\d+)\)/);if(!m)return null;[a,b]=m;
  return [entry("Set the logarithm's input strictly positive",a+"x−"+b+">0"),
  entry("Solve the inequality","x>"+b+"/"+a),
  entry("State the real domain","("+b+"/"+a+",∞)","The endpoint is excluded because ln(0) is undefined.")];
 case "extra-domain-log-radical":
  m=grab(s,/sqrt\(ln\(x−(\d+)\)\)/);if(!m)return null;[a]=m;
  return [entry("The square root requires a nonnegative argument","ln(x−"+a+")≥0"),
  entry("Use the logarithm's monotonicity","ln(z)≥0 ⇔ z≥1"),
  entry("Solve for x","x−"+a+"≥1 → x≥"+(num(a)+1)),
  entry("State the domain","["+(num(a)+1)+",∞)")];
 case "extra-integral-washer-annulus":
  m=grab(s,/0≤x≤(\d+), (\d+)≤y≤(\d+)/);if(!m)return null;[L,r,a]=m;
  return [entry("Identify outer and inner radii","R="+a+", r="+r),
  entry("Washer cross-section","A(x)=π(R²−r²)=π("+num(a)**2+"−"+num(r)**2+")"),
  entry("Integrate along the length","V=∫₀^"+L+" π("+num(a)**2+"−"+num(r)**2+")dx"),
  entry("Evaluate","V="+(num(L)*(num(a)**2-num(r)**2))+"π")];
 case "extra-integral-cone-disks":
  m=grab(s,/y=(\d+)x from x=0 to x=(\d+)/);if(!m)return null;[a,L]=m;
  return [entry("Identify disk radii","r(x)="+a+"x"),
  entry("Set up volume","V=π∫₀^"+L+" ("+a+"x)²dx"),
  entry("Integrate","V="+num(a)**2+"π[x³/3]₀^"+L),
  entry("Evaluate","V="+(num(a)**2*num(L)**3)+"π/3")];
 case "extra-integral-shell-parabola":
  m=grab(s,/y=(\d+)x².*on \[0,(\d+)\]/);if(!m)return null;[a,L]=m;
  return [entry("Use shells parallel to the rotation axis","radius=x, height="+a+"x²"),
  entry("Set up the volume integral","V=2π∫₀^"+L+" x("+a+"x²)dx"),
  entry("Integrate","V=2π"+a+"[x⁴/4]₀^"+L),
  entry("Simplify the volume","V="+(num(a)*num(L)**4)+"π/2")];
 case "intapp-disk":
  m=grab(s,/under y = (\d+)x from x = 0 to x = (\d+)/);if(!m)return null;[a,L]=m;
  return [entry("Identify the disk radius","r(x)="+a+"x"),
  entry("Construct the volume integral","V=π∫₀^"+L+" [r(x)]²dx = π∫₀^"+L+" "+num(a)**2+"x²dx"),
  entry("Integrate","V=π["+num(a)**2+"x³/3]₀^"+L),
  entry("Evaluate","V="+num(a)**2+"·"+num(L)**3+"π/3")];
 case "intapp-shell":
  m=grab(s,/under y = (\d+)x on \[0, (\d+)\]/);if(!m)return null;[a,L]=m;
  return [entry("Identify the shell radius and height","radius=x,  height="+a+"x"),
  entry("Set up the shell integral","V=2π∫₀^"+L+" x("+a+"x) dx"),
  entry("Integrate","=2π"+a+"[x³/3]₀^"+L),
  entry("Evaluate","V="+(2*num(a)*num(L)**3)+"π/3")];
 case "extra-integral-particle-position":
  m=grab(s,/position (\d+) m and has velocity v\(t\)=(\d+)t\+(\d+) m\/s over \[0,(\d+)\]/);if(!m)return null;[p0,a,b,L]=m;
  return [entry("Relate final position to initial position","s("+L+")="+p0+"+∫₀^"+L+" ("+a+"t+"+b+")dt","Displacement is the signed integral of velocity."),
  entry("Find an antiderivative","∫("+a+"t+"+b+")dt="+a+"t²/2+"+b+"t+C"),
  entry("Evaluate over the interval","Δs=["+a+"t²/2+"+b+"t]₀^"+L+" = "+(num(a)*num(L)**2/2+num(b)*num(L))),
  entry("Include the starting position","s("+L+")="+p0+"+"+(num(a)*num(L)**2/2+num(b)*num(L))+"="+(num(p0)+num(a)*num(L)**2/2+num(b)*num(L))+" m")];
 }
 return null;
}
function build(problem){
 const specific=detailed(problem);
 if(specific)return {detailed:true,items:specific};
 const items=[];
 for(let i=0;i<problem.steps.length;i++){
  const s=problem.steps[i],label=s.type==="choice"?s.options?.find(x=>String(x.value)===String(s.answer))?.label:s.answer;
  const equation=String(label??s.answer??"")+(s.type==="antiderivative"?" + C":"");
  const raw=[s.hints?.[0],s.hints?.[1],s.why].filter(Boolean);
  const notes=raw.filter((x,j)=>raw.indexOf(x)===j).filter(x=>String(x).trim()!==String(label).trim());
  items.push(entry("Step "+(i+1)+": "+s.q,equation,notes.join(" ")));
 }
 return {detailed:false,items};
}
window.CalcSolutions={build};
})();
