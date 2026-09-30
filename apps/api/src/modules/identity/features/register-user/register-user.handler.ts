import { randomUUID } from 'node:crypto';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Email } from '../../domain/email';
import { EmailAlreadyTakenError } from '../../domain/errors/email-already-taken.error';
import { PasswordHasher } from '../../domain/password-hasher';
import { User } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';
import { RegisterUserCommand, RegisterUserResult } from './register-user.command';

/**
 * Use case: register a new user.
 *
 * A handler only orchestrates: it loads what it needs, asks the domain to do
 * the work, saves the result and publishes events. Business rules (valid email,
 * display name length) live in the domain objects, not here.
 */
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<
  RegisterUserCommand,
  RegisterUserResult
> {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const email = Email.create(command.email);
    if (await this.users.existsByEmail(email)) {
      throw new EmailAlreadyTakenError(email.value);
    }

    const user = User.register({
      id: randomUUID(),
      email,
      displayName: command.displayName,
      passwordHash: await this.passwordHasher.hash(command.password),
      createdAt: new Date(),
    });

    await this.users.save(user);
    this.eventBus.publishAll(user.pullDomainEvents());

    return { id: user.id };
  }
}
