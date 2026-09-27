import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidDisplayNameError extends DomainError {
  readonly code = 'identity.invalid_display_name';
  readonly kind = 'validation';

  constructor(reason: string) {
    super(`Invalid display name: ${reason}`);
  }
}
