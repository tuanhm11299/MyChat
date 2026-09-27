import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidEmailError extends DomainError {
  readonly code = 'identity.invalid_email';
  readonly kind = 'validation';

  constructor(email: string) {
    super(`"${email}" is not a valid email address.`);
  }
}
