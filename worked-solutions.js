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
  m=grab(s,/∫ (\d+)x² \( (\d+)x³\+(\d+) \)\\^(\d+) dx/);if(!m)return null;[a,b,c,n]=m;
  return [entry("Choose the interior expression","u="+b+"x³+"+c),
  entry("Differentiate the substitution","du="+a+"x² dx"),
  entry("Use the power rule","∫u^"+n+"du=u^"+(num(n)+1)+"/"+(num(n)+1)+"+C"),
  entry("Substitute back","("+b+"x³+"+c+")^"+(num(n)+1)+"/"+(num(n)+1)+"+C")];
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
