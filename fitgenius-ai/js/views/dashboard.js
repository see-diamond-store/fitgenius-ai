'use strict';
/* FITGENIUS AI - app shell (sidebar) and dashboard */
/* app shell */
var NAV=[['dashboard','Dashboard','dashboard'],['coach','AI Coach','bot'],['workouts','Workouts','dumbbell'],['diet','Nutrition','utensils'],['calc','Calculator','calc'],['progress','Progress','trend'],['water','Water','drop'],['library','Exercises','book'],['profile','Profile','user']];
function shell(route,inner){
 var links=NAV.map(function(n){return '<a href="#'+n[0]+'" class="'+(n[0]===route?'on':'')+'" '+(n[0]===route?'aria-current="page"':'')+'>'+ic(n[2])+n[1]+'</a>'}).join('');
 return '<div class="shell" id="shell"><div class="scrim" data-act="nav"></div><aside class="side" aria-label="Main navigation"><div class="row sp">'+logo()+'<button class="ib" data-act="nav" aria-label="Close menu" style="display:none">'+ic('x')+'</button></div><nav class="lk">'+links+'</nav><div class="me">'+(S.demo?'<span class="pill a">Demo data</span>':'')+'<div class="sm"><b>'+esc(S.profile.name)+'</b><div class="mut xs">'+esc(S.account?S.account.email:'')+'</div></div><button class="btn s ghost" data-act="logout">'+ic('logout',16)+'Log out</button></div></aside><div class="main"><div class="top">'+logo()+'<button class="ib" data-act="nav" aria-label="Open menu">'+ic('menu')+'</button></div><main class="view" id="view">'+(S.demo?'<div class="banner" style="margin-bottom:20px">'+ic('info',16)+'<span>Demo data: the profile, meals, workouts and weights shown here are sample values so you can try every feature. Reset them any time from Profile.</span></div>':'')+inner+'</main></div></div>'}
var ph=function(t,sub,right){return '<div class="ph" style="margin-bottom:20px"><div><h1>'+t+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div>'+(right||'')+'</div>'};

function dashView(){
 var p=S.profile,t=targets(p),ms=mealsOn(today()),cons=sum(ms,'kcal'),burn=sum(histOn(today()),'kcal'),wat=waterOn(today()),ws=wSorted(),cur=ws.length?ws[ws.length-1].kg:p.weight;
 var h=new Date().getHours(),gr=h<12?'Good morning':h<17?'Good afternoon':'Good evening';
 var left=t.kcal-cons;
 var wk=weekDates(0),wDone=S.history.filter(function(x){return wk.indexOf(x.date)>-1}).length,wPlan=S.workouts.length;
 var tw=S.workouts.filter(function(w){return w.day===todayIdx()});
 var days=[];for(var i=6;i>=0;i--){var d=daysAgo(i),dt=new Date();dt.setDate(dt.getDate()-i);days.push({l:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dt.getDay()],v:sum(histOn(d),'kcal')})}
 var ws7=ws.some(function(w){return w.date>=daysAgo(6)});
 var tasks=[['Log 3 or more meals',ms.length>=3,ms.length+' logged today'],['Reach your water goal',wat>=S.waterGoal,Math.round(wat/S.waterGoal*100)+'% of goal'],['Complete a workout',histOn(today()).length>0,tw.length?tw.length+' scheduled today':'Rest day or unscheduled'],['Log your weight this week',ws7,ws7?'Logged':'No entry in 7 days']];
 var done=tasks.filter(function(x){return x[1]}).length;
 var stat=function(icn,k,v,sub){return '<div class="card stat"><div class="k">'+ic(icn,16)+k+'</div><div class="v">'+v+'</div><div class="xs mut">'+sub+'</div></div>'};
 return ph(gr+', '+esc(first(p.name)),'Your day at a glance. Goal: '+esc(p.goal)+'.')+
 '<div class="cols" style="margin-bottom:16px">'+
 '<div class="card"><div class="row" style="gap:16px">'+ring(t.kcal?cons/t.kcal:0,104,9,'var(--lime)','<b>'+cons+'</b><span>kcal</span>')+'<div class="stat"><div class="k">Daily calorie target</div><div class="v">'+t.kcal+'</div><div class="xs mut">'+(left>=0?left+' kcal left':(-left)+' kcal over')+'</div></div></div></div>'+
 stat('flame','Calories burned','<span class="lime">'+burn+'</span> <small>kcal</small>','Estimated from completed workouts')+
 stat('drop','Water intake',(wat/1000).toFixed(2)+' <small>/ '+(S.waterGoal/1000).toFixed(1)+' L</small>',Math.round(wat/S.waterGoal*100)+'% of daily goal')+
 stat('scale','Current weight',cur+' <small>kg</small>','Target '+p.target+' kg')+'</div>'+
 '<div class="two" style="margin-bottom:16px"><div class="card"><h3>Weekly activity <span class="sm mut">estimated kcal burned, last 7 days</span></h3>'+barChart(days)+'</div>'+
 '<div class="card"><h3>Macros today</h3><div class="col" style="gap:16px">'+bar('Protein',sum(ms,'p'),t.p,'var(--lime)','g')+bar('Carbs',sum(ms,'c'),t.c,'var(--sky)','g')+bar('Fat',sum(ms,'f'),t.f,'var(--amber)','g')+'</div><p class="xs mut" style="margin-top:14px">Targets are estimates from your profile.</p></div></div>'+
 '<div class="two" style="margin-bottom:16px"><div class="card"><h3>Workout summary <span class="sm mut">'+wDone+' of '+wPlan+' sessions this week</span></h3>'+
 (tw.length?tw.map(function(w){var dn=histOn(today()).some(function(h){return h.wid===w.id});return '<div class="li"><div class="g"><b>'+esc(w.name)+'</b><span>Today, '+w.exercises.length+' exercises</span></div><button class="btn s '+(dn?'on':'pri')+'" data-act="doneW" data-id="'+w.id+'">'+ic('check',14)+(dn?'Done':'Mark done')+'</button></div>'}).join(''):'<div class="empty">'+(S.workouts.length?'No workout scheduled today.':'No workouts yet.')+' <a class="lime" href="#workouts">Open the planner</a></div>')+'</div>'+
 '<div class="card"><h3>Daily progress <span class="sm mut">'+done+' of 4</span></h3><div class="bar" style="margin-bottom:10px"><div class="tr"><div class="f" style="width:'+done*25+'%;background:var(--lime)"></div></div></div>'+tasks.map(function(x){return '<div class="chk'+(x[1]?' d':'')+'"><i>'+ic('check',13)+'</i><div><div>'+x[0]+'</div><div class="xs mut">'+x[2]+'</div></div></div>'}).join('')+'</div></div>'+
 '<div class="cols" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr))">'+
 '<button class="qa" data-act="newMeal" data-type="Breakfast"><span class="ico">'+ic('utensils')+'</span><b>Log a meal</b><span>Add calories and macros</span></button>'+
 '<button class="qa" data-act="water" data-ml="250"><span class="ico">'+ic('drop')+'</span><b>Add 250 ml water</b><span>One tap</span></button>'+
 '<a class="qa" href="#workouts"><span class="ico">'+ic('dumbbell')+'</span><b>Start a workout</b><span>Open the planner</span></a>'+
 '<a class="qa" href="#progress"><span class="ico">'+ic('scale')+'</span><b>Log weight</b><span>Update your trend</span></a>'+
 '<a class="qa" href="#coach"><span class="ico">'+ic('bot')+'</span><b>Ask the coach</b><span>Get advice</span></a></div>'}
