// Independent textbook-formula checks for every derivative-application family.
// Does not use the site's equivalence checker or the generator's intermediate keys.
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),sandbox={window:{}};
vm.createContext(sandbox);
for(const file of ["math-engine.js","problem-bank.js","extra-functions.js","extra-limits.js",
"extra-derivatives.js","extra-applications.js","extra-integrals.js","extra-integral-applications.js",
"grading-categories.js"])vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),sandbox,{filename:file});
const B=sandbox.window.CalcBank;
function nums(s,re){const m=s.match(re);if(!m)throw Error("Could not parse mathematical model: "+s);return m.slice(1).map(Number);}
function val(step){const e=String(step.answer).replace(/[−–]/g,"-").replace(/\^/g,"**");return new Function("const sqrt=Math.sqrt,pi=Math.PI,ln=Math.log;return ("+e+");")();}
function eq(a,b,tol=.000001){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*(1+Math.abs(b));}
const passed=new Set,errors=[];let numeric=0,conceptual=0;
for(const f of B.families.filter(f=>f.group==="applications"))for(let seed=1;seed<=30;seed++)try{
 const p=B.generate(f.id,(Math.imul(seed,0x9e3779b1)+1234567)>>>0),s=p.statement,id=f.id,last=p.steps.at(-1),option=last.type==="choice"?last.options.find(o=>o.value===String(last.answer))?.label:null;
 let correct=null;
 switch(id){
  case "apps-critical":{const [k]=nums(s,/x\^3 − (\d+)x/);correct=Math.sqrt(k/3);break;}
  case "apps-monotonicity":{const [k]=nums(s,/x\^3 − (\d+)x/),a=Math.sqrt(k/3);if(!(option?.includes("or")&&option.includes(String(a))&&option.includes("x <")))throw Error("Increasing region incorrect");conceptual++;break;}
  case "apps-concavity":{const [k]=nums(s,/x\^3 \+ (\d+)x\^2/);correct=-k/3;break;}
  case "apps-absolute":{const [k,b,u]=nums(s,/x\^2 − (\d+)x \+ (\d+) on \[0, (\d+)\]/),x=Math.min(u,k/2);correct=x*x-k*x+b;break;}
  case "apps-mvt":{const [l,u]=nums(s,/on \[(\d+), (\d+)\]/);correct=(l+u)/2;break;}
  case "apps-related-circle":{const [r,v]=nums(s,/radius (\d+) cm.*expanding at (\d+) cm\/s/);correct=2*Math.PI*r*v;break;}
  case "apps-related-ladder":{const [L,x,v,y]=nums(s,/A (\d+)-m ladder.*foot is (\d+) m.*at (\d+) m\/s.*top is (\d+) m/);if(L*L!==x*x+y*y)throw Error("Invalid ladder triangle");correct=-x*v/y;break;}
  case "apps-opt-rectangle":{const [P]=nums(s,/has (\d+) m of fencing/);correct=P/4;break;}
  case "apps-opt-box":{const [L,W]=nums(s,/corners of a (\d+) cm by (\d+) cm sheet/);if(L!==W)throw Error("Non-square box");correct=L/6;break;}
  case "apps-linearization":{const [base,target]=nums(s,/at x = (\d+).*approximate sqrt\((\d+)\)/);correct=Math.sqrt(base)+(target-base)/(2*Math.sqrt(base));break;}
  case "apps-newton":{const [target,x0]=nums(s,/sqrt\((\d+)\).*starting from x₀ = (\d+)/);correct=x0-(x0*x0-target)/(2*x0);break;}
  case "apps-lhopital":{const [a]=nums(s,/exp\((\d+)x\) − 1/);correct=a;break;}
  case "apps-business":{const [a,b,q]=nums(s,/p\(q\) = (\d+) − (\d+)q.*MR\((\d+)\)/);correct=a-2*b*q;break;}
  case "extra-opt-river":{const [P]=nums(s,/have (\d+) m of fencing/);correct=P/4;break;}
  case "extra-opt-square-perimeter":{const [A]=nums(s,/fixed area (\d+) m²/);correct=Math.sqrt(A);break;}
  case "extra-opt-fixed-sum":{const [sum]=nums(s,/have sum (\d+)/);correct=sum/2;break;}
  case "extra-opt-demand-revenue":{const [a,b]=nums(s,/p\(x\)=(\d+)−(\d+)x/);correct=a/(2*b);break;}
  case "extra-opt-profit-with-cost":{const [a,b,c]=nums(s,/p\(x\)=(\d+)−(\d+)x; cost is C\(x\)=\d+\+(\d+)x/);correct=(a-c)/(2*b);break;}
  case "extra-opt-rectangle-line":{const [H,b]=nums(s,/line y=(\d+)−(\d+)x/);correct=H/(2*b);break;}
  case "extra-opt-open-box-material":{const [V]=nums(s,/volume (\d+) cm³/);correct=Math.cbrt(2*V);break;}
  case "extra-opt-closed-cylinder":{const [V]=nums(s,/volume (\d+)π cm³/);correct=Math.cbrt(V/2);break;}
  case "extra-opt-nearest-point":{const [h]=nums(s,/nearest to \(0,(\d+)\)/);correct=Math.sqrt(h-.5);break;}
  case "extra-related-sphere":{const [r,v]=nums(s,/radius (\d+) cm.*increasing (\d+) cm\/s/);correct=4*Math.PI*r*r*v;break;}
  case "extra-related-surface":{const [r,v]=nums(s,/radius of a sphere is (\d+) cm.*at (\d+) cm\/s/);correct=8*Math.PI*r*v;break;}
  case "extra-related-cylinder":{const [r,v]=nums(s,/fixed radius (\d+) m at (\d+) m\/min/);correct=Math.PI*r*r*v;break;}
  case "extra-related-cube":{const [a,v]=nums(s,/edge length (\d+) cm.*increasing at (\d+) cm\/s/);correct=3*a*a*v;break;}
  case "extra-related-circle-radius":{const [r,k]=nums(s,/radius (\d+) cm.*area increasing at (\d+)π/);correct=k/(2*r);break;}
  case "extra-related-rectangle":{const [w,h,dw,dh]=nums(s,/width (\d+) m and height (\d+) m.*at (\d+) m\/s.*at (\d+) m\/s/);correct=h*dw+w*dh;break;}
  case "extra-critical-quartic":{const [sq]=nums(s,/x²−(\d+)\)²/);correct=Math.sqrt(sq);break;}
  case "extra-critical-derivative-unbounded":{const [a]=nums(s,/f\(x\)=\(x−(\d+)\)/);correct=a;break;}
  case "extra-sign-cubic":{const [a,b]=nums(s,/f'\(x\)=\(x\+(\d+)\)\(x−(\d+)\)/);if(a!==b||option!==("(−"+a+", "+a+")"))throw Error("Decreasing interval incorrect");conceptual++;break;}
  case "extra-second-derivative-test":{if(option!=="Local minimum")throw Error("Second derivative classification incorrect");conceptual++;break;}
  case "extra-rolle-theorem":correct=0;break;
  case "extra-mvt-power":{const [a,b]=nums(s,/on \[−(\d+), (\d+)\]/);if(a!==b)throw Error("Asymmetric MVT bounds");correct=a/Math.sqrt(3);break;}
  case "extra-linearize-ln":{const [a]=nums(s,/ln\(1\+1\/(\d+)\)/);correct=1/a;break;}
  case "extra-newton-cubic":{const [target,x0]=nums(s,/cube root of (\d+).*x₀=(\d+)/);correct=x0-(x0**3-target)/(3*x0*x0);break;}
  case "extra-motion-rest":{const [k]=nums(s,/s\(t\)=t³−(\d+)t/);correct=Math.sqrt(k/3);break;}
  case "extra-motion-velocity-sign":{if(!option?.includes("No")||!option.includes("opposite signs"))throw Error("Incorrect acceleration/velocity interpretation");conceptual++;break;}
  default:throw Error("Unknown derivative application "+id);
 }
 if(correct!==null){const stored=val(last);if(!eq(stored,correct))throw Error("Wrong application result "+stored+" vs independently derived "+correct);numeric++;}
 passed.add(id);
}catch(e){if(errors.length<50)errors.push({id:f.id,seed,error:String(e)});}
const report={applicationFamilies:passed.size,numericCases:numeric,conceptualCases:conceptual,errors};
console.log("Independent derivative applications verification",JSON.stringify(report));
if(errors.length||passed.size!==38)process.exitCode=1;
