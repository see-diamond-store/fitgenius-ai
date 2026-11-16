'use strict';
/* FITGENIUS AI - authentication adapter (Supabase-ready).

   Today the app signs users in against localStorage (see FORMS.signup / FORMS.login in script.js).
   Only getAccessToken() is used by other code (AIService), so the backend can verify the user.

   To switch to Supabase Auth later:
   1. Add the Supabase client script in index.html before this file:
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   2. Fill SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in config.js and set MODE to 'api'.
   3. Create the client once:
        var supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY);
   4. Replace the demo bodies below with the commented Supabase calls, then call
      AuthService from the signup, login, forgot and logout handlers in script.js. */
var AuthService = (function () {
  var cfg = window.FITGENIUS_CONFIG || {};
  return {
    isLive: function () { return cfg.MODE === 'api' && !!cfg.SUPABASE_URL; },

    /* Supabase: const { data } = await supabase.auth.getSession(); return data.session?.access_token || null; */
    getAccessToken: function () { return Promise.resolve(null); },

    /* Supabase: supabase.auth.signUp({ email, password, options: { data: { full_name } } }) */
    signUp: function () { return Promise.reject(new Error('Demo mode: see FORMS.signup in script.js')); },

    /* Supabase: supabase.auth.signInWithPassword({ email, password }) */
    signIn: function () { return Promise.reject(new Error('Demo mode: see FORMS.login in script.js')); },

    /* Supabase: supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/#login' }) */
    resetPassword: function () { return Promise.reject(new Error('Demo mode: see FORMS.forgot in script.js')); },

    /* Supabase: supabase.auth.signOut() */
    signOut: function () { return Promise.resolve(); }
  };
})();
