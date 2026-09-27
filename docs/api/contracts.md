# API contracts

The single human-readable list of endpoints and events.

- TypeScript source of truth: `packages/contracts/src/` (imported by the API DTOs and the web app).
- Kotlin mirror: `mobile/shared/src/commonMain/kotlin/com/mychat/shared/contracts/`.
- Interactive REST docs: http://localhost:4000/docs (Swagger, generated from the controllers).

**When you change a contract:** update the TypeScript file, the Kotlin mirror, and this table
in the same pull request.

## Errors

Every error response has the same body (`ApiErrorResponse`):

```json
{
  "statusCode": 409,
  "code": "identity.email_already_taken",
  "message": "An account with email \"a@b.c\" already exists."
}
```

`code` is stable and meant for programs. `message` is for humans and may change. Request-body
validation errors (400) come from Nest's ValidationPipe and have `message` as a list of strings.

## REST endpoints

| Method | Path             | Request                                                | Response                                                    | Errors                                             | TS contract                 | Kotlin mirror                                 |
| ------ | ---------------- | ------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------- | --------------------------- | --------------------------------------------- |
| GET    | `/health`        | none                                                   | `{ status: "ok", database: "up" }`                          | 500 if DB down                                     | none                        | `HealthResponse`                              |
| POST   | `/auth/register` | `RegisterUserRequest { email, displayName, password }` | 201 `RegisterUserResponse { id }`                           | 400 validation, 409 `identity.email_already_taken` | `identity/register-user.ts` | `RegisterUserRequest`, `RegisterUserResponse` |
| GET    | `/users/:id`     | none                                                   | `UserProfileResponse { id, email, displayName, createdAt }` | 400 bad uuid, 404 `identity.user_not_found`        | `identity/user-profile.ts`  | `UserProfileResponse`                         |

Planned endpoints are listed per phase in [roadmap.md](../roadmap.md).

## WebSocket events

See [architecture/realtime.md](../architecture/realtime.md#event-catalog) (implemented in Phase 3).
