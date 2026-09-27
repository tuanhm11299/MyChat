import { DomainError } from '../../../../shared/domain/domain-error';

export class EmailAlreadyTakenError extends DomainError {
  readonly code = 'identity.email_already_taken';
  readonly kind = 'conflict';

  constructor(email: string) {
    super(`An account with email "${email}" already exists.`);
  }
}
