---
name: backend-slice
description: Add a new NestJS use case to apps/api as a CQRS vertical slice (command or query) following the identity reference module. Use when asked to add an API endpoint, command, query, or use case.
---

# Add a backend vertical slice

Full human guide (source of truth; read it first):
`docs/guides/backend-add-feature-slice.md`

## Checklist

1. Decide **command** (changes state → through the domain aggregate) or **query** (read-only → reads DB directly).
2. Command: put new business rules as methods on the aggregate in `modules/<m>/domain/` with a unit test.
   If a new port method is needed, implement it in the TypeORM adapter AND the in-memory fake in `testing/`.
3. Create `modules/<m>/features/<verb-noun>/` with the standard files:
   `<name>.command.ts` | `<name>.query.ts`, `<name>.handler.ts`, `<name>.controller.ts`,
   `<name>.request.dto.ts` (if body), `<name>.handler.spec.ts` (commands).
   Mirror `features/register-user/` (command) or `features/get-user-profile/` (query) exactly.
4. Register the controller and handler in `<m>.module.ts` by hand.
5. New business errors: `domain/errors/*.error.ts` extending `DomainError` with `code` + `kind`.
6. Schema change → run the `db-migration` skill.
7. Add an e2e case in `apps/api/test/`.
8. Client-facing? Update `packages/contracts`, the Kotlin mirror, and `docs/api/contracts.md`.
9. Verify: `pnpm --filter @mychat/api lint && pnpm --filter @mychat/api test && pnpm --filter @mychat/api test:e2e`.

## Don'ts

- No imports between slices (ESLint fails). Share via `domain/` or domain events.
- No logic in controllers; no business rules in handlers.
- No generic base handlers/repositories. Keep it explicit and readable.
