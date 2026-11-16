'use strict';
/* FITGENIUS AI - profile and settings */
/* profile */
function profileView(){
 return ph('Profile and Settings','Edit your details and goals.')+'<div class="two"><div class="card"><h3>Personal information and goals</h3><form data-form="profile" novalidate>'+profileFields(S.profile,'pf')+'<div class="err form-err" role="alert" style="margin-top:10px"></div><button class="btn pri" type="submit">Save changes</button></form></div><div class="col"><div class="card"><h3>Account</h3><p class="sm mut">Signed in as</p><p style="overflow-wrap:anywhere">'+esc(S.account?S.account.email:'')+'</p><button class="btn" style="margin-top:14px" data-act="logout">'+ic('logout',16)+'Log out</button></div><div class="card"><h3>Your data</h3><p class="sm mut">Everything is stored in this browser only.</p><button class="btn dng" style="margin-top:14px" data-act="resetdata">'+(ui.resetArmed?'Click again to confirm reset':'Reset to fresh demo data')+'</button></div></div></div>'}
