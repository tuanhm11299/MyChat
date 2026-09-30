# 0005 — Realtime over raw WebSocket with JSON envelopes

Status: Accepted (implemented in Phase 3)

## Context

Clients need to receive new messages, typing indicators and presence instantly. Clients are
a browser (Next.js) and Kotlin Multiplatform (Ktor) on Android/iOS.

## Decision

- NestJS WebSocket gateway using **`@nestjs/platform-ws`** (standard WebSocket), not Socket.IO.
- Every frame is a `{ type, payload, id? }` JSON envelope; event types are listed in
  [realtime.md](../architecture/realtime.md) and typed in `packages/contracts`.
- Writes go through REST; the socket is only for server pushes.
- Gateways react to domain events; handlers never call gateways.

## Consequences

- Works with the browser's built-in `WebSocket` and Ktor's `WebSockets` plugin. No extra client
  libraries needed.
- We implement ourselves what Socket.IO gives for free: heartbeats, reconnect, rooms. That's a few
  dozen lines, and they're documented.
- Multiple API instances need a Redis pub/sub fan-out (Phase 7).
