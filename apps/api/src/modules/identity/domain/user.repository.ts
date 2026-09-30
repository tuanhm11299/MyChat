import { Email } from './email';
import { User } from './user';

/**
 * Port: what the domain/application layer needs from storage, expressed in
 * domain terms. The TypeORM implementation lives in
 * infrastructure/persistence/typeorm-user.repository.ts.
 *
 * It is an abstract class (not an interface) so Nest can use it directly as
 * the dependency-injection token: `constructor(private users: UserRepository)`.
 */
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract existsByEmail(email: Email): Promise<boolean>;
  /**
   * Inserts or updates the user.
   * @throws EmailAlreadyTakenError if another user already has this email.
   */
  abstract save(user: User): Promise<void>;
}
