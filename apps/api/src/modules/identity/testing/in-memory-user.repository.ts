import { Email } from '../domain/email';
import { EmailAlreadyTakenError } from '../domain/errors/email-already-taken.error';
import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

/**
 * Test double for UserRepository. Behaves like the real one (including the
 * unique-email rule) but keeps users in a Map, so unit tests need no database.
 */
export class InMemoryUserRepository extends UserRepository {
  private readonly users = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    return [...this.users.values()].some((user) => user.email.equals(email));
  }

  async save(user: User): Promise<void> {
    const other = [...this.users.values()].find(
      (existing) => existing.email.equals(user.email) && existing.id !== user.id,
    );
    if (other) {
      throw new EmailAlreadyTakenError(user.email.value);
    }
    this.users.set(user.id, user);
  }
}
