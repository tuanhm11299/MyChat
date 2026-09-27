# apps/api: CLAUDE.md

NestJS 12 API. Read `docs/architecture/backend.md` (source of truth) before non-trivial changes.

## Where things are

- Reference module: `src/modules/identity/`. Copy its patterns.
- Command slice example: `features/register-user/`. Query slice example: `features/get-user-profile/`.
- Base classes: `src/shared/domain/`. Error → HTTP mapping: `src/shared/infrastructure/domain-error.filter.ts`.
- ORM entity list: `src/database/typeorm-options.ts` (`ORM_ENTITIES`). Migrations: `src/database/migrations/`.

## Commands (from repo root)

```sh
pnpm --filter @mychat/api dev          # watch mode, http://localhost:4000, Swagger /docs
pnpm --filter @mychat/api lint         # includes architecture rules
pnpm --filter @mychat/api test         # unit
pnpm --filter @mychat/api test:e2e     # real Postgres (mychat_test)
pnpm --filter @mychat/api migration:generate src/database/migrations/<Name>
pnpm --filter @mychat/api migration:run
```

## Rules

- Slice files: `<name>.command.ts|query.ts`, `.handler.ts`, `.controller.ts`, `.request.dto.ts`, `.handler.spec.ts`.
- Register every controller/handler by hand in `<module>.module.ts`.
- Ports are abstract classes in `domain/`, bound in the module with `{ provide: Port, useClass: Adapter }`.
- Command handler shape: load → domain method → save → `eventBus.publishAll(agg.pullDomainEvents())`.
- Business errors extend `DomainError` with a stable `code` and a `kind`.
- DTOs `implements` the matching type from `@mychat/contracts` when clients use it.
- Unit tests use `testing/` fakes; add a fake method whenever you add a port method.
- Node 24 is required (Nest 12 is ESM; Jest runs with `--experimental-vm-modules`). TypeScript is pinned to ~6.0.

Guides: `docs/guides/backend-add-feature-slice.md`, `backend-add-aggregate.md`, `database-migrations.md`.
