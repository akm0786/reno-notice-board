# Reno Notice Board

A notice board with full CRUD, built for the Reno Platforms web-dev assignment.

**Stack:** Next.js 16 (Pages Router) · TypeScript · Prisma · Supabase Postgres · Tailwind CSS · Vercel.

## Live demo

- App: [Reno Notice Board](https://reno-notice-board-pi.vercel.app/)
- Repo: [GitHub Repo](https://github.com/akm0786/reno-notice-board)

## Features
- Create, read, update, delete notices.
- Server-side validation with Zod inside `pages/api/` routes.
- Urgent-first ordering done in the database via Prisma `orderBy`.
- Red "Urgent" badge and left border on urgent cards.
- Delete confirmation modal.
- Responsive card grid (1/2/3 columns).
- Optional image via URL.

## Run locally
1. `git clone <repo> && cd reno-notice-board`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your Postgres URLs:
   - `DATABASE_URL` — Supabase transaction pooler (port 6543, append `?pgbouncer=true&connection_limit=1`)
   - `DIRECT_URL` — Supabase direct connection (port 5432)
4. `npx prisma migrate dev`
5. `npm run dev` → http://localhost:3000

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/notices` | List notices, urgent-first |
| POST | `/api/notices` | Create (201) |
| GET | `/api/notices/[id]` | Fetch one (404 if missing) |
| PUT | `/api/notices/[id]` | Update (400 on invalid input) |
| DELETE | `/api/notices/[id]` | Delete (204) |

## One thing I'd improve with more time
Real image uploads via Supabase Storage (with size/type limits and a signed-URL flow) instead of a plain URL field, plus optimistic UI on create/edit/delete so the list updates without a round-trip.

## AI usage
I used Lovable (Claude) to draft the plan, the Prisma schema, the API route handlers with Zod validation, the React components (list, form, confirm modal) and this README. I reviewed every file, wired up the Supabase URLs, ran the migration, tested CRUD locally, adjusted styling, and deployed manually to Vercel.
