'use strict';
/* FITGENIUS AI - AI coach service.

   AIService.ask(text, profile) always returns a Promise<string>.
   - MODE 'demo' (default): answers come from the local rules in js/views/coach.js (coachReply).
   - MODE 'api' with API_BASE_URL set: POST {API_BASE_URL}/api/coach with the user's Supabase
     access token. Your Express backend verifies the token, calls the Claude API using the
     ANTHROPIC_API_KEY from its own .env file, and returns { reply: "..." }.

   The browser never sees an Anthropic key. Only the fields the coach needs are sent. */
var AIService = (function () {
  var cfg = window.FITGENIUS_CONFIG || {};

  function local(text) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        try { resolve(coachReply(text)); } catch (e) { reject(e); }
      }, 900 + Math.random() * 500);
    });
  }

  function remote(text, profile) {
    var url = cfg.API_BASE_URL.replace(/\/$/, '') + '/api/coach';
    var context = profile ? { goal: profile.goal, level: profile.level, diet: profile.diet, activity: profile.activity, age: profile.age, height: profile.height, weight: profile.weight, target: profile.target } : {};
    return AuthService.getAccessToken().then(function (token) {
      var headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = 'Bearer ' + token;
      return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify({ message: text, profile: context }) });
    }).then(function (res) {
      if (!res.ok) throw new Error('Coach request failed (' + res.status + ')');
      return res.json();
    }).then(function (data) {
      if (!data || typeof data.reply !== 'string') throw new Error('Unexpected coach response');
      return data.reply;
    });
  }

  return {
    ask: function (text, profile) {
      return (cfg.MODE === 'api' && cfg.API_BASE_URL) ? remote(text, profile) : local(text);
    }
  };
})();
