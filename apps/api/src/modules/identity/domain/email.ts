import { InvalidEmailError } from './errors/invalid-email.error';

// Deliberately simple: the only reliable way to validate an email is to send a message to it.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Value Object: an email address that is always valid and normalized
 * (trimmed, lower-case). Once you hold an `Email`, you don't need to check it again.
 */
export class Email {
  private constructor(public readonly value: string) {}

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    if (normalized.length > 254 || !EMAIL_PATTERN.test(normalized)) {
      throw new InvalidEmailError(raw);
    }
    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
