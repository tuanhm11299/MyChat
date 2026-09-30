import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { Email } from './email';
import { InvalidDisplayNameError } from './errors/invalid-display-name.error';
import { UserRegisteredEvent } from './events/user-registered.event';

const DISPLAY_NAME_MAX_LENGTH = 50;

export interface UserProps {
  id: string;
  email: Email;
  displayName: string;
  passwordHash: string;
  createdAt: Date;
}

/**
 * The User aggregate. Business rules about users live here, not in handlers
 * or controllers, so they are enforced no matter which use case changes a user.
 */
export class User extends AggregateRoot {
  private constructor(private readonly props: UserProps) {
    super(props.id);
  }

  /** Creates a brand-new user. Use this in the "register user" use case. */
  static register(props: UserProps): User {
    const user = new User({ ...props, displayName: User.checkDisplayName(props.displayName) });
    user.recordEvent(new UserRegisteredEvent(user.id, user.email.value));
    return user;
  }

  /**
   * Rebuilds a user that already exists (e.g. loaded from the database).
   * No rules are re-checked and no events are recorded.
   */
  static restore(props: UserProps): User {
    return new User(props);
  }

  get email(): Email {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private static checkDisplayName(raw: string): string {
    const name = raw.trim();
    if (name.length === 0) {
      throw new InvalidDisplayNameError('it must not be empty.');
    }
    if (name.length > DISPLAY_NAME_MAX_LENGTH) {
      throw new InvalidDisplayNameError(
        `it must be at most ${DISPLAY_NAME_MAX_LENGTH} characters.`,
      );
    }
    return name;
  }
}
