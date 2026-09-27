/**
 * Something that happened in the domain, named in the past tense (e.g. UserRegistered).
 *
 * Aggregates record events; command handlers publish them on the Nest EventBus
 * after the aggregate is saved. Other modules react to them without the
 * aggregate knowing who is listening.
 */
export interface DomainEvent {
  readonly occurredAt: Date;
}
