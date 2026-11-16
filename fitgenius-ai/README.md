# FITGENIUS AI

**Your Personal AI Fitness & Nutrition Advisor.** A dark, glassmorphism fitness dashboard built with plain HTML, CSS and JavaScript. It runs with no build step and stores demo data in your browser's localStorage.

## Run it

1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

Double-clicking `index.html` also works. Click **Explore with demo data** on the landing page to load a sample profile, or create an account (stored only in this browser).

## Features

- Landing page, sign up, log in, forgot password, email-verify step, onboarding
- Dashboard: calorie target, calories burned, macros, water, weight, weekly activity chart, daily progress, quick actions
- AI Coach chat with history, typing indicator and error handling (local demo replies)
- Workout planner: weekly calendar, add / edit / delete workouts, sets, reps, rest, mark complete, history
- Nutrition planner: breakfast, lunch, dinner, snacks, quick-pick foods, add / edit / delete meals
- BMI, BMR, TDEE and goal-calorie calculator with explanations
- Progress tracker: weight chart, goal tracking, weekly and monthly reports, consistency chart
- Water tracker, exercise library (24 exercises), profile and settings

All sample values are labelled **Demo data** in the app.

## Project structure

```
fitgenius-ai/
├─ index.html              page shell, loads the scripts in order
├─ style.css               all styling (design tokens at the top)
├─ script.js               entry point: router, click actions, form handlers
├─ config.js               public settings only (MODE, Supabase URL, API URL)
├─ js/
│  ├─ utils.js             dates, escaping, formatting helpers
│  ├─ icons.js             inline SVG icons
│  ├─ data.js              goals, foods, exercise library
│  ├─ store.js             state, localStorage, calculations, demo data
│  ├─ components.js        toast, modal, form fields, rings, charts
│  ├─ services/
│  │  ├─ auth.service.js   Supabase Auth adapter (stub, see comments)
│  │  └─ ai.service.js     coach service: local replies now, backend later
│  └─ views/               one file per page
├─ database/schema.sql     Supabase tables + Row Level Security
├─ .env.example            backend variables (server-only secrets)
└─ .gitignore
```

The scripts are plain `<script>` tags that share one scope, so the project works from `file://` without a server or bundler. If you move to a bundler such as Vite later, convert each file to an ES module.

## Security

- No API keys are in this project. `config.js` holds only public settings.
- The Anthropic key and the Supabase service-role key must live in the backend `.env` file only. They must never appear in browser code.
- The demo stores passwords in localStorage so login can be tested. Do not use a real password. Supabase Auth replaces this.

## Going from demo to full stack

1. **Database.** Run `database/schema.sql` in the Supabase SQL editor. It extends your existing `user_profiles` table (it does not recreate it) and adds the other tables with Row Level Security.
2. **Auth.** Follow the steps at the top of `js/services/auth.service.js`, set `MODE: 'api'` in `config.js`, and call `AuthService` from the signup, login, forgot-password and logout handlers in `script.js`.
3. **Data.** In `script.js`, replace the `save()` calls and reads of `S.workouts`, `S.meals`, `S.water`, `S.weights` and `S.profile` with Supabase queries (or calls to the Express API). The demo collections map to tables like this:

   | Demo (localStorage)    | Table               |
   | ---------------------- | ------------------- |
   | `S.profile`            | `user_profiles`     |
   | `S.workouts`           | `workouts`, `workout_exercises` |
   | `S.history`            | `workout_logs`      |
   | `S.meals`              | `meals`             |
   | `S.water`              | `water_intake`      |
   | `S.weights`            | `weight_logs`       |
   | `S.profile.goal` etc.  | `fitness_goals`     |
   | `S.chat`               | `ai_chat_history`   |

4. **AI Coach.** Build an Express route `POST /api/coach` that verifies the Supabase access token, calls the Claude API with `ANTHROPIC_API_KEY` from its own `.env`, and returns `{ "reply": "..." }`. Give it a system prompt that keeps advice general, refuses to diagnose medical conditions and avoids extreme diets or exercise. Then set `MODE: 'api'` and `API_BASE_URL` in `config.js`. `js/services/ai.service.js` already sends the request and handles errors.

## Notes

- Calorie, macro and burn figures are estimates (Mifflin-St Jeor equation, activity multipliers and a rough per-set burn). They are general guidance, not medical advice.
- The admin dashboard from the original spec is not included in this version.
