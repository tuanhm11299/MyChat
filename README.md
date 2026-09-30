# MyChat

A chat application with a **NestJS** backend, a **Next.js** web app and native **iOS / Android**
apps sharing their logic through **Kotlin Multiplatform**.

| Part      | Tech                                                                    | Folder                                     |
| --------- | ----------------------------------------------------------------------- | ------------------------------------------ |
| API       | NestJS, Clean Architecture, CQRS, vertical slices, PostgreSQL (TypeORM) | [`apps/api`](apps/api)                     |
| Web       | Next.js (App Router), TanStack Query, Tailwind                          | [`apps/web`](apps/web)                     |
| Mobile    | Kotlin Multiplatform shared module, Jetpack Compose, SwiftUI            | [`mobile`](mobile)                         |
| Contracts | Shared TypeScript request/response/event types                          | [`packages/contracts`](packages/contracts) |

## Quickstart

Requires Node.js 24, pnpm 10 (`corepack enable`) and Docker.

```sh
pnpm install
pnpm db:up                                   # PostgreSQL on localhost:5432
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @mychat/api migration:run
pnpm dev                                     # API :4000 (Swagger at /docs), web :3000
```

Open http://localhost:3000/register and create an account.

Mobile: see [docs/development.md](docs/development.md#mobile).

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md): how to work on the project
- [docs/](docs/README.md): architecture, decisions (ADRs), step-by-step guides, roadmap
