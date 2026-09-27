import { DomainEvent } from '../../../../shared/domain/domain-event';

export class UserRegisteredEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}
