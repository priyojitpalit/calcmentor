/* Correct answer categories for indefinite antiderivatives. */
(function(){
"use strict";
const B=window.CalcBank;
const indices={
 "int-powers":[1], "int-trig":[1], "int-exponential":[1],
 "int-sub-power":[1], "int-sub-log":[1], "int-sub-trig":[1],
 "int-definite-poly":[0],
 "extra-integral-reciprocal":[0], "extra-integral-log-affine":[0],
 "extra-integral-negative-powers":[0], "extra-integral-root-power":[0],
 "extra-integral-sec2":[0], "extra-integral-csc2":[0],
 "extra-integral-sectan":[0], "extra-integral-csccot":[0],
 "extra-integral-arctan":[0], "extra-integral-arcsin":[0],
 "extra-integral-sub-cubic":[1], "extra-integral-sub-root":[0],
 "extra-integral-sub-expsquare":[0], "extra-integral-trig-cos2":[0]
};
const original=B.generate;
B.generate=function(id,seed){
 const result=original(id,seed),entries=indices[id];
 if(!entries)return result;
 const steps=result.steps.map((s,i)=>entries.includes(i)?{...s,type:"antiderivative"}:s);
 return {...result,steps};
};
B.gradingCategories=Object.freeze({antiderivativeFamilyCount:Object.keys(indices).length});
})();