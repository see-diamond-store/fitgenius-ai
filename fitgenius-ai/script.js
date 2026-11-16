'use strict';
/* FITGENIUS AI - entry point: router, click actions, form handlers, events */
/* router */
var VIEWS={dashboard:dashView,coach:coachView,workouts:workoutsView,diet:dietView,calc:calcView,progress:progressView,water:waterView,library:libView,profile:profileView};
function render(){
 var r=(location.hash||'#home').slice(1).split('?')[0]||'home',app=$('#app');closeModal();
 if(['features','how','reviews'].indexOf(r)>-1){r='home'}
 var isApp=!!VIEWS[r];
 if(isApp&&!S.session){location.hash='#login';return}
 if(isApp&&!S.profile){location.hash='#onboarding';return}
 if(r==='onboarding'){if(!S.session){location.hash='#login';return}if(S.profile){location.hash='#dashboard';return}app.innerHTML=onboardView();return}
 if(r==='verify'){if(!S.account||S.session){location.hash=S.session?'#dashboard':'#signup';return}app.innerHTML=verifyView();return}
 if(r==='login'||r==='signup'){if(S.session){location.hash='#dashboard';return}if(r==='signup')ui.auth='signup';else if(ui.auth==='signup')ui.auth='login';app.innerHTML=authView();return}
 if(isApp){app.innerHTML=shell(r,VIEWS[r]());if(r==='coach'){var l=$('#log');if(l)l.scrollTop=l.scrollHeight}return}
 app.innerHTML=landing();
}
window.addEventListener('hashchange',function(){ui.auth='login';ui.resetArmed=false;var h=(location.hash||'').slice(1);if(['features','how','reviews'].indexOf(h)>-1){render();var el=document.getElementById(h);if(el)el.scrollIntoView();return}window.scrollTo(0,0);render()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});

/* actions */
function logoutNow(){S.session=false;save();location.hash='#home';render()}
function addWater(ml){var t=today();(S.water[t]=S.water[t]||[]).push(ml);save();render();toast('Added '+ml+' ml')}
var ACTS={
 demo:function(){seedDemo();ui.auth='login';location.hash='#dashboard';render();toast('Demo data loaded')},
 logout:logoutNow,
 closem:closeModal,
 nav:function(){var s=$('#shell');if(s)s.classList.toggle('open')},
 setmode:function(d){ui.auth=d.v;render()},
 verify:function(){S.session=true;save();location.hash='#onboarding';render()},
 newW:function(){workoutModal()},editW:function(d){workoutModal(d.id)},
 delW:function(d){S.workouts=S.workouts.filter(function(w){return w.id!==d.id});save();render();toast('Workout deleted')},
 doneW:function(d){var w=S.workouts.filter(function(x){return x.id===d.id})[0];if(!w)return;var h=histOn(today()).filter(function(x){return x.wid===w.id})[0];if(h){S.history=S.history.filter(function(x){return x.id!==h.id});toast('Marked as not done')}else{S.history.push({id:uid(),wid:w.id,name:w.name,date:today(),kcal:estKcal(w)});toast('Workout completed')}save();render()},
 delhist:function(d){S.history=S.history.filter(function(h){return h.id!==d.id});save();render();toast('History entry removed')},
 addrow:function(){var c=$('#exrows');if(c){c.insertAdjacentHTML('beforeend',exRow())}},
 delrow:function(d,b){var c=$('#exrows');if(c&&c.children.length>1)b.closest('.exrow').remove();else toast('Keep at least one exercise',1)},
 newMeal:function(d){mealModal(null,d.type)},editMeal:function(d){mealModal(d.id)},
 delMeal:function(d){S.meals=S.meals.filter(function(m){return m.id!==d.id});save();render();toast('Meal deleted')},
 water:function(d){addWater(+d.ml)},
 waterundo:function(){var t=today(),a=S.water[t]||[];if(!a.length){toast('Nothing to undo',1);return}a.pop();save();render();toast('Last entry removed')},
 delweight:function(d){S.weights=S.weights.filter(function(w){return w.id!==d.id});syncWeight();save();render();toast('Entry deleted')},
 range:function(d){ui.range=+d.v;render()},
 setcat:function(d){ui.cat=d.v;render()},
 exinfo:function(d){var e=LIB[+d.i];openModal(e[0],'<div class="row wr" style="margin-bottom:14px"><span class="pill">'+e[1]+'</span><span class="pill l">'+e[3]+'</span><span class="pill">'+esc(e[2])+'</span></div><h4 style="margin-bottom:8px">How to do it</h4><ol style="margin:0;padding-left:20px;display:grid;gap:8px" class="mut">'+e[4].split('|').map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ol><p class="xs mut" style="margin-top:16px">Start light and keep good form. Stop if you feel sharp pain.</p>')},
 clearchat:function(){S.chat=[];save();render();toast('Chat history cleared')},
 ask:function(d){var i=$('#chat-in');if(i){i.value=d.q;sendChat(d.q)}},
 resetdata:function(){if(!ui.resetArmed){ui.resetArmed=true;render();return}ui.resetArmed=false;seedDemo();render();toast('Demo data reset')}
};
document.addEventListener('click',function(e){var b=e.target.closest('[data-act]');if(!b)return;var f=ACTS[b.dataset.act];if(f){if(b.tagName==='A')e.preventDefault();f(b.dataset,b,e)}});
function syncWeight(){var w=wSorted();if(w.length&&S.profile)S.profile.weight=w[w.length-1].kg}
function sendChat(text){
 text=String(text||'').trim();if(!text||ui.busy)return;ui.busy=true;
 var tm=function(){var d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())};
 S.chat.push({role:'user',text:text,t:tm()});save();
 var log=$('#log');log.innerHTML=chatLog()+'<div class="msg a" id="typing" aria-label="Coach is typing"><span class="dots"><i></i><i></i><i></i></span></div>';log.scrollTop=log.scrollHeight;
 var box=$('#chat-in');if(box)box.value='';
 /* AIService decides: local demo replies now, your Express backend (Claude API) later. */
 AIService.ask(text,S.profile)
  .then(function(reply){S.chat.push({role:'assistant',text:reply,t:tm()})})
  .catch(function(){S.chat.push({role:'assistant',err:1,text:'Something went wrong while contacting the coach. Please try again.',t:tm()})})
  .then(function(){ui.busy=false;save();var l=$('#log');if(l){l.innerHTML=chatLog();l.scrollTop=l.scrollHeight}});
}
var EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function readProfile(fd){var g=function(k){return String(fd.get(k)||'').trim()},n=function(k){return parseFloat(g(k))};
 var o={name:g('name'),age:n('age'),gender:g('gender'),height:n('height'),weight:n('weight'),target:n('target'),goal:g('goal'),level:g('level'),diet:g('diet'),activity:g('activity')};
 if(o.name.length<2)return {err:'Enter your full name.'};
 if(!(o.age>=14&&o.age<=90))return {err:'Age must be between 14 and 90.'};
 if(!(o.height>=120&&o.height<=230))return {err:'Height must be between 120 and 230 cm.'};
 if(!(o.weight>=30&&o.weight<=300))return {err:'Current weight must be between 30 and 300 kg.'};
 if(!(o.target>=30&&o.target<=300))return {err:'Target weight must be between 30 and 300 kg.'};
 return {ok:o}}
var FORMS={
 signup:function(f,fd,er){var n=String(fd.get('name')).trim(),e=String(fd.get('email')).trim().toLowerCase(),p=String(fd.get('pw')),c=String(fd.get('pw2'));
  if(n.length<2)return er('Enter your full name.');if(!EMAIL.test(e))return er('Enter a valid email address.');if(p.length<8)return er('Password must be at least 8 characters.');if(p!==c)return er('Passwords do not match.');
  S=blank();S.account={name:n,email:e,password:p};save();location.hash='#verify';render()},
 login:function(f,fd,er){var e=String(fd.get('email')).trim().toLowerCase(),p=String(fd.get('pw'));
  if(!EMAIL.test(e))return er('Enter a valid email address.');if(!p)return er('Enter your password.');
  if(!S.account||S.account.email!==e||S.account.password!==p)return er('No matching account on this device. Check your details, create an account, or use the demo.');
  S.session=true;save();location.hash=S.profile?'#dashboard':'#onboarding';render()},
 forgot:function(f,fd,er){var e=String(fd.get('email')).trim();if(!EMAIL.test(e))return er('Enter a valid email address.');f.querySelector('.form-err').innerHTML='<span class="ok">If an account exists for that email, a reset link is on its way. (Demo: no email is sent.)</span>'},
 onboard:function(f,fd,er){var r=readProfile(fd);if(r.err)return er(r.err);S.profile=r.ok;S.weights=[{id:uid(),date:today(),kg:r.ok.weight}];save();location.hash='#dashboard';render();toast('Welcome to FITGENIUS AI')},
 profile:function(f,fd,er){var r=readProfile(fd);if(r.err)return er(r.err);S.profile=r.ok;if(S.account)S.account.name=r.ok.name;save();render();toast('Profile updated')},
 workout:function(f,fd,er){var name=String(fd.get('name')).trim();if(name.length<2)return er('Give the workout a name.');
  var ex=fd.getAll('ex'),sets=fd.getAll('sets'),reps=fd.getAll('reps'),rest=fd.getAll('rest'),list=[];
  for(var i=0;i<ex.length;i++){var s=parseInt(sets[i],10),rs=parseInt(rest[i],10),rp=String(reps[i]).trim();if(!(s>=1&&s<=10)||!rp||!(rs>=0&&rs<=600))return er('Check sets (1 to 10), reps and rest for exercise '+(i+1)+'.');list.push({name:ex[i],sets:s,reps:rp,rest:rs})}
  if(!list.length)return er('Add at least one exercise.');
  var id=f.dataset.id,w={id:id||uid(),name:name,day:+fd.get('day'),exercises:list};
  if(id)S.workouts=S.workouts.map(function(x){return x.id===id?w:x});else S.workouts.push(w);
  save();render();toast(id?'Workout updated':'Workout added')},
 meal:function(f,fd,er){var name=String(fd.get('name')).trim(),k=parseFloat(fd.get('kcal')),p=parseFloat(fd.get('p'))||0,c=parseFloat(fd.get('c'))||0,fa=parseFloat(fd.get('f'))||0;
  if(!name)return er('Enter a food name.');if(!(k>=0&&k<=3000))return er('Calories must be between 0 and 3000.');if(p<0||c<0||fa<0)return er('Macros cannot be negative.');
  var id=f.dataset.id,m={id:id||uid(),date:today(),type:String(fd.get('type')),name:name,kcal:Math.round(k),p:r1(p),c:r1(c),f:r1(fa)};
  if(id){var old=S.meals.filter(function(x){return x.id===id})[0];m.date=old?old.date:m.date;S.meals=S.meals.map(function(x){return x.id===id?m:x})}else S.meals.push(m);
  save();render();toast(id?'Meal updated':'Meal added')},
 weight:function(f,fd,er){var kg=parseFloat(fd.get('kg')),d=String(fd.get('date'));if(!(kg>=30&&kg<=300))return er('Weight must be between 30 and 300 kg.');if(!d||d>today())return er('Choose a date that is not in the future.');
  S.weights=S.weights.filter(function(w){return w.date!==d});S.weights.push({id:uid(),date:d,kg:r1(kg)});syncWeight();save();render();toast('Weight saved')},
 waterc:function(f,fd,er){var ml=parseInt(fd.get('ml'),10);if(!(ml>=1&&ml<=3000))return toast('Enter 1 to 3000 ml',1);addWater(ml)},
 watergoal:function(f,fd,er){var g=parseInt(fd.get('goal'),10);if(!(g>=500&&g<=8000))return er('Goal must be between 500 and 8000 ml.');S.waterGoal=g;save();render();toast('Water goal updated')},
 chat:function(f,fd){sendChat(fd.get('q'))},
 calc:function(){}
};
document.addEventListener('submit',function(e){var f=e.target;if(!f.dataset||!f.dataset.form)return;e.preventDefault();var h=FORMS[f.dataset.form];if(!h)return;var er=function(m){var x=f.querySelector('.form-err');if(x)x.textContent=m;else toast(m,1)};var x=f.querySelector('.form-err');if(x)x.textContent='';h(f,new FormData(f),er)});
document.addEventListener('input',function(e){var f=e.target.closest&&e.target.closest('form[data-live="calc"]');if(f){var v=readCalc(f);if(v.a>=14&&v.h>=100&&v.w>=20){$('#calc-out').innerHTML=calcResult(v)}return}
 if(e.target.dataset&&e.target.dataset.search){ui.q=e.target.value;var q=ui.q.toLowerCase(),l=LIB.map(function(x,i){return {e:x,i:i}}).filter(function(x){return (ui.cat==='All'||x.e[1]===ui.cat)&&(!q||(x.e[0]+' '+x.e[2]).toLowerCase().indexOf(q)>-1)});$('#libgrid').innerHTML=libCards(l)}});
document.addEventListener('change',function(e){var t=e.target;if(t.dataset&&t.dataset.quick&&t.value!==''){var f=FOODS[+t.value],form=t.closest('form');form.elements.name.value=f[0]+' ('+f[1]+')';form.elements.kcal.value=f[2];form.elements.p.value=f[3];form.elements.c.value=f[4];form.elements.f.value=f[5]}});

render();

render();
const SUPABASE_KEY = "sb_publishable_pDlzpospEAu9aMxmL50aZg_dmssapOF";
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
console.log("Supabase Connected Successfully!");
console.log("FITGENIUS TEST");
async function testSupabaseConnection() {
  const { data, error } = await supabaseClient
    .from("user_profiles")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Supabase Error:", error.message);
  } else {
    console.log("Supabase Database Connected!");
  }
}

testSupabaseConnection();