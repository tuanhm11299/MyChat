---
name: realtime-event
description: Add a WebSocket event end to end - contract, domain event, gateway broadcast, web and KMP client handling. Use when the server must push something to clients in real time.
---

# Add a realtime event

Design (source of truth): `docs/architecture/realtime.md`
Step-by-step guide: `docs/guides/realtime-add-event.md`

## Checklist

1. Contract: `WsEnvelope<'<type>', Payload>` in `packages/contracts/src/realtime/`, exported from `index.ts`.
   Add a row to the event catalog in `docs/architecture/realtime.md`.
2. Backend: aggregate records a domain event; command handler publishes it after save.
3. Backend: `@EventsHandler` in `modules/messaging/realtime/` sends the envelope via the gateway.
   Command handlers never call the gateway directly.
4. Web: handle the `type` in the realtime client and update the React Query cache.
5. Mobile: `@Serializable` mirror in `mobile/shared/.../contracts/`, decode in the shared WS client, emit on a Flow.
6. Tests: backend e2e with a `ws` client; KMP decoding test in `commonTest`.

If the gateway doesn't exist yet (before Phase 3), build it first following `docs/architecture/realtime.md`,
then update the guide with real file paths.
