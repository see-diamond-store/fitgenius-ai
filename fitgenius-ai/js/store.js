'use strict';
/* FITGENIUS AI - state, localStorage persistence, calculations, demo data */
/* state */
var mem=null;
function load(){try{var v=localStorage.getItem(KEY);if(v)return JSON.parse(v)}catch(e){}return mem}
function blank(){return {account:null,session:false,demo:false,profile:null,workouts:[],history:[],meals:[],water:{},waterGoal:2500,weights:[],chat:[]}}
var S=load()||blank();
function save(){mem=S;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var ui={auth:'login',range:7,cat:'All',q:'',busy:false,resetArmed:false};

/* calculations */
function bmrOf(w,h,a,g){return 10*w+6.25*h-5*a+(g==='Male'?5:g==='Female'?-161:-78)}
function bmiCat(b){return b<18.5?'Underweight':b<25?'Healthy range':b<30?'Overweight':'Obesity range'}
function targets(p){var bmr=bmrOf(p.weight,p.height,p.age,p.gender),tdee=bmr*(ACT[p.activity]||1.55);var kcal=Math.max(1400,Math.round((tdee+(GOAL_ADJ[p.goal]||0))/10)*10);var prot=Math.round(p.weight*((p.goal==='Lose fat'||p.goal==='Build muscle')?1.8:1.6));var fat=Math.round(kcal*0.25/9);var carb=Math.max(0,Math.round((kcal-prot*4-fat*9)/4));return {bmr:Math.round(bmr),tdee:Math.round(tdee),kcal:kcal,p:prot,c:carb,f:fat}}
function estKcal(w){return Math.round(w.exercises.reduce(function(t,e){return t+(+e.sets||0)},0)*22)}
function weekDates(off){var mon=new Date();mon.setDate(mon.getDate()-todayIdx()+(off||0)*7);var a=[];for(var i=0;i<7;i++){var d=new Date(mon);d.setDate(mon.getDate()+i);a.push(dstr(d))}return a}
var histOn=function(d){return S.history.filter(function(h){return h.date===d})};
var mealsOn=function(d){return S.meals.filter(function(m){return m.date===d})};
var waterOn=function(d){return (S.water[d]||[]).reduce(function(a,b){return a+b},0)};
var wSorted=function(){return S.weights.slice().sort(function(a,b){return a.date<b.date?-1:1})};

/* demo data */
function seedDemo(){
 var t=today();S=blank();S.demo=true;S.session=true;
 S.account={name:'Alex Demo',email:'demo@fitgenius.ai',password:'demo1234'};
 S.profile={name:'Alex Demo',age:24,gender:'Male',height:175,weight:72.4,target:68,goal:'Lose fat',level:'Intermediate',diet:'No restriction',activity:'Moderately active'};
 [75.2,74.8,74.3,73.9,73.6,73.1,72.8,72.6,72.4].forEach(function(v,i){S.weights.push({id:uid(),date:daysAgo((8-i)*7-(i===8?0:0)),kg:v})});
 S.weights[8].date=daysAgo(1);
 var mk=function(n,d,ex){return {id:uid(),name:n,day:d,exercises:ex.map(function(e){return {name:e[0],sets:e[1],reps:e[2],rest:e[3]}})}};
 S.workouts=[mk('Push Day',0,[['Bench Press',4,'8',90],['Dumbbell Shoulder Press',3,'10',75],['Push-up',3,'15',60],['Bench Dip',3,'12',60]]),
 mk('Pull Day',2,[['Dumbbell Row',4,'10',75],['Pull-up',3,'6',90],['Bicep Curl',3,'12',60],['Plank',3,'45 s',45]]),
 mk('Leg Day',4,[['Barbell Squat',4,'8',120],['Romanian Deadlift',3,'10',90],['Walking Lunge',3,'12',60],['Lying Leg Raise',3,'12',45]]),
 mk('Cardio and Core',5,[['Jump Rope',5,'2 min',45],['Mountain Climber',4,'30 s',30],['Russian Twist',3,'20',45],['Crunch',3,'20',30]])];
 [[1,0],[3,1],[5,2],[6,3],[8,0],[10,1]].forEach(function(x){var w=S.workouts[x[1]];S.history.push({id:uid(),wid:w.id,name:w.name,date:daysAgo(x[0]),kcal:estKcal(w)})});
 var fd=function(i){return FOODS[i]};
 [['Breakfast',0],['Breakfast',2],['Lunch',4],['Lunch',5],['Snacks',3]].forEach(function(x){var f=fd(x[1]);S.meals.push({id:uid(),date:t,type:x[0],name:f[0]+' ('+f[1]+')',kcal:f[2],p:f[3],c:f[4],f:f[5]})});
 S.water[t]=[250,500,500];[1650,2200,1900,2600,2300,1800].forEach(function(v,i){S.water[daysAgo(i+1)]=[v]});
 save();
}
