/**
 * Category of a business rule failure. The HTTP layer maps each kind to a
 * status code (see shared/infrastructure/domain-error.filter.ts), so the domain
 * never needs to know about HTTP.
 */
export type DomainErrorKind = 'validation' | 'not-found' | 'conflict' | 'forbidden';

/**
 * Base class for expected business errors ("email already taken"),
 * as opposed to bugs or infrastructure failures.
 */
export abstract class DomainError extends Error {
  /** Stable, machine-readable identifier, e.g. "identity.email_already_taken". */
  abstract readonly code: string;
  abstract readonly kind: DomainErrorKind;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
