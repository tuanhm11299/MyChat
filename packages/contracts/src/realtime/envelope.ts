/**
 * Every WebSocket frame (both directions) is a JSON object with this shape.
 * See docs/architecture/realtime.md for the event catalog.
 */
export interface WsEnvelope<TType extends string = string, TPayload = unknown> {
  /** Event name, e.g. "message.created". */
  type: TType;
  payload: TPayload;
  /** Optional client-generated id, echoed back in acknowledgements. */
  id?: string;
}
