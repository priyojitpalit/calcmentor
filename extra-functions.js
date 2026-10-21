(function(){
"use strict";
const B=window.CalcBank.families, N=window.CalcMath.integer;
function S(q,a,h1,h2,why,type){return {q,answer:String(a),hints:[h1,h2],why,type:type||"expr",options:null};}
function add(id,title,level,create,topic){B.push({id:"extra-"+id,title,level,topic:topic||"Function composition",group:"foundations",make:create});}
const types=[
["poly-cube","Cubic after quadratic",4,(a,b,c)=>["u³−"+c+"u","x²+"+a+"x+"+b,"(x^2+"+a+"*x+"+b+")^3-"+c+"*(x^2+"+a+"*x+"+b+")"]],
["reciprocal-quadratic","Reciprocal of a quadratic composite",3,(a,b,c)=>["1/(u²+"+c+")",a+"x+"+b,"1/(("+a+"*x+"+b+")^2+"+c+")"]],
["radical-affine","Radical of an affine function",3,(a,b,c)=>["sqrt(u+"+c+")",a+"x−"+b,"sqrt("+a+"*x-"+b+"+"+c+")"]],
["log-quadratic","Logarithmic composition",4,(a,b,c)=>["ln(u)","x²+"+a+"x+"+b,"ln(x^2+"+a+"*x+"+b+")"]],
["exponential-sine","Exponential of a sine",4,(a,b,c)=>["exp(u)","sin("+a+"x)+"+b,"exp(sin("+a+"*x)+"+b+")"]],
["cos-quadratic","Cosine of a quadratic",3,(a,b,c)=>["cos(u)",a+"x²−"+b,"cos("+a+"*x^2-"+b+")"]],
["quadratic-of-sine","Quadratic of a trigonometric output",3,(a,b,c)=>["u²+"+a+"u","sin("+b+"x)","sin("+b+"*x)^2+"+a+"*sin("+b+"*x)"]],
["reciprocal-inside","Reciprocal inner function",4,(a,b,c)=>["u²+"+a,"1/(x−"+b+")","1/(x-"+b+")^2+"+a]],
["sine-of-radical","Sine of a radical",4,(a,b,c)=>["sin(u)","sqrt("+a+"x+"+b+")","sin(sqrt("+a+"*x+"+b+"))"]],
["cube-of-quotient","Cube of a rational function",4,(a,b,c)=>["u³−"+c,"("+a+"x+"+b+")/(x²+1)","(("+a+"*x+"+b+")/(x^2+1))^3-"+c]],
["absolute-affine","Absolute-value outer function",3,(a,b,c)=>["abs(u)",a+"x−"+b,"abs("+a+"*x-"+b+")"]],
["log-of-reciprocal","Logarithm of a reciprocal",4,(a,b,c)=>["ln(u)","1/(x²+"+b+")","ln(1/(x^2+"+b+"))"]],
["sine-of-square","Sine of a squared affine input",4,(a,b,c)=>["sin(u)","("+a+"x+"+b+")²","sin(("+a+"*x+"+b+")^2)"]],
["sqrt-of-cubic","Square root of a cubic",4,(a,b,c)=>["sqrt(u)","x³+"+a+"x²+"+c,"sqrt(x^3+"+a+"*x^2+"+c+")"]],
["reciprocal-of-sine","Reciprocal squared-sine composite",4,(a,b,c)=>["1/(u²+"+c+")","sin("+a+"x)","1/(sin("+a+"*x)^2+"+c+")"]],
["log-of-exp","Logarithm of an exponential",3,(a,b,c)=>["ln(u)","exp("+a+"x+"+b+")",a+"*x+"+b]],
["exp-of-log","Exponential of a logarithm",4,(a,b,c)=>["exp(u)","ln(x²+"+a+")","x^2+"+a]],
["linear-of-tangent","Affine transform of tangent",3,(a,b,c)=>[a+"u+"+b,"tan(x)",a+"*tan(x)+"+b]],
["cos-of-exp","Cosine of an exponential",4,(a,b,c)=>["cos(u)","exp("+a+"x)","cos(exp("+a+"*x))"]],
["polynomial-of-cosine","Cubic of a cosine function",4,(a,b,c)=>["u³+"+b,"cos("+a+"x)","cos("+a+"*x)^3+"+b]],
["sinh-of-affine","Hyperbolic composition",4,(a,b,c)=>["sinh(u)",a+"x+"+b,"sinh("+a+"*x+"+b+")"]],
["exp-of-reciprocal","Exponential of a rational input",4,(a,b,c)=>["exp(u)","1/(x²+"+b+")","exp(1/(x^2+"+b+"))"]]
];
for(const [id,title,level,generator] of types){
 add(id,title,level,r=>{
 const a=N(r,2,7),b=N(r,1,7),c=N(r,2,7),[outer,inner,ans]=generator(a,b,c);
 return {statement:"Given f(u)="+outer+" and g(x)="+inner+", determine f(g(x)).",
 steps:[S("Find f(g(x)).",ans,"Composition evaluates the inner function first.","Replace the complete argument u of f by g(x).","Substitution gives "+ans+".")]};
 });
}
add("evaluate-at-point","Evaluate a composite at a point",3,r=>{
 const a=N(r,2,7),b=N(r,1,7),c=N(r,2,5),p=N(r,1,4),inside=a*p+b;
 return {statement:"Let f(u)=u²−"+c+" and g(x)="+a+"x+"+b+". Find f(g("+p+")).",
 steps:[S("Compute the inner value g("+p+").",inside,"Start with g, not f.","Multiply "+a+" by "+p+", then add "+b+".","g("+p+")="+inside+".","number"),S("Compute f(g("+p+")).",inside*inside-c,"Apply f to the resulting number.","Square "+inside+" and subtract "+c+".","The answer is "+(inside*inside-c)+".","number")]};
});
add("nested-triple","Nested three-function composition",4,r=>{
 const a=N(r,2,6),b=N(r,1,6),c=N(r,2,5);
 return {statement:"Let f(u)=sqrt(u), g(u)=u²+"+c+", and h(x)="+a+"x+"+b+". Determine f(g(h(x))).",
 steps:[S("Compute g(h(x)).","("+a+"*x+"+b+")^2+"+c,"Start with h, then g.","Square the full affine expression.","g(h(x))=("+a+"x+"+b+")²+"+c+"."),S("Find f(g(h(x))).","sqrt(("+a+"*x+"+b+")^2+"+c+")","Apply the square root last.","Use the entire expression from the previous step.","The composite is sqrt(("+a+"x+"+b+")²+"+c+").")]};
});
add("reverse-order","Reverse composition g(f(x))",3,r=>{
 const a=N(r,2,7),b=N(r,1,7);
 return {statement:"If f(x)=x²+"+b+" and g(u)="+a+"u, find g(f(x)).",
 steps:[S("Compute g(f(x)).",a+"*(x^2+"+b+")","The rightmost function f acts first.","Multiply its output by "+a+".","g(f(x))="+a+"(x²+"+b+").")]};
});
add("piecewise-input","Composition with a piecewise function",4,r=>{
 const a=N(r,2,7),b=N(r,2,7),p=N(r,1,5);
 return {statement:"Let f(u)=u². Let g(x)="+a+"x if x<0, and g(x)=x−"+b+" if x≥0. Calculate f(g("+p+")).",
 steps:[S("Find g("+p+").",p-b,"Read the branch condition first.",""+p+"≥0, so use x−"+b+".","g("+p+")="+(p-b)+".","number"),S("Find f(g("+p+")).",(p-b)*(p-b),"Apply f to the inner result.","Square the value.","Result="+((p-b)*(p-b))+".","number")]};
});
add("unknown-parameter","Find a parameter from a composition",4,r=>{
 const a=N(r,2,7),b=N(r,2,7),c=N(r,1,5),p=N(r,1,4),target=a*p+b+c;
 return {statement:"Let f(u)=u+"+c+", g(x)="+a+"x+t. If f(g("+p+"))="+target+", find t.",
 steps:[S("Solve for t.",b,"Set up the composition as "+a+"("+p+")+t+"+c+".","Equate to "+target+" and solve.","t="+b+".","number")]};
});
add("rational-domain","Excluded input in rational composition",4,r=>{
 const a=N(r,2,7),b=N(r,2,7),c=N(r,2,7);
 return {statement:"Let f(u)=1/(u−"+c+") and g(x)="+a+"x+"+b+". At what value is f(g(x)) undefined?",
 steps:[S("Find the excluded input.","("+c+"-"+b+")/"+a,"Set the composite denominator to zero.","Solve "+a+"x+"+b+"−"+c+"=0.","x=("+c+"−"+b+")/"+a+".","number")]};
});
add("inverse-quadratic","Inverse of a restricted quadratic",4,r=>{
 const a=N(r,1,6),b=N(r,1,7);
 return {statement:"Let f(x)=(x−"+a+")²+"+b+", with x≥"+a+". Find f⁻¹(x).",
 steps:[S("Solve y=f(x) for x.",a+"+sqrt(y-"+b+")","Take a square root after isolating the squared expression.","The restricted domain determines the positive branch.","x="+a+"+sqrt(y−"+b+")."),S("Write f⁻¹(x).",a+"+sqrt(x-"+b+")","Exchange x and y in the solved equation.","The inverse is defined for x≥"+b+".","f⁻¹(x)="+a+"+sqrt(x−"+b+").")]};
},"Inverses and domains");
add("inverse-reciprocal","Inverse of a shifted reciprocal",4,r=>{
 const a=N(r,2,7),b=N(r,2,7);
 return {statement:"For f(x)="+a+"/(x−"+b+"), find f⁻¹(x).",
 steps:[S("Solve y=f(x) for x.",b+"+"+a+"/y","Clear the denominator.","Rearrange y(x−"+b+")="+a+".","x="+b+"+"+a+"/y."),S("Give the inverse function.",b+"+"+a+"/x","Exchange input and output symbols.","x=0 is excluded from the inverse domain.","f⁻¹(x)="+b+"+"+a+"/x.")]};
},"Inverses and domains");
add("domain-log","Domain boundary of a logarithm",3,r=>{
 const a=N(r,2,8),b=N(r,2,8);
 return {statement:"Find the left endpoint of the real domain of ln("+a+"x−"+b+").",
 steps:[S("Enter the boundary value.",b+"/"+a,"The logarithm needs strictly positive input.","Solve "+a+"x−"+b+">0.","The domain is x>"+b+"/"+a+".","number")]};
},"Inverses and domains");
add("domain-log-radical","Logarithm beneath a radical",4,r=>{
 const a=N(r,2,8);
 return {statement:"For sqrt(ln(x−"+a+")), find the smallest real x in the domain.",
 steps:[S("Enter the lower endpoint.",a+1,"The square root requires ln(x−"+a+")≥0.","Since ln(z)≥0 for z≥1, require x−"+a+"≥1.","x≥"+(a+1)+".","number")]};
},"Inverses and domains");
add("domain-reciprocal-radical","Radical in a denominator",4,r=>{
 const a=N(r,2,8),b=N(r,2,8);
 return {statement:"Find the lower boundary of the domain of 1/sqrt("+a+"x−"+b+").",
 steps:[S("Enter the boundary x-value.",b+"/"+a,"The square-root denominator cannot equal zero.","Solve "+a+"x−"+b+">0.","Only x>"+b+"/"+a+" works.","number")]};
},"Inverses and domains");
})();
