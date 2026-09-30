# Contributing to MyChat

This project is meant to be understood and extended **by people**, with or without AI
assistants. Everything you need is written down in `docs/`.

## 1. Set up

Follow [docs/development.md](docs/development.md). In short: Node 24, pnpm, Docker, then
`pnpm install && pnpm db:up`.

## 2. Learn the codebase (about 30 minutes)

1. [docs/architecture/overview.md](docs/architecture/overview.md): the big picture.
2. [docs/architecture/backend.md](docs/architecture/backend.md): layers, CQRS, slices.
3. Read `apps/api/src/modules/identity/` top to bottom. It's the reference implementation, and the
   comments explain the why.
4. [docs/glossary.md](docs/glossary.md) whenever a term is unclear.

## 3. Find the guide for your task

| Task                       | Guide                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| New API use case           | [backend-add-feature-slice.md](docs/guides/backend-add-feature-slice.md)                                                       |
| New domain concept / table | [backend-add-aggregate.md](docs/guides/backend-add-aggregate.md), [database-migrations.md](docs/guides/database-migrations.md) |
| Realtime event             | [realtime-add-event.md](docs/guides/realtime-add-event.md)                                                                     |
| Web page/feature           | [web-add-feature.md](docs/guides/web-add-feature.md)                                                                           |
| Mobile feature             | [kmp-add-feature.md](docs/guides/kmp-add-feature.md), [kmp-for-beginners.md](docs/guides/kmp-for-beginners.md)                 |
| Something broke            | [troubleshooting.md](docs/guides/troubleshooting.md)                                                                           |

## 4. Workflow

1. Create a branch: `feat/<short-description>`, `fix/…`, `docs/…`, `chore/…`.
2. Make small commits using [Conventional Commits](https://www.conventionalcommits.org/):
   `feat(api): add change-display-name slice`, `fix(web): show API error message`.
   Scopes: `api`, `web`, `mobile`, `contracts`, `docs`, `ci`.
3. Before pushing:

   ```sh
   pnpm lint && pnpm typecheck && pnpm test
   pnpm --filter @mychat/api test:e2e        # if you touched the API
   (cd mobile && ./gradlew :shared:jvmTest)  # if you touched mobile/shared
   ```

4. Open a pull request. CI runs the same checks.

## 5. Code review checklist

- [ ] Business rules live in `domain/`, not in handlers, controllers or UI.
- [ ] Each backend use case is its own slice; no slice imports another.
- [ ] New handlers/controllers are registered in the module file.
- [ ] Schema changes come with a reviewed migration that has a working `down()`.
- [ ] Contract changes are made in TypeScript **and** the Kotlin mirror **and** `docs/api/contracts.md`.
- [ ] Tests describe behaviour ("rejects an email that is already taken") and use fakes, not mocks of internals.
- [ ] Names say what things do in business terms. Comments explain _why_, not _what_.
- [ ] Docs updated if behaviour, commands or structure changed. An important choice gets an ADR.

## 6. Style

- TypeScript: Prettier (`pnpm format`) + ESLint. Strict mode, no `any` without a comment explaining why.
- Kotlin: official Kotlin style (`kotlin.code.style=official`), 4-space indent.
- Swift: Xcode defaults, 4-space indent.
- One class per file; file names in kebab-case (TS) or PascalCase (Kotlin/Swift).
