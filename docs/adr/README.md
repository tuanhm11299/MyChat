# Architecture Decision Records

Short documents that explain **why** an important technical choice was made, so future
contributors don't have to guess. Format: Context → Decision → Consequences.

To record a new decision, copy the last file, increase the number, and set Status to `Accepted`.
If a decision is replaced, don't delete it: set its Status to `Superseded by NNNN`.

| #    | Decision                                                                             | Status   |
| ---- | ------------------------------------------------------------------------------------ | -------- |
| 0001 | [Monorepo with pnpm + Turborepo; Gradle for mobile](0001-monorepo-pnpm-turborepo.md) | Accepted |
| 0002 | [Backend: Clean Architecture + CQRS + vertical slices](0002-backend-architecture.md) | Accepted |
| 0003 | [PostgreSQL with TypeORM as a data mapper](0003-postgres-typeorm.md)                 | Accepted |
| 0004 | [Authentication: scrypt + JWT access/refresh tokens](0004-authentication.md)         | Accepted |
| 0005 | [Realtime over raw WebSocket](0005-realtime-websocket.md)                            | Accepted |
| 0006 | [Web: Next.js App Router](0006-web-nextjs.md)                                        | Accepted |
| 0007 | [Mobile: Kotlin Multiplatform with native UI](0007-mobile-kmp-native-ui.md)          | Accepted |
