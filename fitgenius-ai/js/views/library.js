'use strict';
/* FITGENIUS AI - exercise library */
/* library */
function libView(){
 var q=ui.q.toLowerCase(),l=LIB.map(function(e,i){return {e:e,i:i}}).filter(function(x){return (ui.cat==='All'||x.e[1]===ui.cat)&&(!q||(x.e[0]+' '+x.e[2]).toLowerCase().indexOf(q)>-1)});
 return ph('Exercise Library','Instructions, muscle groups and difficulty.')+'<div class="row wr sp" style="margin-bottom:16px"><div class="chips">'+CATS.map(function(c){return '<button class="btn s'+(ui.cat===c?' on':'')+'" data-act="setcat" data-v="'+c+'">'+c+'</button>'}).join('')+'</div><div style="position:relative;flex:1;min-width:200px;max-width:320px"><input id="lq" type="search" placeholder="Search exercises or muscles" value="'+esc(ui.q)+'" aria-label="Search exercises" data-search="1"></div></div><div class="cols" id="libgrid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr))">'+libCards(l)+'</div>'}
function libCards(l){return l.length?l.map(function(x){var e=x.e;return '<button class="exc" data-act="exinfo" data-i="'+x.i+'"><div class="row sp"><span class="pill">'+e[1]+'</span><span class="pill '+(e[3]==='Beginner'?'l':e[3]==='Advanced'?'a':'')+'">'+e[3]+'</span></div><b>'+esc(e[0])+'</b><span class="xs mut">'+esc(e[2])+'</span></button>'}).join(''):'<div class="empty" style="grid-column:1/-1">No exercises match your search.</div>'}
