'use strict';
/*
  FITGENIUS AI - public, non-secret settings only.

  NEVER put an Anthropic API key or a Supabase service-role key in this file
  (or anywhere in the browser). Those belong in the backend's .env file.

  MODE
    'demo' : data lives in localStorage and the coach answers from local rules.
    'api'  : the browser talks to Supabase (Auth + Postgres) and to your
             Express backend, which calls the Claude API.
*/
window.FITGENIUS_CONFIG = {
  MODE: 'demo',
  SUPABASE_URL: '',              // e.g. https://your-project.supabase.co
  SUPABASE_PUBLISHABLE_KEY: '',  // the public (publishable/anon) key; safe in the browser only when RLS is on
  API_BASE_URL: ''               // e.g. http://localhost:5000 (your Express backend)
};
