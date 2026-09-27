# CLAUDE.md

Guidance for Claude Code in this repository. **The human docs are the source of truth.** This
file is an index. When a rule here and a doc disagree, the doc wins; fix this file.

## Project

MyChat: chat app. NestJS API (`apps/api`), Next.js web (`apps/web`), Kotlin Multiplatform mobile
(`mobile/`: shared Kotlin + Compose Android + SwiftUI iOS), shared TS contracts
(`packages/contracts`). Overview: `docs/architecture/overview.md`. Roadmap and current phase:
`docs/roadmap.md`.

Per-area instructions: `apps/api/CLAUDE.md`, `apps/web/CLAUDE.md`, `mobile/CLAUDE.md`.

## Commands (repo root, Node 24 + pnpm)

```sh
pnpm install
pnpm build | pnpm lint | pnpm typecheck | pnpm test   # all TS projects via Turborepo
pnpm --filter @mychat/api test:e2e                   # needs PostgreSQL (pnpm db:up)
pnpm --filter @mychat/api migration:run
cd mobile && ./gradlew :shared:jvmTest               # shared KMP tests (any OS)
```

## Non-negotiable rules

1. **Readable by humans first.** Explicit wiring, no clever abstractions, no generic base
   repositories or handlers, no code generators. Follow the existing reference code
   (`apps/api/src/modules/identity/`) instead of inventing new patterns.
2. **Backend layers** (ESLint-enforced): `domain/` has no `@nestjs/*`, `typeorm` or outer-layer
   imports; slices in `features/` never import each other. Details: `docs/architecture/backend.md`.
3. **Commands go through domain aggregates; queries read the DB directly.**
4. **Schema changes only via reviewed TypeORM migrations.** Never enable `synchronize`.
5. **Contracts change in three places together:** `packages/contracts`, the Kotlin mirror in
   `mobile/shared/.../contracts`, and `docs/api/contracts.md`.
6. **Keep docs in sync.** If you change structure, commands or behaviour, update the matching doc in
   `docs/` in the same change. A new significant technical choice gets an ADR in `docs/adr/`.
7. Comments explain _why_. Tests read as behaviour specs and use in-memory fakes (`testing/`), not
   mocking frameworks.
8. Conventional Commits (`feat(api): …`). Run lint + tests before committing.

## Skills (`.claude/skills/`)

Each skill is a checklist that points to the matching guide in `docs/guides/`.

| Skill               | Use when                                             |
| ------------------- | ---------------------------------------------------- |
| `backend-slice`     | Adding an API use case (command or query)            |
| `backend-aggregate` | Adding a domain aggregate + TypeORM persistence      |
| `db-migration`      | Any database schema change                           |
| `realtime-event`    | Adding a WebSocket event end to end                  |
| `web-feature`       | Adding a Next.js feature/page                        |
| `kmp-feature`       | Adding a mobile feature (shared + Compose + SwiftUI) |
| `run-stack`         | Starting the stack locally / smoke-testing a change  |
