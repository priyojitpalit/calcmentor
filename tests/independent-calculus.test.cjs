// Derive independent mathematical results from generated problem statements.
// Does NOT use CalcMath.check or compare an answer key against itself.
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};
vm.createContext(sandbox);
for(const name of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
 "extra-derivatives.js","extra-applications.js","extra-integrals.js",
 "extra-integral-applications.js","grading-categories.js"])
 vm.runInContext(fs.readFileSync(path.join(root,name),"utf8"),sandbox,{filename:name});
const B=sandbox.window.CalcBank;
const names=new Set(["sin","cos","tan","exp","ln","log","log10","sqrt","abs","sec","csc","cot","atan","asin","acos","sinh","cosh","tanh"]);
function ref(expression){
 const s=String(expression).replace(/[−–]/g,"-").replace(/π/g,"pi").replace(/²/g,"^2").replace(/³/g,"^3").replace(/⁴/g,"^4").replace(/⁵/g,"^5").replace(/⁶/g,"^6").replace(/xy/g,"x*y");
 const tokens=s.match(/\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|[()+\-*/^]/g)||[];
 if(!tokens.length)throw Error("Empty expression "+expression);
 let js="";
 for(let i=0;i<tokens.length;i++){const a=tokens[i],b=tokens[i-1];if(i&&(b===")"||/^\d/.test(b)||/^[A-Za-z_]/.test(b))&&(a==="("||/^\d/.test(a)||/^[A-Za-z_]/.test(a))&&!(names.has(b)&&a==="("))js+="*";js+=a==="^"?"**":a;}
 const scope="const {sin,cos,tan,exp,log,sqrt,abs,atan,asin,acos,log10,sinh,cosh,tanh}=Math;const ln=log,pi=Math.PI,sec=z=>1/cos(z),csc=z=>1/sin(z),cot=z=>1/tan(z);";
 try{return new Function("x","y","t",scope+"return ("+js+");");}catch(e){throw Error("Independent reference parser: "+expression+" => "+js+" "+e.message);}
}
function derivative(f,x){const h=.000018*(1+Math.abs(x));return (-f(x+2*h)+8*f(x+h)-8*f(x-h)+f(x-2*h))/(12*h);}
function close(a,b,tol=.0006){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*(1+Math.abs(b));}
function getIntegral(s){let m=s.match(/∫\s*from\s+0\s+to\s+\d+\s+of\s+(.+?)\s+dx\b/i);if(m)return m[1];m=s.match(/∫\s*(.*?)\s+dx\b/i);if(m)return m[1];m=s.match(/(?:antiderivative of|Integrate)\s+(.+?)(?:\s+dx\b|,\s+for\b|\s+for\b|\.|$)/i);if(m)return m[1];throw Error("Cannot parse integrand "+s);}
function getOriginal(s){let m=s.match(/\b(?:f\(x\)|y|s\(x\))\s*=\s*(.+?)(?:\.| for | on | at x|,| and | when | where | with |;|$)/i);if(m)return m[1];m=s.match(/d\/dx\s*\[(.+?)\]/i);if(m)return m[1];m=s.match(/(?:d\/dx\s+|derivative of\s+|Differentiate\s+)(.+?)(?:\s+where\s+|\s+for\s+|\.|$)/i);if(m)return m[1];throw Error("Cannot parse original function "+s);}
function verifyFirstDerivative(p,answer){const f=ref(getOriginal(p.statement)),key=ref(answer);let count=0;for(const x of [-.15,.13,.3,.65]){const a=derivative(z=>f(z,1,z),x),b=key(x,1,x);if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>5e8)continue;if(!close(a,b,.001))throw Error("Derivative mismatch "+p.statement+" at "+x+": "+a+" vs "+b);count++;}if(count<2)throw Error("Insufficient first-derivative reference points");}
const special=new Set(["deriv-implicit","deriv-second","deriv-nested-chain","deriv-tangent","extra-deriv-implicit-circle","extra-deriv-implicit-ellipse","extra-deriv-implicit-mixed","extra-deriv-implicit-trig","extra-deriv-nth-cos","extra-deriv-velocity-acc","extra-deriv-tangent-sine","extra-deriv-definition-point","extra-deriv-corner","extra-deriv-second-log"]);
const covered={antiderivative:new Set(),derivative:new Set(),implicit:new Set()},errors=[];
let antiderivativeCases=0,derivativeCases=0,implicitCases=0,positionCases=0;
for(const family of B.families)for(let seed=1;seed<=30;seed++)try{
 const p=B.generate(family.id,seed),id=family.id,anti=p.steps.find(s=>s.type==="antiderivative");
 if(anti){
  const f=ref(getIntegral(p.statement)),F=ref(anti.answer);let valid=0;
  for(const x of [-.8,-.4,-.1,.18,.39,.71,.95]){const expected=f(x,x,x),observed=derivative(z=>F(z,z,z),x);if(!Number.isFinite(expected)||!Number.isFinite(observed))continue;if(!close(expected,observed,.00012))throw Error("Primitive differs from integrand at "+x+": "+expected+" vs "+observed);valid++;}
  if(valid<3)throw Error("Insufficient finite primitive points");covered.antiderivative.add(id);antiderivativeCases++;
 }
 if(family.group==="differentiation"){
  if(!special.has(id))verifyFirstDerivative(p,p.steps.at(-1).answer);
  else if(["deriv-second","extra-deriv-second-log","extra-deriv-velocity-acc"].includes(id)){
   verifyFirstDerivative(p,p.steps[0].answer);
   const first=ref(p.steps[0].answer),second=ref(p.steps[1].answer);
   for(const x of [.17,.45,.8])if(!close(derivative(z=>first(z,z,z),x),second(x,x,x),.0005))throw Error("Second derivative differs");
  }else if(id.includes("implicit")){
   const match=p.statement.match(/(?:Suppose|Given|satisfies|implicitly:)\s*(.+?)\s*=\s*([^.,]+)/i);
   if(!match)throw Error("Cannot read implicit equation "+p.statement);
   const lhs=ref(match[1]),rhs=ref(match[2]),key=ref(p.steps.at(-1).answer),F=(x,y)=>lhs(x,y,x)-rhs(x,y,x);
   for(const [x,y] of [[.33,1.1],[.65,1.6],[1.3,2.2]]){const calc=-derivative(z=>F(z,y),x)/derivative(z=>F(x,z),y),given=key(x,y,x);if(!close(calc,given,.0002))throw Error("Implicit derivative differs "+calc+" vs "+given);}
   covered.implicit.add(id);implicitCases++;
  }else if(id==="deriv-nested-chain"){
   const m=p.statement.match(/sin\(\((\d+)x\s*\+\s*(\d+)\)\^(\d+)\)/);if(!m)throw Error("Cannot read nested power");const [,a,b,n]=m.map(Number),key=ref(p.steps.at(-1).answer);
   for(const x of [.14,.49,.81]){const z=a*x+b,calc=n*a*z**(n-1)*Math.cos(z**n);if(!close(key(x,x,x),calc,1e-11))throw Error("Nested chain rule differs");}
  }else if(id==="extra-deriv-nth-cos"){
   const m=p.statement.match(/f\(x\)=(\d+)cos\((\d+)x\)/);if(!m)throw Error("Cannot read cosine");const [,a,b]=m.map(Number),key=ref(p.steps.at(-1).answer);
   for(const x of [.14,.49,.81])if(!close(key(x,x,x),a*b**3*Math.sin(b*x),1e-11))throw Error("Third derivative differs");
  }else if(id==="deriv-tangent"||id==="extra-deriv-tangent-sine"){
   const f=ref(getOriginal(p.statement)),line=ref(p.steps.at(-1).answer),x0=id==="deriv-tangent"?Number(p.statement.match(/at x = (\d+)/)[1]):0,slope=derivative(z=>f(z,z,z),x0);
   if(!close(slope,ref(p.steps[0].answer)(1,1,1),.0001)||!close(slope,derivative(z=>line(z,z,z),x0),.0001)||!close(f(x0,x0,x0),line(x0,x0,x0),.0001))throw Error("Incorrect tangent line");
  }else if(id==="extra-deriv-definition-point"){
   const x0=Number(p.statement.match(/f'\((\d+)\)/)[1]),f=ref(getOriginal(p.statement)),key=ref(p.steps[0].answer)(1,1,1);
   if(!close(derivative(z=>f(z,z,z),x0),key,.0001))throw Error("Point derivative differs");
  }else if(id==="extra-deriv-corner"){
   const x0=Number(p.statement.match(/abs\(x−(\d+)\)/)[1]),f=ref("abs(x-"+x0+")"),s=p.steps[0];
   if(!(derivative(z=>f(z,z,z),x0-.001)<0&&derivative(z=>f(z,z,z),x0+.001)>0&&/one-sided slopes disagree/i.test(s.options[Number(s.answer)].label)))throw Error("Incorrect corner classification");
  }else throw Error("Unhandled derivative family "+id);
  covered.derivative.add(id);derivativeCases++;
 }
 if(id==="extra-integral-particle-position"){
  const m=p.statement.match(/position\s+(\d+)\s+m and has velocity v\(t\)=(\d+)t\+(\d+)\s+m\/s over \[0,(\d+)\]/);
  if(!m)throw Error("Cannot read velocity function");const [,s0,a,b,L]=m.map(Number),key=ref(p.steps.at(-1).answer)(1,1,1);
  if(!close(key,s0+a*L*L/2+b*L,1e-12))throw Error("Incorrect final-position key");
  positionCases++;
 }
}catch(e){if(errors.length<60)errors.push({family:family.id,seed,reason:String(e)});}
const summary={antiderivativeFamilies:covered.antiderivative.size,derivativeFamilies:covered.derivative.size,implicitFamilies:covered.implicit.size,antiderivativeCases,derivativeCases,implicitCases,positionCases,errors};
console.log("Independent calculus verification",JSON.stringify(summary));
if(errors.length)process.exitCode=1;
if(summary.antiderivativeFamilies!==21||summary.derivativeFamilies!==45||summary.positionCases!==30)throw Error("Independent coverage unexpectedly incomplete");
