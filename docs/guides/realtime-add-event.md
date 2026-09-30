# How to add a realtime (WebSocket) event

> The WebSocket gateway is built in Phase 3. This guide describes the agreed steps; update it
> with real file paths when the first event ships. Design: [architecture/realtime.md](../architecture/realtime.md).

Example: push `message.created` to everyone in a conversation when a message is sent.

## 1. Contract (`packages/contracts/src/realtime/`)

```ts
export interface MessageCreatedPayload {
  conversationId: string;
  message: { id: string; senderId: string; body: string; createdAt: string };
}
export type MessageCreatedEvent = WsEnvelope<'message.created', MessageCreatedPayload>;
```

Export it from `src/index.ts`, and add a row to the event catalog in `architecture/realtime.md`.

## 2. Domain event (backend)

The aggregate records it (`Conversation.postMessage()` → `this.recordEvent(new MessageSentEvent(...))`)
and the command handler publishes it after saving. Nothing realtime-specific yet.

## 3. Event handler → gateway (backend)

In `modules/messaging/realtime/`, an `@EventsHandler(MessageSentEvent)` class looks up the
conversation's participants and calls the gateway to send the envelope to their sockets. The
command handler never calls the gateway directly.

## 4. Web client

In the realtime client (`apps/web/src/lib/realtime-client.ts`), handle `type === 'message.created'`
by updating the React Query cache for that conversation (`queryClient.setQueryData`).

## 5. Mobile client

Add a `@Serializable` mirror in `mobile/shared/.../contracts/`, decode it in the shared WebSocket
client, and emit it on the conversation's `Flow`. Compose and SwiftUI screens already observe that
flow, so no UI change is needed for a new event of an existing kind.

## 6. Tests

- Backend: e2e test that connects a WebSocket client (`ws` package), sends a message over REST, and
  expects the envelope.
- Shared KMP: decoding test in `commonTest`.
