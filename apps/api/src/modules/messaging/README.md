# messaging module (planned — Phases 2 and 3)

Messages inside conversations and their realtime delivery.

Planned slices (see docs/roadmap.md):

- `features/send-message` (command, publishes MessageSentEvent)
- `features/list-messages` (query, cursor pagination)
- `features/mark-conversation-read` (command)
- `realtime/` WebSocket gateway that forwards events to connected clients

Follow docs/guides/backend-add-feature-slice.md and docs/guides/realtime-add-event.md.
