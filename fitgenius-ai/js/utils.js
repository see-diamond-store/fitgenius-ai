'use strict';
/* FITGENIUS AI - shared helpers (dates, escaping, formatting) */
var KEY='fitgenius-ai-demo-v1';
var $=function(s,el){return (el||document).querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var pad=function(n){return String(n).padStart(2,'0')};
var dstr=function(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
var today=function(){return dstr(new Date())};
var daysAgo=function(n){var d=new Date();d.setDate(d.getDate()-n);return dstr(d)};
var uid=function(){return Math.random().toString(36).slice(2,9)};
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
var fmtD=function(s){var p=s.split('-');return (+p[2])+' '+MON[+p[1]-1]};
var todayIdx=function(){return (new Date().getDay()+6)%7};
var sum=function(a,k){return a.reduce(function(t,x){return t+(+x[k]||0)},0)};
var r1=function(n){return Math.round(n*10)/10};
var first=function(n){return String(n||'').split(' ')[0]||'there'};
