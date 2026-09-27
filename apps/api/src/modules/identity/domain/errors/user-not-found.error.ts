import { DomainError } from '../../../../shared/domain/domain-error';

export class UserNotFoundError extends DomainError {
  readonly code = 'identity.user_not_found';
  readonly kind = 'not-found';

  constructor(userId: string) {
    super(`User "${userId}" was not found.`);
  }
}
