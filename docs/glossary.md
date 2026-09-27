# Glossary

| Term                           | Meaning                                                                                                                   | Example in this repo                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Module** (bounded context)   | A business area with its own model and code. Talks to other modules only through events or public APIs.                   | `apps/api/src/modules/identity/`     |
| **Domain layer**               | Business rules in plain TypeScript. No framework, no database.                                                            | `identity/domain/`                   |
| **Entity**                     | Object identified by an id, not by its values.                                                                            | `shared/domain/entity.ts`            |
| **Aggregate / Aggregate root** | A cluster of objects saved and loaded as a unit, and the entity that guards its rules. The only thing repositories store. | `identity/domain/user.ts`            |
| **Value object**               | Immutable object defined by its value, always valid once created.                                                         | `identity/domain/email.ts`           |
| **Domain event**               | Something that happened, in past tense. Lets other code react without coupling.                                           | `UserRegisteredEvent`                |
| **Domain error**               | An expected business failure with a stable code. Mapped to an HTTP status.                                                | `EmailAlreadyTakenError`             |
| **Port**                       | Abstract class in the domain describing a need ("store users").                                                           | `identity/domain/user.repository.ts` |
| **Adapter**                    | Infrastructure class implementing a port with real technology.                                                            | `TypeOrmUserRepository`              |
| **Mapper**                     | Converts between a domain object and its database row.                                                                    | `user.mapper.ts`                     |
| **ORM entity**                 | Class describing a database table for TypeORM. Not the domain entity.                                                     | `user.orm-entity.ts`                 |
| **CQRS**                       | Command Query Responsibility Segregation: writes (commands) and reads (queries) take different paths.                     | `CommandBus` / `QueryBus`            |
| **Command**                    | Request to change state. Handled by exactly one command handler.                                                          | `RegisterUserCommand`                |
| **Query**                      | Request to read state. Never changes anything.                                                                            | `GetUserProfileQuery`                |
| **Handler**                    | Class that executes one command, query or event.                                                                          | `RegisterUserHandler`                |
| **Vertical slice**             | Everything for one use case in one folder, from HTTP to handler.                                                          | `features/register-user/`            |
| **DTO**                        | Data Transfer Object: shape + validation of an HTTP request body.                                                         | `register-user.request.dto.ts`       |
| **Contract**                   | Request/response/event types shared between backend and clients.                                                          | `packages/contracts`                 |
| **Envelope**                   | The `{ type, payload }` wrapper around every WebSocket frame.                                                             | `WsEnvelope`                         |
| **KMP**                        | Kotlin Multiplatform: one Kotlin codebase compiled for Android, iOS, JVM.                                                 | `mobile/shared`                      |
| **Source set**                 | A folder of KMP code compiled for a set of targets (`commonMain`, `iosMain`, …).                                          | `mobile/shared/src/`                 |
| **expect / actual**            | KMP mechanism: `commonMain` _expects_ a declaration, each platform provides the _actual_ one.                             | `Platform.kt`                        |
