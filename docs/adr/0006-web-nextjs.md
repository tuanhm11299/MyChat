# 0006 — Web: Next.js App Router

Status: Accepted

## Decision

- **Next.js (App Router)** with TypeScript, **Tailwind CSS** for styling, **TanStack Query** for
  server state.
- Code is organised by feature (`src/features/<feature>/{api,hooks,components}`); routes in
  `src/app/` stay thin.
- API types come from `@mychat/contracts`.

## Why not a plain React SPA (Vite)?

Next.js gives routing, code splitting, server-rendered public pages (landing, sign-up) and a
production server with no extra setup. The chat screens themselves are client components, so
nothing is lost versus an SPA.
