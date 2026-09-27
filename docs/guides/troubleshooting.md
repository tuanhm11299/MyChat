# Troubleshooting

## Backend

| Symptom                                                       | Cause / fix                                                                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL is required` on start                           | Copy `apps/api/.env.example` to `apps/api/.env`.                                                                                |
| `ECONNREFUSED 127.0.0.1:5432`                                 | PostgreSQL isn't running: `pnpm db:up` (or start your local server).                                                            |
| `relation "users" does not exist`                             | Migrations not applied: `pnpm --filter @mychat/api migration:run`.                                                              |
| `The command handler for the XCommand command was not found!` | Handler not listed in `providers` of the module file.                                                                           |
| New endpoint returns 404                                      | Controller not listed in `controllers` of the module file, or the module isn't in `app.module.ts`.                              |
| `Nest can't resolve dependencies of XHandler (?)`             | A port has no binding: add `{ provide: Port, useClass: Adapter }` to the module, or import the module that provides it.         |
| `Must use import to load ES Module` in Jest                   | You are on Node < 24.9, or ran `jest` without `--experimental-vm-modules`. Use Node 24 (`nvm use`) and the `pnpm test` scripts. |
| ESLint: `import is restricted … domain layer`                 | The domain imported a framework or outer layer. Move that code to `infrastructure/` and depend on a port.                       |
| ESLint: `A slice must not import another slice`               | Move the shared logic into `domain/`, or react to a domain event.                                                               |
| e2e: `database "mychat_test" does not exist`                  | Create it: see [development.md](../development.md#e2e-test-database).                                                           |
| Changes in `packages/contracts` not visible                   | Rebuild it: `pnpm --filter @mychat/contracts build` (or run `pnpm dev`, which does it).                                         |

## Web

| Symptom                           | Cause / fix                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| `Failed to fetch` on submit       | API not running, or `NEXT_PUBLIC_API_URL` wrong in `apps/web/.env.local`.                 |
| CORS error in the browser console | `WEB_ORIGIN` in `apps/api/.env` must equal the web URL (default `http://localhost:3000`). |

## Mobile

| Symptom                                                | Cause / fix                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `SDK location not found`                               | Open `mobile/` once in Android Studio (creates `local.properties`), or set `ANDROID_HOME`.                                |
| Android app says offline                               | The emulator reaches your computer via `10.0.2.2`, not `localhost`; also check the API is running.                        |
| iOS: `No such module 'Shared'`                         | Build once from Xcode (the pre-build script produces the framework); make sure `xcodegen generate` was run after pulling. |
| iOS: `Transport security has blocked a cleartext HTTP` | `NSAllowsLocalNetworking` in `project.yml` covers `localhost` only; use HTTPS for other hosts.                            |
