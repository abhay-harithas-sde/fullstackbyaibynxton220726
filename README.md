# CareerPilot AI

A full-stack mock-interview coach for students. It uses React/Vite, Express, Supabase Auth/Postgres/RLS/Realtime, and the official Gemini SDK. API keys are server-only.

## Run locally

1. Create a Supabase project and run [`supabase/migrations/202607220001_initial_schema.sql`](supabase/migrations/202607220001_initial_schema.sql) in its SQL Editor (or use `supabase db push`).
2. Copy `frontend/.env.example` to `frontend/.env` and `backend/.env.example` to `backend/.env` and fill in the values. `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` belong only in `backend/.env`.
3. In this folder, run `npm install`, then `npm run dev`.
4. Open `http://localhost:5173`. In Supabase Auth, add that address to the allowed redirect URLs.

## Environment

Frontend requires `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE_URL`. Backend requires `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and optionally `CLIENT_URL` and `PORT`.

## Validate and deploy

Run `npm run typecheck` and `npm run build`. Deploy `frontend` to any static host, deploy `backend` as a Node service, set matching environment variables, update `CLIENT_URL`, and ensure Supabase Auth’s site/redirect URLs include the deployed frontend.

The migration enables RLS and Realtime for sessions. Backend routes verify bearer tokens, validate input, confirm ownership, rate-limit AI endpoints, and do not return model secrets or stack traces.

## Production deployment

Do **not** commit or paste secrets into source files. Set freshly rotated values through your host's secret manager. In production, the API refuses to start if a required secret or `CLIENT_URL` is missing.

1. Run the Supabase migration, enable the required Auth providers, and set the production Site URL and Redirect URLs to your public frontend domain.
2. Configure server secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `CLIENT_URL`, `PORT=5000`, and `NODE_ENV=production`.
3. Build the frontend only with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE_URL=https://api.your-domain.example/api`. Never include the service-role or Gemini key in frontend values.
4. Deploy using the supplied Dockerfiles, or run `docker compose -f docker-compose.production.yml --env-file .env.production up --build -d`. Keep `.env.production` outside source control.
5. Place both services behind HTTPS, then monitor `GET /health`, configure logs/alerts, database backups, and a tagged-image rollback plan.
