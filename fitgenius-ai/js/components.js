'use strict';
/* FITGENIUS AI - reusable UI pieces: toast, modal, form fields, rings, charts */
/* ui helpers */
function toast(m,e){var t=document.createElement('div');t.className='toast'+(e?' e':'');t.textContent=m;$('#toast').appendChild(t);setTimeout(function(){t.remove()},2600)}
function openModal(title,body){$('#modal').innerHTML='<div class="scr2" data-act="closem"></div><div class="dlg" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="dlg-h"><h3>'+esc(title)+'</h3><button class="ib" data-act="closem" aria-label="Close">'+ic('x')+'</button></div>'+body+'</div>';var f=$('#modal input,#modal select');if(f)f.focus()}
function closeModal(){$('#modal').innerHTML=''}
function go(h){if(location.hash==='#'+h)render();else location.hash='#'+h}
var fld=function(l,id,inner){return '<div class="fld"><label for="'+id+'">'+l+'</label>'+inner+'</div>'};
var inp=function(id,name,type,val,extra){return '<input id="'+id+'" name="'+name+'" type="'+type+'" value="'+esc(val==null?'':val)+'" '+(extra||'')+'>'};
var sel=function(id,name,opts,val){return '<select id="'+id+'" name="'+name+'">'+opts.map(function(o){return '<option'+(o===val?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>'};
var bar=function(label,val,max,color,unit){var p=max>0?Math.min(100,val/max*100):0;return '<div class="bar"><div class="t"><span>'+label+'</span><span class="mut">'+Math.round(val)+' / '+Math.round(max)+unit+'</span></div><div class="tr"><div class="f" style="width:'+p+'%;background:'+color+'"></div></div></div>'};
function ring(pct,size,sw,color,inner){var r=(size-sw)/2,c=2*Math.PI*r,p=Math.max(0,Math.min(1,pct)),h=size/2;return '<div class="ring" style="width:'+size+'px;height:'+size+'px"><svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" aria-hidden="true"><circle cx="'+h+'" cy="'+h+'" r="'+r+'" fill="none" stroke="var(--line)" stroke-width="'+sw+'"/>'+(p>0?'<circle cx="'+h+'" cy="'+h+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-dasharray="'+(c*p)+' '+c+'" transform="rotate(-90 '+h+' '+h+')"/>':'')+'</svg><div class="ring-in">'+inner+'</div></div>'}
function lineChart(pts,target){
 if(pts.length<2)return '<div class="empty">Log at least two weigh-ins to see your trend.</div>';
 var W=640,H=250,L=44,R=16,T=16,B=30,vals=pts.map(function(p){return p.v});if(target!=null)vals.push(target);
 var mn=Math.floor(Math.min.apply(null,vals)-1),mx=Math.ceil(Math.max.apply(null,vals)+1),n=pts.length;
 var x=function(i){return L+(W-L-R)*i/(n-1)},y=function(v){return T+(H-T-B)*(1-(v-mn)/(mx-mn))};
 var g='',k;for(k=0;k<=4;k++){var v=mn+(mx-mn)*k/4;g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)"/><text x="'+(L-8)+'" y="'+(y(v)+4)+'" text-anchor="end" font-size="11" fill="var(--mut)">'+r1(v)+'</text>'}
 var path=pts.map(function(p,i){return (i?'L':'M')+x(i)+' '+y(p.v)}).join(' ');
 var area=path+' L'+x(n-1)+' '+(H-B)+' L'+x(0)+' '+(H-B)+' Z';
 var idx=[0,Math.floor((n-1)/3),Math.floor((n-1)*2/3),n-1].filter(function(v,i,a){return a.indexOf(v)===i});
 var xl=idx.map(function(i){return '<text x="'+x(i)+'" y="'+(H-8)+'" text-anchor="'+(i===0?'start':i===n-1?'end':'middle')+'" font-size="11" fill="var(--mut)">'+fmtD(pts[i].d)+'</text>'}).join('');
 var tg=target!=null?'<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(target)+'" y2="'+y(target)+'" stroke="var(--amber)" stroke-dasharray="5 5"/><text x="'+(W-R)+'" y="'+(y(target)-6)+'" text-anchor="end" font-size="11" fill="var(--amber)">Target '+target+' kg</text>':'';
 var last=pts[n-1];
 return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Weight over time"><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6f23a" stop-opacity=".28"/><stop offset="1" stop-color="#b6f23a" stop-opacity="0"/></linearGradient></defs>'+g+tg+'<path d="'+area+'" fill="url(#wg)"/><path d="'+path+'" fill="none" stroke="var(--lime)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="'+x(n-1)+'" cy="'+y(last.v)+'" r="5" fill="var(--lime)" stroke="var(--bg)" stroke-width="2"/>'+xl+'</svg>'}
function barChart(data,fmt){
 fmt=fmt||function(v){return Math.round(v)};
 var W=640,H=230,L=40,R=8,T=20,B=28,n=data.length,mx=Math.max.apply(null,data.map(function(d){return d.v}).concat([10]));
 var step=Math.pow(10,Math.floor(Math.log10(mx))),nm=Math.ceil(mx/step)*step;if(nm/step<2)nm=step*2;
 var bw=(W-L-R)/n,y=function(v){return T+(H-T-B)*(1-v/nm)},g='';
 [0,.5,1].forEach(function(f){var v=nm*f;g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)"/><text x="'+(L-8)+'" y="'+(y(v)+4)+'" text-anchor="end" font-size="11" fill="var(--mut)">'+fmt(v)+'</text>'});
 var bars=data.map(function(d,i){var cx=L+bw*i+bw/2,w=Math.min(34,bw*.55),h=(H-T-B)*d.v/nm,last=i===n-1;
  return '<rect x="'+(cx-w/2)+'" y="'+(H-B-h)+'" width="'+w+'" height="'+Math.max(h,0)+'" rx="5" fill="'+(last?'var(--lime)':'var(--lime-d)')+'" opacity="'+(last?1:.55)+'"/>'+(d.v>0?'<text x="'+cx+'" y="'+(H-B-h-6)+'" text-anchor="middle" font-size="11" fill="var(--fg)">'+fmt(d.v)+'</text>':'')+'<text x="'+cx+'" y="'+(H-8)+'" text-anchor="middle" font-size="11" fill="var(--mut)">'+esc(d.l)+'</text>'}).join('');
 return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Bar chart">'+g+bars+'</svg>'}
