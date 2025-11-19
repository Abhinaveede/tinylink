# TinyLink — URL shortener (Next.js 14 + Postgres)

Demo app for take-home assignment.

## Quick Links (fill after deploy)
- Public URL: https://tinylink-yourname.vercel.app
- Repo: https://github.com/<your-username>/tinylink

## Requirements
- Node 18+
- Postgres (Neon recommended)

## Setup (local)
1. `cp .env.example .env`
2. Set `DATABASE_URL` and `NEXT_PUBLIC_BASE_URL` in `.env`
3. `npm install`
4. Run DB migration (see `migrations/001-init.sql`)
5. `npm run dev`
6. Visit `http://localhost:3000`

## Endpoints
- `POST /api/links` — create link. Body: `{ "url": "...", "code": "optional" }`
- `GET /api/links` — list all links
- `GET /api/links/:code` — get link stats
- `DELETE /api/links/:code` — delete link
- `GET /healthz` — healthcheck
- `GET /:code` — redirect (302) and increments clicks

## DB (SQL)
See `migrations/001-init.sql` — run on your Postgres.

## Deploy (Vercel)
1. Push repo to GitHub.
2. In Vercel, Import Project -> select repo.
3. Set environment variable `DATABASE_URL`.
4. Deploy.

## Notes
- Designed for serverless DB (Neon). Use pooled connections and reuse client across cold starts (see `lib/db.ts`).
