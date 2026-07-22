# CareerPilot AI

CareerPilot AI is a full-stack mock interview coach for students and early-career developers. It uses React, Express, Supabase, and the official Gemini SDK to generate interview questions, evaluate answers, store progress, and produce a seven-day study plan.

## What It Includes

- Landing page with product overview and sign-in entry points
- Student registration, login, and logout
- Protected dashboard
- Onboarding and profile setup
- Interview setup and live interview flow
- Gemini-generated interview questions
- Gemini answer evaluation with score and feedback
- Interview history and final report
- Seven-day AI study plan
- Supabase Auth, PostgreSQL, Row Level Security, and Realtime updates
- Zod validation and safe error handling
- Responsive UI for desktop and mobile

## Tech Stack

- Frontend: React, React Router, React Hook Form, Zod, Vite, TypeScript
- Backend: Node.js, Express, TypeScript, Zod, `@google/genai`, `@supabase/supabase-js`
- Database and auth: Supabase Auth, PostgreSQL, Row Level Security, Supabase Realtime
- Security and middleware: `helmet`, `cors`, `express-rate-limit`

## Repository Layout

```text
.
├── backend/
│   ├── src/server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── supabase/
│   └── migrations/202607220001_initial_schema.sql
├── docker-compose.production.yml
└── package.json
```

## Quick Start

### 1. Prerequisites

- Node.js 20 or later
- A Supabase project
- A Gemini API key

### 2. Create the Supabase schema

Run the migration in [supabase/migrations/202607220001_initial_schema.sql](supabase/migrations/202607220001_initial_schema.sql) in the Supabase SQL editor, or apply it with the Supabase CLI if you use that workflow.

The migration creates:

- `profiles`
- `interview_sessions`
- `interview_questions`
- `interview_answers`
- `study_plans`
- `progress`

It also enables Row Level Security and adds `interview_sessions` to the `supabase_realtime` publication.

### 3. Configure environment variables

Copy the example files:

- `frontend/.env.example` to `frontend/.env`
- `backend/.env.example` to `backend/.env`

Frontend environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL` defaulting to `http://localhost:5000/api`

Backend environment variables:

- `PORT` defaulting to `5000`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `CLIENT_URL` defaulting to `http://localhost:5173`

Do not put `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in frontend files.

### 4. Install dependencies

From the repository root:

```bash
npm install
```

### 5. Start the app

```bash
npm run dev
```

This runs the frontend and backend together in development:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### 6. Configure Supabase Auth URLs

Add your local frontend URL to the Supabase Auth allowlist:

- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173`

For production, replace those with your deployed frontend domain.

## Available Scripts

Run these from the repository root:

- `npm run dev` - start frontend and backend in development
- `npm run build` - build frontend and backend
- `npm run typecheck` - run TypeScript checks for both workspaces

Frontend workspace:

- `npm run dev -w frontend`
- `npm run build -w frontend`
- `npm run typecheck -w frontend`

Backend workspace:

- `npm run dev -w backend`
- `npm run build -w backend`
- `npm run typecheck -w backend`
- `npm run start -w backend`

## Application Routes

- `/` - landing page
- `/register` - student registration
- `/login` - student login
- `/onboarding` - profile setup
- `/dashboard` - protected dashboard
- `/interview/new` - create a mock interview
- `/interview/:id` - live interview session
- `/interview/:id/result` - final interview report
- `/history` - interview history
- `/study-plan` - seven-day study plan
- `/profile` - profile editor

## Backend API

All protected routes expect a bearer token in the `Authorization` header.

- `GET /health` - health check
- `GET /api/profile` - fetch the signed-in student profile
- `PUT /api/profile` - update the signed-in student profile
- `GET /api/dashboard` - dashboard metrics and recent sessions
- `GET /api/interviews` - list interviews for the current user
- `POST /api/interviews/start` - create a new interview session and generate the first question
- `GET /api/interviews/:id` - fetch the current interview session and active question
- `POST /api/interviews/:id/answer` - submit an answer and receive Gemini evaluation
- `POST /api/interviews/:id/question` - generate the next question or complete the interview
- `POST /api/interviews/:id/complete` - finalize the report
- `POST /api/study-plans` - generate a seven-day study plan
- `GET /api/study-plans` - list study plans
- `GET /api/study-plans/:id` - fetch a single study plan
- `GET /api/progress` - topic-level progress data

## Database Behavior

The schema is designed so each user only sees their own data.

Key tables:

- `profiles` stores student onboarding details
- `interview_sessions` stores interview runs and final summaries
- `interview_questions` stores generated questions and hidden answer points
- `interview_answers` stores submitted answers and Gemini feedback
- `study_plans` stores generated seven-day plans
- `progress` stores topic-level practice history

Security rules:

- Row Level Security is enabled on every table
- Each table uses ownership-based policies keyed by `auth.uid()`
- The backend uses the Supabase service role key only on the server

Realtime:

- `interview_sessions` is published to Supabase Realtime so the UI can react to processing status changes

## Validation And Safety

The backend validates request bodies with Zod and returns friendly error messages for invalid input.

The server also:

- checks authentication on protected routes
- confirms record ownership before returning interview data
- rate limits AI-heavy endpoints
- hides internal stack traces from API responses
- refuses to start in production when required secrets are missing

## Production Deployment

1. Create production Supabase Auth and database settings.
2. Run the migration in the production Supabase project.
3. Set backend secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `CLIENT_URL`
   - `PORT=5000`
   - `NODE_ENV=production`
4. Set frontend variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL=https://your-api-domain.example/api`
5. Deploy the frontend to a static host and the backend to a Node runtime.
6. Update Supabase Auth Site URL and Redirect URLs to your production frontend domain.
7. Put both services behind HTTPS.

You can also use Docker:

```bash
docker compose -f docker-compose.production.yml --env-file .env.production up --build -d
```

Keep `.env.production` out of source control.

## Troubleshooting

- If sign-in redirects fail, check the Supabase Auth Site URL and Redirect URLs.
- If the backend returns 401, confirm the frontend is sending the Supabase access token.
- If AI calls fail, confirm `GEMINI_API_KEY` is set on the backend.
- If the backend refuses to start in production, verify all required environment variables are present.
- If Realtime updates do not appear, confirm the Supabase project has the `interview_sessions` table in the `supabase_realtime` publication.

## Notes For Workshop Use

- The app is designed for beginner-friendly interview practice.
- Keep secrets only in environment variables or secret managers.
- The backend should remain the only place where the Gemini API key and Supabase service role key are used.