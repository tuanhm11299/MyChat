import { DomainEvent } from './domain-event';
import { Entity } from './entity';

/**
 * An Aggregate Root is the entry point to a cluster of domain objects that must
 * stay consistent together. Repositories load and save whole aggregates.
 *
 * It collects domain events while its methods run; the command handler takes
 * them with `pullDomainEvents()` after saving and publishes them.
 */
export abstract class AggregateRoot extends Entity {
  private domainEvents: DomainEvent[] = [];

  protected recordEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /** Returns the recorded events and clears the list, so they are published only once. */
  pullDomainEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}
