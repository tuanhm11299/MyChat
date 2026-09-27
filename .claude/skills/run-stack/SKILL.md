---
name: run-stack
description: Start MyChat locally (PostgreSQL, API, web) and smoke-test it, including checking a page in a browser. Use when asked to run the app or to verify a change end to end.
---

# Run and smoke-test the stack

Human doc (source of truth): `docs/development.md`

## Steps

1. Node 24 (`node -v`), then `pnpm install`.
2. PostgreSQL: `pnpm db:up`. If Docker is unavailable, use a local PostgreSQL 16 and create role/db
   `mychat`/`mychat` plus database `mychat_test` (see `docker/postgres/init.sql`).
3. Env files: `apps/api/.env` from `.env.example`, `apps/web/.env.local` from `.env.example`.
4. `pnpm --filter @mychat/api migration:run`
5. Start in the background: `pnpm --filter @mychat/api dev` (port 4000) and `pnpm --filter @mychat/web dev` (port 3000).
6. Smoke test:
   - `curl -s localhost:4000/health` → `{"status":"ok","database":"up"}`
   - `curl -s -X POST localhost:4000/auth/register -H 'content-type: application/json' -d '{"email":"a@example.com","displayName":"A","password":"password-1"}'` → `{"id":…}`
   - `http://localhost:3000/register` in a browser (Playwright/Chromium) → submit the form → success message.
7. Stop the servers when done.
