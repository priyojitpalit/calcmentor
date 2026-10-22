/* Area, solids, work, physics and applied integrals: setup, primitive, bounds. */
(function(){
"use strict";
const H=window.CalcSolutionDetails,{item:I,grab:G,answer:A}=H;
H.register("integral-applications",p=>{
 const s=p.statement,id=p.id,z=A(p),part=i=>A(p,i);let m,a,b,c,d,L,R,r,k;
 function definite(identify,integrand,primitive,bounds,finalNote){
  return [I("Identify the geometric or physical quantity",identify),
   I("Set up the definite integral",integrand),
   I("Compute the antiderivative",primitive),
   I("Substitute the bounds",bounds),
   I("State the result",z,finalNote||"Use the given physical units.")];
 }
 switch(id){
 case "intapp-between":
  m=G(s,/between y = (\d+)x and y = (\d+)x²/);if(!m)return null;[a,b]=m;L=part(0);
  return [I("Find the curves' intersection points",a+"x="+b+"x² → x("+a+"−"+b+"x)=0 → x=0, "+L),
   I("Identify top minus bottom","("+a+"x)−("+b+"x²)="+part(1),"The line is above the parabola between these intersections."),
   I("Set up the bounded area","Area=∫₀^("+L+") ("+a+"x−"+b+"x²)dx"),
   I("Find a primitive","F(x)="+a+"x²/2−"+b+"x³/3"),
   I("Evaluate both intersection bounds","Area=F("+L+")−F(0)="+z)];
 case "intapp-work":
  m=G(s,/F\(x\) = (\d+)x \+ (\d+).*x = 0 to x = (\d+)/);if(!m)return null;[a,b,L]=m;
  return definite("Work is the accumulated force along the displacement",
   "W=∫₀^"+L+"("+a+"x+"+b+")dx",
   "Fₐ(x)="+a+"x²/2+"+b+"x",
   "W=("+a+"·"+L+"²/2+"+b+"·"+L+")−0",
   "Work="+z+" joules; variable force cannot be replaced by the final force multiplied by distance.");
 case "extra-integral-area-quadratic":
  m=G(s,/y=(\d+)x² on 0≤x≤(\d+)/);if(!m)return null;[a,L]=m;
  return definite("The parabola is nonnegative throughout the given interval",
   "Area=∫₀^"+L+" "+a+"x²dx",
   "F(x)="+a+"x³/3",
   "Area=["+a+"x³/3]₀^"+L,
   "Area="+z+" square units.");
 case "extra-integral-area-crossing":
  m=G(s,/between y=(\d+)x and y=(\d+)\/(\d+) x²/);if(!m)return null;[a,b,L]=m;
  return [I("Solve for both intersections",a+"x=("+b+"/"+L+")x²"),
   I("Factor out x","x["+a+"−("+b+"/"+L+")x]=0 → x=0 or x="+part(0)),
   I("Identify which curve is above the other","top−bottom="+a+"x−("+b+"/"+L+")x²"),
   I("Integrate between intersection points","Area=∫₀^"+part(0)+" ["+a+"x−("+b+"/"+L+")x²]dx"),
   I("Evaluate the antiderivative","Area=["+a+"x²/2−("+b+"/"+L+")x³/3]₀^"+part(0)+"="+z)];
 case "extra-integral-cross-section-squares":
  m=G(s,/side length s\(x\)=(\d+)x, for 0≤x≤(\d+)/);if(!m)return null;[a,L]=m;
  return definite("Each cross-section is a square of side "+a+"x",
   "V=∫₀^"+L+"A(x)dx=∫₀^"+L+" ("+a+"x)²dx",
   "A(x)="+Number(a)**2+"x²;  ∫A(x)dx="+Number(a)**2+"x³/3",
   "V=["+Number(a)**2+"x³/3]₀^"+L,
   "V="+z+" cubic units.");
 case "extra-integral-hooke":
  m=G(s,/F\(x\)=(\d+)x.*from 0 to (\d+) m/);if(!m)return null;[k,L]=m;
  return definite("Hooke's law gives force proportional to extension, F(x)="+k+"x",
   "W=∫₀^"+L+" "+k+"x dx",
   "Fₐ(x)="+k+"x²/2",
   "W=["+k+"x²/2]₀^"+L,
   "W="+z+" joules.");
 case "extra-integral-displacement-distance":
  m=G(s,/v\(t\)=2t−(\d+) over the interval 0≤t≤(\d+)/);if(!m)return null;[a,L]=m;R=Number(a)/2;
  return [I("Identify when velocity changes sign","2t−"+a+"=0 → t="+R),
   I("Distinguish displacement from distance","Displacement=∫v(t)dt; distance=∫|v(t)|dt"),
   I("Split where motion reverses","Distance=∫₀^"+R+" ("+a+"−2t)dt+∫_"+R+"^"+L+" (2t−"+a+")dt"),
   I("Evaluate the two positive areas","Distance=["+a+"t−t²]₀^"+R+"+[t²−"+a+"t]_"+R+"^"+L),
   I("Sum the distances","Total distance="+z)];
 case "extra-washer-variable-inner":
  m=G(s,/0≤x≤(\d+), x≤y≤(\d+)/);if(!m)return null;[L,R]=m;
  return definite("Rotation about x-axis forms washers: outer radius="+R+", inner radius=x",
   "V=π∫₀^"+L+" ("+R+"²−x²)dx",
   "F(x)=π("+Number(R)**2+"x−x³/3)",
   "V=π["+Number(R)**2+"x−x³/3]₀^"+L,
   "V="+z+" cubic units.");
 case "extra-shell-triangle":
  m=G(s,/0≤x≤(\d+), 0≤y≤(\d+)−x/);if(!m)return null;[L,R]=m;
  return definite("For y-axis rotation use a cylindrical shell of radius x and height "+R+"−x",
   "V=2π∫₀^"+L+" x("+R+"−x)dx",
   "F(x)=2π("+R+"x²/2−x³/3)",
   "V=2π["+R+"x²/2−x³/3]₀^"+L,
   "V="+z+" cubic units.");
 case "extra-disk-descending-line":
  m=G(s,/y=(\d+)−x on \[0,(\d+)\]/);if(!m)return null;[a,L]=m;
  return definite("Cross-sections around the x-axis are disks of radius "+a+"−x",
   "V=π∫₀^"+L+" ("+a+"−x)² dx",
   "F(x)=π("+a+"²x−"+a+"x²+x³/3)",
   "V=π["+a+"²x−"+a+"x²+x³/3]₀^"+L,
   "V="+z+" cubic units.");
 case "extra-cross-section-equilateral":
  m=G(s,/side length x, for 0≤x≤(\d+)/);if(!m)return null;[L]=m;
  return definite("Each slice is an equilateral triangle with side x",
   "A(x)=(√3/4)x²; V=∫₀^"+L+" A(x)dx",
   "∫A(x)dx=(√3/12)x³",
   "V=[(√3/12)x³]₀^"+L,
   "V="+z+" cubic units.");
 case "extra-cross-section-semicircle":
  m=G(s,/diameter x, 0≤x≤(\d+)/);if(!m)return null;[L]=m;
  return definite("Semicircle radius r=x/2",
   "A(x)=(1/2)π(x/2)²=πx²/8; V=∫₀^"+L+" πx²/8dx",
   "∫A(x)dx=πx³/24",
   "V=[πx³/24]₀^"+L,
   "V="+z+" cubic units.");
 case "extra-area-line-horizontal":
  m=G(s,/y=x, y=(\d+) and x=0/);if(!m)return null;[a]=m;
  return [I("Solve the intersection of y=x and y="+a,"x="+a),
   I("Identify the vertical height of each slice","height="+a+"−x"),
   I("Set up the bounded area","Area=∫₀^"+a+" ("+a+"−x)dx"),
   I("Integrate and evaluate","Area=["+a+"x−x²/2]₀^"+a),
   I("Report the triangular area","Area="+z)];
 case "extra-area-parabola-axis":
  m=G(s,/y=(\d+)−x²/);if(!m)return null;[a]=m;R=Math.sqrt(Number(a));
  return [I("Find where the curve crosses the x-axis",a+"−x²=0 → x=±"+R),
   I("Determine whether the graph is above the axis",""+a+"−x²≥0 for −"+R+"≤x≤"+R),
   I("Use symmetry","Area=2∫₀^"+R+" ("+a+"−x²)dx"),
   I("Evaluate","Area=2["+a+"x−x³/3]₀^"+R+"="+z)];
 case "extra-consumer-surplus":
  m=G(s,/p\(x\)=(\d+)−(\d+)x.*sells (\d+) units at price \$(\d+)/);if(!m)return null;[a,b,L,c]=m;
  return [I("Consumer surplus measures willingness-to-pay above market price","CS=∫₀^"+L+" [demand(x)−"+c+"]dx"),
   I("Insert demand","CS=∫₀^"+L+" [("+a+"−"+b+"x)−"+c+"]dx"),
   I("Integrate the difference","CS=[("+a+"−"+c+")x−"+b+"x²/2]₀^"+L),
   I("Evaluate the surplus","CS=$"+z)];
 case "extra-producer-surplus":
  m=G(s,/p\(x\)=(\d+)\+(\d+)x.*quantity (\d+) is \$(\d+)/);if(!m)return null;[a,b,L,c]=m;
  return [I("Producer surplus is market price minus supply price","PS=∫₀^"+L+" ["+c+"−supply(x)]dx"),
   I("Insert the supply curve","PS=∫₀^"+L+" ["+c+"−("+a+"+"+b+"x)]dx"),
   I("Find the primitive","PS=[("+c+"−"+a+")x−"+b+"x²/2]₀^"+L),
   I("Evaluate","PS=$"+z)];
 case "extra-work-quadratic-force":
  m=G(s,/F\(x\)=(\d+)x²\+(\d+)x.*from x=0 to (\d+)/);if(!m)return null;[a,b,L]=m;
  return definite("Force varies quadratically, so use the area under the force-versus-distance curve",
    "W=∫₀^"+L+" ("+a+"x²+"+b+"x)dx",
    "Fₐ(x)="+a+"x³/3+"+b+"x²/2",
    "W=["+a+"x³/3+"+b+"x²/2]₀^"+L,
    "W="+z+" joules.");
 case "extra-mass-variable-density":
  m=G(s,/0≤x≤(\d+) m.*rho\(x\)=(\d+)x\+(\d+) kg\/m/);if(!m)return null;[L,a,b]=m;
  return definite("Linear density gives mass per unit length",
   "Mass=∫₀^"+L+" ρ(x)dx=∫₀^"+L+" ("+a+"x+"+b+")dx",
   "F(x)="+a+"x²/2+"+b+"x",
   "Mass=["+a+"x²/2+"+b+"x]₀^"+L,
   "Mass="+z+" kg.");
 }
 return null;
});
})();