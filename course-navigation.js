/* CalcMentor course navigation: ordered by unit, then authored problem type. */
(function(){
"use strict";
const B=window.CalcBank;
const ordered=B.groups.flatMap(group=>B.families.filter(family=>family.group===group.id));
const byId=new Map(ordered.map((family,index)=>[family.id,index]));
function position(id){return byId.has(id)?byId.get(id):-1;}
function adjacent(id,direction){
 const index=position(id);
 if(index<0||!ordered.length)return null;
 return ordered[(index+direction+ordered.length)%ordered.length];
}
const firstOfUnit=id=>ordered.find(family=>family.group===id)||null;
const lastOfUnit=id=>[...ordered].reverse().find(family=>family.group===id)||null;
window.CalcNavigation=Object.freeze({
 ordered,position,first:()=>ordered[0]||null,
 next:id=>adjacent(id,1),previous:id=>adjacent(id,-1),
 firstOfUnit,lastOfUnit,
 isLast:id=>position(id)===ordered.length-1,
 total:ordered.length
});
})();