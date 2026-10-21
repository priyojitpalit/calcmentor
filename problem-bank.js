/* Original, parameterized university Calculus I problem bank. */
(function(){
"use strict";
const M=window.CalcMath,I=M.integer,P=M.pick,B=[];
const S=(q,answer,h1,h2,why,type="expr",options)=>({q,answer,hints:[h1,h2],why,type,options:options||null});
const A=(id,group,topic,level,title,make)=>B.push({id,group,topic,level,title,make});
const N=(rng,a=2,b=7)=>I(rng,a,b), signed=(v)=>v<0?" - "+(-v):" + "+v;
const C=(q,answer,options,h1,h2,why)=>S(q,String(answer),h1,h2,why,"choice",options.map((v,i)=>({value:String(i),label:v})));
/* Foundations */
A("functions-composition","foundations","Functions and composition",2,"Composition of functions",r=>{
 const a=N(r,2,6),b=N(r,1,8),c=N(r,1,7);
 return {statement:"Let f(u) = u^2 + "+c+" and g(x) = "+a+"x + "+b+". Find (f ◦ g)(x).",
 steps:[S("Write the inner expression g(x).",a+"*x+"+b,"Identify which function is applied first.","g(x) goes inside f.","g(x) = "+a+"x + "+b+"."),
 S("Compute f(g(x)).","("+a+"*x+"+b+")^2+"+c,"Replace every u in f(u) with the entire expression g(x).","Square the parenthesized expression, not the individual terms.","f(g(x)) = ("+a+"x + "+b+")² + "+c+".")]};
});
A("functions-inverse","foundations","Functions and composition",2,"Inverse function",r=>{
 const a=N(r,2,7),b=N(r,1,9);
 return {statement:"Find f⁻¹(x) if f(x) = "+a+"x + "+b+".",
 steps:[S("Solve y = "+a+"x + "+b+" for x.","(y-"+b+")/"+a,"Isolate the term containing x.","Subtract "+b+" and divide by "+a+".","x = (y − "+b+")/"+a+"."),
 S("Write f⁻¹(x).","(x-"+b+")/"+a,"Exchange the roles of input and output.","Replace y by x in the solved equation.","f⁻¹(x) = (x − "+b+")/"+a+".")]};
});
A("functions-domain","foundations","Domains and algebra",2,"Domain of a radical",r=>{
 const a=N(r,2,5),b=N(r,2,9);
 return {statement:"For h(x) = sqrt("+a+"x − "+b+"), find the smallest x in the domain.",
 steps:[S("What condition must the radicand satisfy?","0","The expression inside an even root cannot be negative.","The minimum permitted value of the radicand is zero.","We need "+a+"x − "+b+" ≥ 0.","number"),
 S("Find the left endpoint of the domain.",b+"/"+a,"Solve "+a+"x − "+b+" ≥ 0.","Set the radicand to zero to locate the endpoint.","The domain is ["+b+"/"+a+", ∞).","number")]};
});
/* Limits */
A("limits-polynomial","limits","Limit laws",2,"Limit by substitution",r=>{
 const a=N(r,2,6),b=N(r,1,5),c=N(r,1,8),p=N(r,-3,3);
 return {statement:"Evaluate lim(x → "+p+") ["+a+"x^2 "+signed(-b)+"x "+signed(c)+"].",
 steps:[C("Which method applies?","0",["Direct substitution","Factor and cancel","L’Hospital’s Rule"],"Polynomials are continuous everywhere.","A polynomial's limit is its value at the point.","Direct substitution applies."),
 S("Compute the limit.",String(a*p*p-b*p+c),"Replace every x by "+p+".","Evaluate powers before multiplication.","The limit is "+(a*p*p-b*p+c)+".","number")]};
});
A("limits-factor","limits","Algebraic limits",3,"Removable discontinuity",r=>{
 const p=N(r,2,8),q=N(r,1,7);const b=p+q,c=p*q;
 return {statement:"Evaluate lim(x → "+p+") (x^2 − "+b+"x + "+c+")/(x − "+p+").",
 steps:[S("For x ≠ "+p+", simplify the rational expression.","x-"+q,"Find two numbers whose sum is "+b+" and product is "+c+".","Factor the numerator as (x − "+p+")(x − "+q+").","For x ≠ "+p+", the quotient simplifies to x − "+q+"."),
 S("Evaluate the limit.",String(p-q),"Evaluate the simplified expression, not 0/0.","Substitute x = "+p+" after cancellation.","The limit equals "+(p-q)+".","number")]};
});
A("limits-rationalization","limits","Algebraic limits",3,"Limit with a radical",r=>{
 const k=N(r,2,7),c=k*k;
 return {statement:"Evaluate lim(x → 0) [sqrt(x + "+c+") − "+k+"]/x.",
 steps:[C("Choose an algebraic strategy.","1",["Divide numerator and denominator by x","Multiply by the conjugate","Apply the power rule"],"A radical difference suggests a familiar identity.","(a − b)(a + b) = a² − b².","Use the conjugate."),
 S("After rationalizing and canceling x, what expression remains?","1/(sqrt(x+"+c+")+"+k+")","Multiply top and bottom by sqrt(x + "+c+") + "+k+".","The new numerator becomes x.","The simplified quotient is 1/(sqrt(x + "+c+") + "+k+")."),
 S("Evaluate the limit.","1/"+(2*k),"Now substitute x = 0.","The denominator becomes "+(2*k)+".","The limit is 1/"+(2*k)+".","number")]};
});
A("limits-sine","limits","Trigonometric limits",3,"Fundamental trigonometric limit",r=>{
 const a=N(r,2,9),b=N(r,2,7);
 return {statement:"Find lim(x → 0) sin("+a+"x)/("+b+"x). Angles are in radians.",
 steps:[S("Rewrite as a constant times sin("+a+"x)/("+a+"x).",a+"/"+b,"Insert "+a+"x in the denominator by compensating outside.","Multiply the standard ratio by "+a+"/"+b+".","The constant factor is "+a+"/"+b+"."),
 S("Evaluate the limit.",a+"/"+b,"Use lim(u → 0) sin(u)/u = 1.","The remaining factor tends to 1.","The limit is "+a+"/"+b+".","number")]};
});
A("limits-cosine","limits","Trigonometric limits",3,"Cosine difference limit",r=>{
 const a=N(r,2,8);
 return {statement:"Compute lim(x → 0) [1 − cos("+a+"x)]/x^2.",
 steps:[C("Which identity will be useful?","1",["sin(u + v)","1 − cos(u) = 2sin²(u/2)","cos²(u) = cos(2u)"],"The numerator is 1 − cos(u).","Use a half-angle identity.","1 − cos(u) = 2sin²(u/2)."),
 S("Evaluate the limit.",a*a+"/2","Rewrite it as ("+a*a+"/2)·[sin("+a+"x/2)/("+a+"x/2)]².","The bracket tends to 1.","The limit is "+(a*a)+"/2.","number")]};
});
A("limits-one-sided","limits","One-sided and piecewise limits",3,"Different one-sided limits",r=>{
 const a=N(r,1,6),b=N(r,2,8),c=N(r,1,6),d=b+N(r,1,6);
 return {statement:"For x < 0 let f(x) = "+a+"x + "+b+"; for x ≥ 0 let f(x) = "+c+"x + "+d+". Determine lim(x → 0) f(x).",
 steps:[S("Compute lim(x → 0⁻) f(x).",String(b),"Use the branch for x < 0.","Put x = 0 in the left expression.","Left-hand limit: "+b+".","number"),
 S("Compute lim(x → 0⁺) f(x).",String(d),"Use the branch for x ≥ 0.","Put x = 0 in the right expression.","Right-hand limit: "+d+".","number"),
 C("Does the two-sided limit exist?","1",["Yes","No"],"A two-sided limit requires both one-sided limits to agree.","Compare "+b+" and "+d+".","The one-sided limits differ, so the limit does not exist.")]};
});
A("limits-continuity","limits","Continuity",3,"Match a piecewise function",r=>{
 const a=N(r,2,7),b=N(r,1,7),c=N(r,2,5),p=N(r,1,5),left=a*p+b,k=left-c*p;
 return {statement:"For x < "+p+", let f(x) = "+a+"x + "+b+". For x ≥ "+p+", let f(x) = "+c+"x + k. Find k so f is continuous at x = "+p+".",
 steps:[S("Find the limit from the left.",String(left),"Substitute x = "+p+" into the left expression.","Calculate "+a+"("+p+") + "+b+".","The left-hand limit is "+left+".","number"),
 S("Solve for k.",String(k),"Continuity requires the right branch's value to match.","Solve "+c+"("+p+") + k = "+left+".","k = "+k+".","number")]};
});
A("limits-infinity","limits","Limits at infinity",3,"Ratio of leading coefficients",r=>{
 const a=N(r,2,9),b=N(r,2,9),c=N(r,1,8),d=N(r,1,9);
 return {statement:"Find lim(x → +∞) ("+a+"x^3 + "+c+"x + 1)/("+b+"x^3 − "+d+"x^2 + 3).",
 steps:[C("Which terms determine this limit?","0",["The highest-degree terms","The constant terms","The x terms only"],"Divide both numerator and denominator by x³.","Lower powers vanish as x increases.","The cubic terms dominate."),
 S("Give the limit.",a+"/"+b,"Divide the two leading coefficients.","The dominant ratio is ("+a+"x³)/("+b+"x³).","The limit equals "+a+"/"+b+".","number")]};
});
A("limits-vertical","limits","Infinite limits",3,"One-sided vertical asymptote",r=>{
 const a=N(r,2,9),p=N(r,1,8);
 return {statement:"Determine lim(x → "+p+"⁺) "+a+"/(x − "+p+").",
 steps:[C("As x approaches from the right, x − "+p+" is:","0",["Small and positive","Small and negative","Exactly zero"],"The superscript + means x > "+p+".","The denominator approaches 0 through positive values.","The denominator is small and positive."),
 C("What happens to the quotient?","0",["+∞","−∞","0","Finite nonzero limit"],"The numerator is positive and fixed.","A positive number divided by a tiny positive quantity grows without bound.","The limit is +∞.")]};
});
A("limits-exponential","limits","Special limits",3,"Exponential difference quotient",r=>{
 const a=N(r,2,8);
 return {statement:"Evaluate lim(x → 0) [exp("+a+"x) − 1]/x.",
 steps:[S("Rewrite using u = "+a+"x: what constant lies outside (exp(u) − 1)/u?",String(a),"Since x = u/"+a+", dividing by x multiplies by "+a+".","Write "+a+"·(exp(u) − 1)/u.","The constant factor is "+a+".","number"),
 S("Evaluate the limit.",String(a),"Use lim(u → 0) (exp(u) − 1)/u = 1.","Multiply the standard limit by "+a+".","The limit is "+a+".","number")]};
});
A("limits-squeeze","limits","Squeeze theorem",4,"Oscillation with vanishing amplitude",r=>{
 const n=N(r,2,6)*2;
 return {statement:"Determine lim(x → 0) x^"+n+" sin(1/x).",
 steps:[C("What property bounds this expression?","1",["sin(1/x) is always positive","−1 ≤ sin(1/x) ≤ 1","sin(1/x) has a limit at 0"],"The sine function is always between −1 and 1.","Multiply this inequality by x^"+n+", which is nonnegative.","−x^"+n+" ≤ x^"+n+" sin(1/x) ≤ x^"+n+"."),
 S("Evaluate the limit.","0","Both bounding expressions approach zero.","Invoke the Squeeze Theorem.","The limit is 0.","number")]};
});
/* Derivatives */
A("deriv-definition","differentiation","Derivative from first principles",3,"Difference quotient",r=>{
 const a=N(r,2,7),b=N(r,1,8),c=N(r,1,8);
 return {statement:"Use the limit definition to differentiate f(x) = "+a+"x^2 + "+b+"x + "+c+".",
 steps:[S("Simplify [f(x+h) − f(x)]/h before taking h → 0.","2*"+a+"*x+"+a+"*h+"+b,"Expand f(x+h), subtract f(x), then factor h.","The surviving numerator terms are 2"+a+"xh + "+a+"h² + "+b+"h.","The quotient is "+(2*a)+"x + "+a+"h + "+b+"."),
 S("Compute f'(x).",2*a+"*x+"+b,"Now take h → 0.","The h term disappears.","f'(x) = "+(2*a)+"x + "+b+".")]};
});
A("deriv-power","differentiation","Power rule",2,"Positive and negative powers",r=>{
 const a=N(r,2,8),b=N(r,2,7),n=N(r,3,7),m=N(r,2,5);
 return {statement:"Differentiate f(x) = "+a+"x^"+n+" + "+b+"x^(−"+m+").",
 steps:[C("Which rule differentiates both terms?","0",["Power rule","Product rule","Quotient rule"],"Each term is a constant times a power of x.","d(x^n)/dx = n·x^(n−1), including negative n.","Use the power rule."),
 S("Find f'(x).",(a*n)+"*x^"+(n-1)+"-"+(b*m)+"*x^(-"+(m+1)+")","Multiply each coefficient by its original exponent.","Be careful: the second exponent is negative.","f'(x) = "+(a*n)+"x^"+(n-1)+" − "+(b*m)+"x^(−"+(m+1)+").")]};
});
A("deriv-product","differentiation","Product rule",3,"Polynomial times sine",r=>{
 const n=N(r,2,5),a=N(r,2,6);
 return {statement:"Find d/dx [x^"+n+" sin("+a+"x)].",
 steps:[C("Which approach applies?","0",["Product rule","Quotient rule","Logarithmic differentiation required"],"Two nonconstant factors are multiplied.","Use (uv)' = u'v + uv'.","Use the product rule."),
 S("Find the derivative.",n+"*x^"+(n-1)+"*sin("+a+"*x)+"+a+"*x^"+n+"*cos("+a+"*x)","Differentiate x^"+n+" and sin("+a+"x) separately.","The derivative of sin("+a+"x) is "+a+"cos("+a+"x).","Derivative: "+n+"x^"+(n-1)+"sin("+a+"x) + "+a+"x^"+n+"cos("+a+"x).")]};
});
A("deriv-exponential-product","differentiation","Product rule",4,"Polynomial times exponential",r=>{
 const a=N(r,2,6),b=N(r,2,7),k=N(r,2,5);
 return {statement:"Differentiate y = ("+a+"x^2 + "+b+") exp("+k+"x).",
 steps:[S("Find the derivative of the polynomial factor.","2*"+a+"*x","Apply the power rule.","The constant "+b+" differentiates to zero.","The polynomial derivative is "+(2*a)+"x."),
 S("Compute dy/dx.","2*"+a+"*x*exp("+k+"*x)+("+a+"*x^2+"+b+")*"+k+"*exp("+k+"*x)","Use u'v + uv'.","Differentiate exp("+k+"x) by the chain rule: "+k+"exp("+k+"x).","Both product-rule terms are necessary.")]};
});
A("deriv-quotient","differentiation","Quotient rule",3,"Rational function",r=>{
 const a=N(r,2,7),b=N(r,1,8),c=N(r,1,5),d=N(r,6,11),det=a*d-b*c;
 return {statement:"Differentiate y = ("+a+"x + "+b+")/("+c+"x + "+d+").",
 steps:[C("Identify the denominator of the quotient-rule result.","1",["("+c+"x + "+d+")","("+c+"x + "+d+")^2","("+a+"x + "+b+")^2"],"Recall (u/v)' = (vu' − uv')/v².","Square the entire original denominator.","Use ("+c+"x + "+d+")²."),
 S("Compute y'.","("+det+")/("+c+"*x+"+d+")^2","Differentiate numerator and denominator separately.","The numerator simplifies to "+det+".","y' = "+det+"/("+c+"x + "+d+")².")]};
});
A("deriv-chain-power","differentiation","Chain rule",3,"Power of a quadratic",r=>{
 const a=N(r,2,6),b=N(r,2,8),n=N(r,3,7);
 return {statement:"Differentiate ("+a+"x^2 + "+b+")^"+n+".",
 steps:[S("Differentiate the inner function.","2*"+a+"*x","The inner function is "+a+"x² + "+b+".","Apply the power rule to the inner quadratic.","u' = "+(2*a)+"x."),
 S("Differentiate the full composition.",n+"*("+a+"*x^2+"+b+")^"+(n-1)+"*2*"+a+"*x","Differentiate the outer nth power first.","Multiply by the inner derivative.","f'(x) = "+n+"("+a+"x² + "+b+")^"+(n-1)+"·"+(2*a)+"x.")]};
});
A("deriv-nested-chain","differentiation","Chain rule",4,"Nested sine and power",r=>{
 const a=N(r,2,5),b=N(r,1,7),n=N(r,2,5);
 return {statement:"Differentiate y = sin(("+a+"x + "+b+")^"+n+").",
 steps:[S("Differentiate the inner power ("+a+"x + "+b+")^"+n+".",n*a+"*("+a+"*x+"+b+")^"+(n-1),"Apply the chain rule to the power.","Differentiate "+a+"x + "+b+" to obtain "+a+".","The inner derivative is "+(n*a)+"("+a+"x + "+b+")^"+(n-1)+"."),
 S("Compute dy/dx.","cos(("+a+"*x+"+b+")^"+n+")*"+(n*a)+"*("+a+"*x+"+b+")^"+(n-1),"The derivative of sin(u) is cos(u)u'.","Multiply cos(inner power) by your previous answer.","Apply both layers of the chain rule.")]};
});
A("deriv-log","differentiation","Logarithmic functions",3,"Log of a quadratic",r=>{
 const a=N(r,2,6),b=N(r,3,10);
 return {statement:"Differentiate y = ln("+a+"x^2 + "+b+").",
 steps:[C("Which derivative rule is correct for ln(u)?","1",["ln(u)·u'","u'/u","1/u'"],"Start with d(ln x)/dx = 1/x.","Apply the chain rule to ln(u).","d(ln u)/dx = u'/u."),
 S("Compute dy/dx.","2*"+a+"*x/("+a+"*x^2+"+b+")","Differentiate the inner quadratic.","Divide its derivative by the original inner expression.","y' = "+(2*a)+"x/("+a+"x² + "+b+").")]};
});
A("deriv-exponential","differentiation","Exponential functions",3,"Exponential of a polynomial",r=>{
 const a=N(r,2,6),b=N(r,1,7);
 return {statement:"Find d/dx exp("+a+"x^2 + "+b+"x).",
 steps:[S("Find the derivative of the exponent.","2*"+a+"*x+"+b,"Differentiate the quadratic exponent.","Keep both terms.","The exponent's derivative is "+(2*a)+"x + "+b+"."),
 S("Find the full derivative.","(2*"+a+"*x+"+b+")*exp("+a+"*x^2+"+b+"*x)","d(exp(u))/dx = exp(u)u'.","Multiply exp(original exponent) by the previous expression.","The chain-rule factor is essential.")]};
});
A("deriv-inverse-trig","differentiation","Inverse trig derivatives",4,"Derivative of arctangent",r=>{
 const a=N(r,2,7),b=N(r,1,5);
 return {statement:"Differentiate f(x) = atan("+a+"x − "+b+").",
 steps:[C("Select the rule for atan(u).","2",["u' / sqrt(1 − u²)","−u' / sqrt(1 − u²)","u' / (1 + u²)"],"Recall the derivative of arctan x.","The denominator contains 1 + u².","d[atan(u)]/dx = u'/(1 + u²)."),
 S("Compute f'(x).",a+"/(1+("+a+"*x-"+b+")^2)","The inner derivative is "+a+".","Use u = "+a+"x − "+b+".","f'(x) = "+a+"/[1 + ("+a+"x − "+b+")²].")]};
});
A("deriv-hyperbolic","differentiation","Hyperbolic functions",4,"Derivative of sinh",r=>{
 const a=N(r,2,7),b=N(r,1,6);
 return {statement:"Differentiate y = sinh("+a+"x + "+b+").",
 steps:[C("Which derivative identity is true?","0",["d(sinh u)/dx = cosh(u)u'","d(sinh u)/dx = −cosh(u)u'","d(sinh u)/dx = sinh(u)u'"],"Recall the analogy with ordinary trig functions.","sinh differentiates to cosh, without a minus sign.","The chain rule adds the inner derivative."),
 S("Compute y'.",a+"*cosh("+a+"*x+"+b+")","The inner function is linear.","Its derivative is "+a+".","y' = "+a+"cosh("+a+"x + "+b+").")]};
});
A("deriv-implicit","differentiation","Implicit differentiation",4,"Differentiate an implicit curve",r=>{
 const a=N(r,2,5),c=N(r,7,18);
 return {statement:"Suppose x^2 + "+a+"xy + y^2 = "+c+". Find dy/dx in terms of x and y.",
 steps:[C("When differentiating xy, which rule is needed?","0",["Product rule","Only the power rule","The quotient rule"],"Both x and y depend on x in an implicit curve.","d(xy)/dx = y + x·dy/dx.","Use the product rule."),
 S("Solve for dy/dx.","(-2*x-"+a+"*y)/("+a+"*x+2*y)","Differentiate each term: 2x + "+a+"(y + xy') + 2yy' = 0.","Collect all terms containing y' on one side.","dy/dx = −(2x + "+a+"y)/("+a+"x + 2y).")]};
});
A("deriv-second","differentiation","Higher derivatives",3,"Second derivative",r=>{
 const a=N(r,2,5),b=N(r,2,8),c=N(r,2,9);
 return {statement:"For f(x) = "+a+"x^4 + "+b+"x^3 + "+c+"x^2, find f''(x).",
 steps:[S("Compute f'(x).",4*a+"*x^3+"+3*b+"*x^2+"+2*c+"*x","Differentiate each monomial once.","Multiply each coefficient by its exponent.","f'(x) = "+4*a+"x³ + "+3*b+"x² + "+2*c+"x."),
 S("Compute f''(x).",12*a+"*x^2+"+6*b+"*x+"+2*c,"Differentiate your first derivative.","Do not skip the second pass through the power rule.","f''(x) = "+12*a+"x² + "+6*b+"x + "+2*c+".")]};
});
A("deriv-logarithmic","differentiation","Logarithmic differentiation",4,"Variable base and exponent",r=>{
 const a=N(r,2,5);
 return {statement:"Differentiate y = x^(x + "+a+") for x > 0.",
 steps:[S("After taking logs, what is ln(y)?","(x+"+a+")*ln(x)","Use ln(u^v) = v ln(u).","Write ln(y) = (x + "+a+")ln(x).","The logarithmic equation is ln(y) = (x + "+a+")ln(x)."),
 S("Compute dy/dx.","x^(x+"+a+")*(ln(x)+(x+"+a+")/x)","Differentiate ln y implicitly, then multiply by y.","d(ln y)/dx = y'/y.","y' = x^(x+"+a+")[ln x + (x + "+a+")/x].")]};
});
A("deriv-tangent","differentiation","Tangent line equations",3,"Tangent line to a cubic",r=>{
 const a=N(r,2,6),b=N(r,2,8),p=N(r,1,4),slope=3*p*p-2*a*p+b,value=p*p*p-a*p*p+b*p;
 return {statement:"Find the tangent line to f(x) = x^3 − "+a+"x^2 + "+b+"x at x = "+p+". Enter the right side of y = ...",
 steps:[S("Evaluate f'("+p+").",String(slope),"Differentiate f to obtain 3x² − "+(2*a)+"x + "+b+".","Substitute x = "+p+".","The slope is "+slope+".","number"),
 S("Give the right-hand side of the tangent line.",slope+"*(x-"+p+")+"+value,"Use y = f("+p+") + f'("+p+")(x − "+p+").","Calculate f("+p+") = "+value+".","y = "+value+" + "+slope+"(x − "+p+").")]};
});
/* Derivative applications */
A("apps-critical","applications","Critical points and extrema",3,"Critical numbers of a cubic",r=>{
 const a=N(r,2,8),b=N(r,1,8);
 return {statement:"Find the critical numbers of f(x) = x^3 − "+(3*a*a)+"x + "+b+". Give the positive critical number in the final step.",
 steps:[S("Compute f'(x).","3*x^2-"+3*a*a,"Critical numbers occur where f' = 0 or f' is undefined.","Differentiate term by term.","f'(x) = 3x² − "+3*a*a+"."),
 S("Give the positive critical number.",String(a),"Solve 3x² − "+3*a*a+" = 0.","The full solution is x = ±"+a+".","The positive critical number is "+a+"; the other is −"+a+".","number")]};
});
A("apps-monotonicity","applications","Increasing and decreasing",3,"First derivative sign chart",r=>{
 const a=N(r,2,7);
 return {statement:"Given f(x) = x^3 − "+3*a*a+"x, where is f increasing?",
 steps:[S("Find f'(x).","3*x^2-"+3*a*a,"Differentiate the cubic.","Factor as 3(x − "+a+")(x + "+a+").","Critical points are −"+a+" and "+a+"."),
 C("Choose the intervals on which f'(x) > 0.","0",["x < −"+a+" or x > "+a,"−"+a+" < x < "+a,"All real x"],"Make a sign chart about −"+a+" and "+a+".","A positive-leading quadratic is positive outside its roots.","f increases on (−∞, −"+a+") and ("+a+", ∞).")]};
});
A("apps-concavity","applications","Concavity and inflection",3,"Find an inflection point",r=>{
 const k=N(r,2,6),a=3*k,b=N(r,2,7);
 return {statement:"Find the x-coordinate where f(x) = x^3 + "+a+"x^2 + "+b+"x changes concavity.",
 steps:[S("Find f''(x).","6*x+"+2*a,"Differentiate the cubic twice.","f'(x) = 3x² + "+(2*a)+"x + "+b+".","f''(x) = 6x + "+2*a+"."),
 S("Find the x-coordinate of the inflection point.",String(-k),"Set f'' = 0 and verify that the sign changes.","Solve 6x + "+2*a+" = 0.","The concavity changes at x = −"+k+".","number")]};
});
A("apps-absolute","applications","Closed-interval extrema",3,"Absolute minimum on an interval",r=>{
 const a=N(r,2,7),b=N(r,2,9),upper=2*a+2;
 return {statement:"Find the absolute minimum value of f(x) = x^2 − "+(2*a)+"x + "+b+" on [0, "+upper+"].",
 steps:[S("Find the interior critical point.",String(a),"Differentiate and solve f'(x) = 0.","f'(x) = 2x − "+(2*a)+".","The interior critical point is x = "+a+".","number"),
 S("Give the absolute minimum value.",String(b-a*a),"Evaluate f at x = 0, x = "+a+", and x = "+upper+".","Compare all endpoint and critical-point values.","The absolute minimum is "+(b-a*a)+".","number")]};
});
A("apps-mvt","applications","Mean Value Theorem",3,"Find a Mean Value Theorem point",r=>{
 const l=N(r,0,4),d=N(r,2,5),u=l+2*d,a=N(r,2,8);
 return {statement:"For f(x) = x^2 + "+a+"x on ["+l+", "+u+"], find c in ("+l+", "+u+") such that f'(c) equals the secant slope.",
 steps:[S("Compute [f("+u+") − f("+l+")]/("+u+" − "+l+").",String(u+l+a),"Use the difference of squares.","The secant slope is "+(u+l)+" + "+a+".","The secant slope is "+(u+l+a)+".","number"),
 S("Solve f'(c) = secant slope.",String(l+d),"f'(x) = 2x + "+a+".","Solve 2c + "+a+" = "+(u+l+a)+".","c = "+(l+d)+".","number")]};
});
A("apps-related-circle","applications","Related rates",3,"Expanding circle",r=>{
 const radius=N(r,2,9),rate=N(r,2,6);
 return {statement:"A circular stain has radius "+radius+" cm and is expanding at "+rate+" cm/s. Find dA/dt in cm²/s. Use pi for π.",
 steps:[S("Differentiate A = pi*r^2 with respect to time (write in terms of r and dr/dt).","2*pi*r*dr","Write dA/dt = 2πr (dr/dt). For this step use dr as the symbol for dr/dt.","Use the chain rule with respect to t.","dA/dt = 2πr·dr/dt."),
 S("Evaluate dA/dt.",2*radius*rate+"*pi","Substitute r = "+radius+" and dr/dt = "+rate+".","Multiply 2·"+radius+"·"+rate+"·pi.","The area grows at "+(2*radius*rate)+"π cm²/s.","number")]};
});
A("apps-related-ladder","applications","Related rates",4,"Sliding ladder",r=>{
 const k=N(r,2,5),x=3*k,y=4*k,L=5*k,v=N(r,1,5);
 return {statement:"A "+L+"-m ladder leans against a wall. Its foot is "+x+" m from the wall and moves away at "+v+" m/s. The top is "+y+" m high. Find dy/dt.",
 steps:[C("Which constraint stays true?","0",["x² + y² = "+L+"²","x + y = "+L,"xy = "+L], "The ladder length is fixed.","The wall, ground and ladder form a right triangle.","Use x² + y² = L²."),
 S("Find dy/dt.",String(-x*v/y),"Differentiate x² + y² = L² with respect to time.","2x dx/dt + 2y dy/dt = 0, so dy/dt = −(x/y)dx/dt.","The top moves downward at "+(x*v/y)+" m/s.","number")]};
});
A("apps-opt-rectangle","applications","Optimization",3,"Maximize an enclosed area",r=>{
 const p=4*N(r,7,19),side=p/4;
 return {statement:"A rectangular garden has "+p+" m of fencing around its entire perimeter. What width maximizes its area?",
 steps:[S("If width is x, write length as a function of x.",p+"/2-x","Use 2x + 2L = "+p+".","Solve the perimeter constraint for L.","L = "+(p/2)+" − x."),
 S("Write area as a function of x.","x*("+p+"/2-x)","Area = width × length.","Substitute the constraint.","A(x) = x("+(p/2)+" − x)."),
 S("Find the maximizing width.",String(side),"Differentiate A(x), set A'(x) = 0, and check the maximum.","The optimum is the square case.","The maximizing width is "+side+" m.","number")]};
});
A("apps-opt-box","applications","Optimization",4,"Open-top box from a sheet",r=>{
 const side=6*N(r,2,7),cut=side/6;
 return {statement:"Squares of side x are cut from the corners of a "+side+" cm by "+side+" cm sheet and the sides are folded to make an open-top box. Find x that maximizes volume.",
 steps:[S("Write V(x).","x*("+side+"-2*x)^2","Height is x, and each base side loses 2x.","Volume = height × base area.","V(x) = x("+side+" − 2x)²."),
 S("Find the interior maximizing cut size.",String(cut),"Differentiate: V'(x) = ("+side+" − 2x)("+side+" − 6x).","Reject the zero-volume endpoint x = "+(side/2)+".","The maximizing cut is x = "+cut+" cm.","number")]};
});
A("apps-linearization","applications","Linear approximations",3,"Approximate a square root",r=>{
 const a=N(r,3,9),d=N(r,1,4),base=a*a;
 return {statement:"Use the linearization of sqrt(x) at x = "+base+" to approximate sqrt("+(base+d)+"). Enter a number or exact fraction.",
 steps:[S("What is f'("+base+") for f(x) = sqrt(x)?","1/"+(2*a),"Use f'(x) = 1/(2sqrt(x)).","sqrt("+base+") = "+a+".","f'("+base+") = 1/"+(2*a)+".","number"),
 S("Compute L("+(base+d)+").",String(a)+"+"+d+"/"+(2*a),"L(x) = f("+base+") + f'("+base+")(x − "+base+").","The change in x is "+d+".","L ≈ "+a+" + "+d+"/"+(2*a)+".","number")]};
});
A("apps-newton","applications","Newton's method",4,"One Newton iteration",r=>{
 const a=N(r,2,8),target=a*a+N(r,1,8);
 return {statement:"To approximate sqrt("+target+"), apply one Newton iteration to f(x) = x² − "+target+" starting from x₀ = "+a+". Find x₁.",
 steps:[S("Compute f'(x).","2*x","Differentiate x² − "+target+".","The constant disappears.","f'(x) = 2x."),
 S("Calculate x₁.",a+"-("+a*a+"-"+target+")/(2*"+a+")","Use x₁ = x₀ − f(x₀)/f'(x₀).","Substitute x₀ = "+a+".","x₁ = "+a+" − ("+(a*a-target)+")/"+(2*a)+".","number")]};
});
A("apps-lhopital","applications","L'Hospital's rule",4,"Exponential limit",r=>{
 const k=N(r,2,8);
 return {statement:"Evaluate lim(x → 0) [exp("+k+"x) − 1]/sin(x) using a suitable theorem.",
 steps:[C("Why may L'Hospital's rule be applied here?","1",["Because both terms contain exponentials","The numerator and denominator both tend to 0","Because the denominator is nonzero at 0"],"Check what happens when x = 0.","The original form is 0/0.","The hypotheses for L'Hospital's rule are met locally."),
 S("Find the resulting limit.",String(k),"Differentiate numerator and denominator separately.","The new ratio is "+k+"exp("+k+"x)/cos(x).","The limit is "+k+".","number")]};
});
A("apps-business","applications","Marginal analysis",3,"Marginal revenue",r=>{
 const a=10*N(r,12,22),b=N(r,2,7),q=N(r,3,12);
 return {statement:"A product has price-demand relation p(q) = "+a+" − "+b+"q. Find marginal revenue MR("+q+").",
 steps:[S("Write the revenue function R(q).",a+"*x-"+b+"*x^2","Revenue is quantity times price.","Use x for quantity q in the answer field.","R(q) = "+a+"q − "+b+"q²."),
 S("Evaluate R'("+q+").",String(a-2*b*q),"Differentiate revenue then substitute q = "+q+".","MR(q) = "+a+" − "+(2*b)+"q.","MR("+q+") = "+(a-2*b*q)+".","number")]};
});
/* Integrals */
A("int-powers","integration","Antiderivatives",2,"Integrate a polynomial",r=>{
 const a=N(r,2,9),b=N(r,2,7),n=N(r,2,6),m=N(r,1,4);
 return {statement:"Find an antiderivative of "+a+"x^"+n+" + "+b+"x^"+m+". A constant of integration is optional.",
 steps:[C("How does the exponent change during integration?","0",["Increase by 1","Decrease by 1","Do not change"],"Reverse the power rule for derivatives.","∫x^n dx = x^(n+1)/(n+1) + C.","Each exponent increases by one."),
 S("Find an antiderivative.",a+"*x^"+(n+1)+"/"+(n+1)+"+"+b+"*x^"+(m+1)+"/"+(m+1),"Integrate both terms separately.","Divide by each new exponent.","F(x) = "+a+"/"+(n+1)+"x^"+(n+1)+" + "+b+"/"+(m+1)+"x^"+(m+1)+" + C.")]};
});
A("int-trig","integration","Trigonometric antiderivatives",3,"Sine and cosine integral",r=>{
 const a=N(r,2,8),b=N(r,2,8),k=N(r,2,6),m=N(r,2,6);
 return {statement:"Find an antiderivative of "+a+"sin("+k+"x) + "+b+"cos("+m+"x).",
 steps:[C("What is an antiderivative of sin(u) with respect to u?","1",["cos(u)","−cos(u)","−sin(u)"],"The derivative of cos(u) is −sin(u).","Negate cos(u) to obtain sin(u).","∫sin(u)du = −cos(u)+C."),
 S("Compute the full antiderivative.","-"+a+"/"+k+"*cos("+k+"*x)+"+b+"/"+m+"*sin("+m+"*x)","Account for the inner derivatives "+k+" and "+m+".","Divide the coefficients by their inner multipliers.","F(x) = −"+a+"/"+k+" cos("+k+"x) + "+b+"/"+m+" sin("+m+"x) + C.")]};
});
A("int-exponential","integration","Exponential integrals",3,"Integrate a scaled exponential",r=>{
 const k=N(r,2,8),b=N(r,1,8),a=N(r,2,7);
 return {statement:"Find an antiderivative of "+a+"exp("+k+"x + "+b+").",
 steps:[S("Compute the derivative of the exponent.",String(k),"The exponent is linear in x.","Differentiate "+k+"x + "+b+".","The inner derivative is "+k+".","number"),
 S("Find the antiderivative.",a+"/"+k+"*exp("+k+"*x+"+b+")","Compensate for the inner derivative by dividing by "+k+".","Check by differentiating your result.","F(x) = ("+a+"/"+k+")exp("+k+"x + "+b+") + C.")]};
});
A("int-sub-power","integration","Substitution",4,"Reverse chain rule with a polynomial",r=>{
 const a=N(r,2,6),b=N(r,2,7),c=N(r,2,7),n=N(r,2,5);
 return {statement:"Evaluate ∫ ("+(2*a)+"x + "+b+")("+a+"x^2 + "+b+"x + "+c+")^"+n+" dx.",
 steps:[S("Choose u (use x in the answer as needed).",a+"*x^2+"+b+"*x+"+c,"Look for an inner expression whose derivative also appears.","Differentiate the quadratic inside the power.","Take u = "+a+"x² + "+b+"x + "+c+"."),
 S("Find an antiderivative.", "( "+a+"*x^2+"+b+"*x+"+c+" )^"+(n+1)+"/"+(n+1),"du = ("+(2*a)+"x + "+b+")dx.","The integral becomes ∫u^"+n+" du.","F(x) = ("+a+"x² + "+b+"x + "+c+")^"+(n+1)+"/"+(n+1)+" + C.")]};
});
A("int-sub-log","integration","Substitution",4,"Logarithmic substitution",r=>{
 const a=N(r,2,7),b=N(r,3,10);
 return {statement:"Evaluate ∫ "+(2*a)+"x/("+a+"x^2 + "+b+") dx.",
 steps:[S("Identify u.",a+"*x^2+"+b,"Its derivative should match the numerator.","d("+a+"x² + "+b+") = "+(2*a)+"x dx.","Choose u = "+a+"x² + "+b+"."),
 S("Find an antiderivative.","ln(abs("+a+"*x^2+"+b+"))","The transformed integral is ∫du/u.","Remember ln|u|.","F(x) = ln|"+a+"x² + "+b+"| + C.")]};
});
A("int-sub-trig","integration","Substitution",3,"Integrate composite cosine",r=>{
 const a=N(r,2,8),b=N(r,1,8);
 return {statement:"Compute ∫ "+a+"cos("+a+"x + "+b+") dx.",
 steps:[S("For u = "+a+"x + "+b+", find du/dx.",String(a),"Differentiate the linear expression.","du = "+a+" dx.","du/dx = "+a+".","number"),
 S("Give an antiderivative.","sin("+a+"*x+"+b+")","The "+a+" in the integrand becomes du.","∫cos(u)du = sin(u)+C.","F(x) = sin("+a+"x + "+b+") + C.")]};
});
A("int-definite-poly","integration","Definite integrals",3,"Fundamental theorem: polynomial",r=>{
 const a=N(r,2,7),b=N(r,2,6),L=N(r,2,6);
 return {statement:"Evaluate ∫ from 0 to "+L+" of ("+a+"x² + "+b+") dx.",
 steps:[S("Give an antiderivative.","("+a+"/3)*x^3+"+b+"*x","Apply the power rule backward.","Integrate "+a+"x² and "+b+" separately.","F(x) = "+a+"x³/3 + "+b+"x."),
 S("Evaluate F("+L+") − F(0).",String(a*L*L*L)+"/3+"+(b*L),"Use the Fundamental Theorem of Calculus.","Evaluate the cubic antiderivative at both bounds.","The definite integral is "+(a*L*L*L)+"/3 + "+(b*L)+".","number")]};
});
A("int-definite-sub","integration","Definite integrals",4,"Change variables and bounds",r=>{
 const c=N(r,2,8),L=N(r,2,6);
 return {statement:"Evaluate ∫ from 0 to "+L+" of 2x/(x² + "+c+") dx.",
 steps:[S("For u = x² + "+c+", give the upper u-bound.",String(L*L+c),"Substitute x = "+L+" into u.","The lower bound becomes "+c+".","The transformed bounds are "+c+" to "+(L*L+c)+".","number"),
 S("Compute the integral.","ln(("+L*L+"+"+c+")/"+c+")","The integral becomes ∫du/u with changed limits.","Evaluate ln(u) at the new bounds.","The answer is ln("+(L*L+c)+"/"+c+").","number")]};
});
A("int-ftc","integration","Fundamental theorem",3,"Derivative of an accumulation function",r=>{
 const a=N(r,2,8),b=N(r,2,7);
 return {statement:"Let G(x) = ∫ from "+a+" to x of (t³ + "+b+"t) dt. Find G'(x) and G''(x).",
 steps:[S("Find G'(x).","x^3+"+b+"*x","The Fundamental Theorem gives the integrand at x.","Replace t with x.","G'(x) = x³ + "+b+"x."),
 S("Find G''(x).","3*x^2+"+b,"Differentiate the expression you just found.","Differentiate x³ and "+b+"x.","G''(x) = 3x² + "+b+".")]};
});
A("int-ftc-chain","integration","Fundamental theorem",4,"Variable upper limit",r=>{
 const a=N(r,2,5);
 return {statement:"Let H(x) = ∫ from 0 to x² of cos("+a+"t²) dt. Find H'(x).",
 steps:[C("Which rule is needed in addition to the Fundamental Theorem?","1",["Product rule","Chain rule","Quotient rule"],"The upper bound is x², not x.","Differentiate the upper bound after evaluating the integrand there.","Apply the chain rule."),
 S("Find H'(x).","2*x*cos("+a+"*x^4)","Evaluate cos("+a+"t²) at t = x².","Multiply by d(x²)/dx.","H'(x) = 2x cos("+a+"x⁴).")]};
});
A("int-riemann","integration","Riemann sums",4,"Right-endpoint sum",r=>{
 const a=N(r,2,6),b=N(r,1,5),L=N(r,2,7),n=N(r,3,8);
 const delta=L/n,answer=a*L*L*(n+1)/(2*n)+b*L;
 return {statement:"For f(x) = "+a+"x + "+b+" on [0, "+L+"], approximate ∫f(x)dx using "+n+" right-endpoint rectangles.",
 steps:[S("Find Δx.",String(L)+"/"+n,"Divide the interval length by the number of subintervals.","Δx = ("+L+" − 0)/"+n+".","Δx = "+L+"/"+n+".","number"),
 S("Compute the right-endpoint Riemann sum.",String(a)+"*"+L+"^2*("+n+"+1)/(2*"+n+")+"+b+"*"+L,"Use right endpoints xᵢ = iΔx for i = 1,...,"+n+".","Σi = n(n+1)/2.","R_"+n+" = "+answer+".","number")]};
});
A("int-signed-area","integration","Signed versus geometric area",3,"Odd function and total area",r=>{
 const a=N(r,2,6);
 return {statement:"For f(x) = x³ on [−"+a+", "+a+"], calculate the signed integral and the geometric area between graph and x-axis.",
 steps:[S("Compute the signed integral.",String(0),"x³ is an odd function and the bounds are symmetric.","Areas below the axis count negatively.","The signed integral is 0.","number"),
 S("Compute the total geometric area.",String(a**4)+"/2","Integrate |x³| rather than x³.","By symmetry, 2∫₀^"+a+" x³ dx = "+(a**4)+"/2.","The geometric area is "+(a**4)+"/2.","number")]};
});
A("int-average","integration","Average value",3,"Average value of a polynomial",r=>{
 const a=N(r,2,6),b=N(r,2,5);
 return {statement:"Find the average value of f(x) = "+b+"x² on [0, "+a+"].",
 steps:[S("Compute ∫ from 0 to "+a+" of "+b+"x² dx.",String(b*a*a*a)+"/3","Find the antiderivative "+b+"x³/3.","Evaluate it at 0 and "+a+".","The integral is "+(b*a*a*a)+"/3.","number"),
 S("Compute the average value.",String(b*a*a)+"/3","Divide by the interval length "+a+".","The average value is (1/"+a+") times the integral.","f_avg = "+(b*a*a)+"/3.","number")]};
});
/* Applications of integrals */
A("intapp-between","integral-applications","Area between curves",4,"Area between a line and parabola",r=>{
 const a=2*N(r,2,7),b=N(r,1,4),intersection=a/b,area=a*a*a/(6*b*b);
 return {statement:"Compute the bounded area between y = "+a+"x and y = "+b+"x².",
 steps:[S("Find the positive intersection x-coordinate.",String(a)+"/"+b,"Solve "+a+"x = "+b+"x².","Factor x("+a+" − "+b+"x) = 0.","The intersections are x = 0 and x = "+intersection+".","number"),
 S("On the bounded interval, write top − bottom.",""+a+"*x-"+b+"*x^2","Test a point between intersections.","The line lies above the parabola.","Area integrand: "+a+"x − "+b+"x²."),
 S("Compute the area.",String(a)+"^3/(6*"+b+"^2)","Integrate top − bottom between 0 and "+intersection+".","∫("+a+"x − "+b+"x²)dx = "+a+"x²/2 − "+b+"x³/3.","The bounded area is "+area+".","number")]};
});
A("intapp-disk","integral-applications","Volumes: disks and washers",4,"Volume by disks",r=>{
 const a=N(r,2,6),L=N(r,2,5);
 return {statement:"Revolve the region under y = "+a+"x from x = 0 to x = "+L+" about the x-axis. Find the volume; enter pi for π.",
 steps:[C("Which cross-sectional area describes each disk?","0",["π·("+a+"x)²","2π·("+a+"x)","π·x²"],"The disk radius is the y-value.","Area = πr².","Disk area is π("+a+"x)²."),
 S("Compute the volume.","pi*"+a*a+"*"+L+"^3/3","Integrate π("+a+"x)² dx from 0 to "+L+".","Use ∫x²dx = x³/3.","Volume = "+(a*a*L*L*L)+ "π/3.","number")]};
});
A("intapp-shell","integral-applications","Volumes: shells",4,"Volume by cylindrical shells",r=>{
 const a=N(r,2,6),L=N(r,2,6);
 return {statement:"Revolve the region under y = "+a+"x on [0, "+L+"] about the y-axis. Calculate volume using cylindrical shells.",
 steps:[S("Write the shell integrand including 2*pi.","2*pi*x*("+a+"*x)","Shell radius is x; shell height is "+a+"x.","dV = 2π(radius)(height)dx.","Integrate 2πx("+a+"x)."),
 S("Compute the volume.","2*pi*"+a+"*"+L+"^3/3","Integrate x² from 0 to "+L+".","V = 2π"+a+" ∫₀^"+L+" x² dx.","Volume = "+(2*a*L*L*L)+"π/3.","number")]};
});
A("intapp-work","integral-applications","Work",4,"Work with variable force",r=>{
 const a=N(r,2,9),b=N(r,4,12),L=N(r,2,8);
 return {statement:"A force varies with position as F(x) = "+a+"x + "+b+" newtons. How much work is performed moving an object from x = 0 to x = "+L+" meters?",
 steps:[C("Which expression gives work?","1",["F("+L+")·"+L,"∫ from 0 to "+L+" F(x)dx","F'("+L+")"],"Force is not constant over the interval.","Integrate force with respect to displacement.","Work = ∫F(x)dx."),
 S("Compute the work.",String(a*L*L)+"/2+"+b*L,"An antiderivative is "+a+"x²/2 + "+b+"x.","Evaluate at x = "+L+" and x = 0.","W = "+(a*L*L/2+b*L)+" joules.","number")]};
});
window.CalcBank={families:B,groups:[
 {id:"foundations",name:"Functions & review"},
 {id:"limits",name:"Limits & continuity"},
 {id:"differentiation",name:"Differentiation"},
 {id:"applications",name:"Applications of derivatives"},
 {id:"integration",name:"Integration"},
 {id:"integral-applications",name:"Applications of integrals"}],
generate:(id,seed)=>{const family=B.find(f=>f.id===id);if(!family)throw Error("Unknown problem family");const data=family.make(M.seeded(seed));return {...data,id:family.id,group:family.group,topic:family.topic,level:family.level,title:family.title,seed};}
};
})();