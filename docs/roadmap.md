# Roadmap

Each phase ends with working, tested software. Check items off in pull requests.

## Phase 0 — Foundation ✅ (this is where we are)

- [x] Monorepo (pnpm + Turborepo), shared `contracts` and `tsconfig` packages
- [x] Docs: architecture, ADRs, guides, CLAUDE.md files, Claude Code skills
- [x] API skeleton: config, TypeORM + first migration, error handling, Swagger at `/docs`
- [x] Reference slices: `register-user` (command), `get-user-profile` (query), `check-health`
- [x] Architecture rules enforced by ESLint
- [x] Web skeleton: landing page + working registration form
- [x] Mobile skeleton: KMP `shared` + Compose app + SwiftUI app showing server status
- [x] CI: lint, typecheck, unit + e2e tests, builds, shared KMP tests, Android build

## Phase 1 — Identity & authentication (API)

- [ ] `login` command → access token (JWT) + refresh token
- [ ] `refresh-session` and `logout` commands (refresh token rotation, `refresh_tokens` table)
- [ ] `get-current-user` query (`GET /me`)
- [ ] JWT guard + `@CurrentUser()` decorator, applied to all non-public endpoints
- [ ] Rate limiting on auth endpoints

## Phase 2 — Conversations & messages (REST)

- [ ] Tables: `conversations`, `conversation_participants`, `messages` (+ index on
      `(conversation_id, created_at DESC)`)
- [ ] `create-direct-conversation`, `create-group-conversation`, `add-participant` (commands)
- [ ] `list-my-conversations` (query, with last message + unread count)
- [ ] `send-message` (command, publishes `MessageSentEvent`)
- [ ] `list-messages` (query, cursor pagination with `before`/`after`)
- [ ] `mark-conversation-read` (command)

## Phase 3 — Realtime

- [ ] WebSocket gateway with JWT handshake, heartbeat
- [ ] `message.created`, `conversation.read` pushed from domain events
- [ ] Typing indicators, presence
- [ ] Contracts for all events in `packages/contracts/src/realtime`

## Phase 4 — Web client

- [ ] Login/logout, session refresh, protected routes
- [ ] Conversation list, chat view with infinite scroll
- [ ] Realtime client with reconnect + resync; optimistic sending
- [ ] Component tests (Vitest + Testing Library), Playwright smoke test

## Phase 5 — Mobile clients

- [ ] Shared: auth service, secure token storage (`expect`/`actual`), conversation + message repositories
- [ ] Shared: WebSocket client exposing `Flow`s; Swift interop decision (SKIE or wrappers), recorded in an ADR
- [ ] Shared: offline cache with SQLDelight
- [ ] Android (Compose) and iOS (SwiftUI): login, conversation list, chat screen

## Phase 6 — Rich features

- [ ] Attachments: presigned uploads to S3-compatible storage (MinIO locally)
- [ ] Push notifications (FCM / APNs)
- [ ] Edit / delete messages, reactions
- [ ] Message search (PostgreSQL full-text)

## Phase 7 — Production readiness

- [ ] Redis adapter for WebSocket fan-out across instances
- [ ] Transactional outbox for reliable domain events
- [ ] Structured logging (pino), OpenTelemetry tracing, health/readiness probes
- [ ] Docker images, deployment pipeline, database backups
