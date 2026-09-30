# Development guide

## Prerequisites

| Tool                | Version                | Used for                                             |
| ------------------- | ---------------------- | ---------------------------------------------------- |
| Node.js             | 24 LTS (`.nvmrc`)      | API, web, contracts                                  |
| pnpm                | 10 (`corepack enable`) | TypeScript workspaces                                |
| Docker              | any recent             | Local PostgreSQL (or install PostgreSQL 16 yourself) |
| JDK                 | 17+                    | Mobile (Gradle)                                      |
| Android Studio      | latest                 | Android app                                          |
| Xcode 16 + XcodeGen | macOS only             | iOS app                                              |

## First-time setup

```sh
corepack enable                 # makes the pinned pnpm available
pnpm install                    # installs every TypeScript project
pnpm db:up                      # starts PostgreSQL in Docker (docker-compose.yml)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @mychat/api migration:run   # creates the tables
```

## Everyday commands (from the repository root)

| Command                              | What it does                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| `pnpm dev`                           | Runs API (http://localhost:4000) and web (http://localhost:3000) with hot reload |
| `pnpm build`                         | Builds everything                                                                |
| `pnpm lint`                          | ESLint, including the architecture rules                                         |
| `pnpm typecheck`                     | TypeScript checks                                                                |
| `pnpm test`                          | Unit tests                                                                       |
| `pnpm format`                        | Prettier                                                                         |
| `pnpm --filter @mychat/api test:e2e` | API end-to-end tests (needs PostgreSQL, uses the `mychat_test` database)         |

Use `--filter <package>` to target one project, e.g. `pnpm --filter @mychat/web dev`.

## API

- Swagger UI: http://localhost:4000/docs
- Health check: http://localhost:4000/health
- Environment variables: `apps/api/.env.example`
- Migrations: [guides/database-migrations.md](guides/database-migrations.md)

### E2E test database

E2E tests use `TEST_DATABASE_URL`, defaulting to
`postgres://mychat:mychat@localhost:5432/mychat_test`. Docker creates it automatically
(`docker/postgres/init.sql`). If you use your own PostgreSQL, create it once:

```sh
createdb -U mychat mychat_test
```

The tests run migrations automatically and truncate tables between tests.

## Mobile

```sh
cd mobile
./gradlew :shared:jvmTest              # shared tests, any OS
./gradlew :androidApp:assembleDebug    # Android APK (needs Android SDK)
```

Or open `mobile/` in Android Studio and run `androidApp`. For iOS see `mobile/iosApp/README.md`.

The Android emulator reaches your computer's API at `http://10.0.2.2:4000`; the iOS simulator at
`http://localhost:4000`.

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request:

1. **typescript**: install, lint, typecheck, unit tests, build, API e2e tests against a PostgreSQL service.
2. **mobile**: `:shared:jvmTest` and `:androidApp:assembleDebug`.
