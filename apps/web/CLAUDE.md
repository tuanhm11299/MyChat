# apps/web: CLAUDE.md

Next.js 16 (App Router), React 19, TanStack Query, Tailwind 4. Source of truth:
`docs/architecture/web.md`.

## Structure

- `src/app/`: routes only; pages are thin and compose feature components.
- `src/features/<feature>/{api,hooks,components}`: feature code. Reference: `features/identity/`.
- `src/lib/api-client.ts`: the only place that calls `fetch`.

## Rules

- API types come from `@mychat/contracts`; never redeclare them. Add missing ones there first.
- Features must not import other features (ESLint-enforced). Shared code → `src/lib` or `src/components`.
- Server state via React Query hooks; `useState` only for UI state.
- `'use client'` only on components that need state/effects/handlers.

## Commands

```sh
pnpm --filter @mychat/web dev        # http://localhost:3000 (needs API on :4000)
pnpm --filter @mychat/web lint
pnpm --filter @mychat/web typecheck
pnpm --filter @mychat/web build
```

Guide: `docs/guides/web-add-feature.md`.
