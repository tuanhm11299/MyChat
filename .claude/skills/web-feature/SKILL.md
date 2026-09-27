---
name: web-feature
description: Add a feature or page to the Next.js web app (apps/web) with a typed API function, React Query hook and components. Use when building web UI.
---

# Add a web feature

Architecture (source of truth): `docs/architecture/web.md`
Guide: `docs/guides/web-add-feature.md`
Reference: `apps/web/src/features/identity/`

## Checklist

1. Types exist in `packages/contracts` (add + `pnpm --filter @mychat/contracts build` if not).
2. `src/features/<f>/api/<verb-noun>.ts`: one function per endpoint using `apiRequest` from `@/lib/api-client`.
3. `src/features/<f>/hooks/use-<...>.ts`: `useQuery` / `useMutation`; query keys start with the resource.
4. `src/features/<f>/components/*.tsx`: handle pending / error / success explicitly.
5. `src/app/<route>/page.tsx`: thin, composes feature components.
6. Verify: `pnpm --filter @mychat/web lint && pnpm --filter @mychat/web typecheck && pnpm --filter @mychat/web build`.
   Use the `run-stack` skill to check it in a browser.

## Don'ts

- No `fetch` outside `lib/api-client.ts`; no cross-feature imports; no redeclared API types.
