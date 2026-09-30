import { EventBus, IEvent } from '@nestjs/cqrs';
import { Email } from '../../domain/email';
import { EmailAlreadyTakenError } from '../../domain/errors/email-already-taken.error';
import { InvalidDisplayNameError } from '../../domain/errors/invalid-display-name.error';
import { InvalidEmailError } from '../../domain/errors/invalid-email.error';
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { User } from '../../domain/user';
import { FakePasswordHasher } from '../../testing/fake-password-hasher';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { RegisterUserCommand } from './register-user.command';
import { RegisterUserHandler } from './register-user.handler';

describe('RegisterUserHandler', () => {
  let users: InMemoryUserRepository;
  let publishedEvents: IEvent[];
  let handler: RegisterUserHandler;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    publishedEvents = [];
    const eventBus = { publishAll: (events: IEvent[]) => publishedEvents.push(...events) };
    handler = new RegisterUserHandler(users, new FakePasswordHasher(), eventBus as EventBus);
  });

  it('saves a new user with a normalized email and a hashed password', async () => {
    const { id } = await handler.execute(
      new RegisterUserCommand('  Ada@Example.com ', 'Ada', 'secret-password'),
    );

    const saved = await users.findById(id);
    expect(saved?.email.value).toBe('ada@example.com');
    expect(saved?.displayName).toBe('Ada');
    expect(saved?.passwordHash).toBe('hashed:secret-password');
  });

  it('publishes a UserRegistered event', async () => {
    const { id } = await handler.execute(
      new RegisterUserCommand('ada@example.com', 'Ada', 'pw-12345'),
    );

    expect(publishedEvents).toHaveLength(1);
    expect(publishedEvents[0]).toBeInstanceOf(UserRegisteredEvent);
    expect((publishedEvents[0] as UserRegisteredEvent).userId).toBe(id);
  });

  it('rejects an email that is already taken', async () => {
    await users.save(
      User.restore({
        id: 'existing-user',
        email: Email.create('ada@example.com'),
        displayName: 'Existing',
        passwordHash: 'x',
        createdAt: new Date(),
      }),
    );

    await expect(
      handler.execute(new RegisterUserCommand('ADA@example.com', 'Ada', 'pw-12345')),
    ).rejects.toThrow(EmailAlreadyTakenError);
  });

  it('rejects an invalid email', async () => {
    await expect(
      handler.execute(new RegisterUserCommand('not-an-email', 'Ada', 'pw-12345')),
    ).rejects.toThrow(InvalidEmailError);
  });

  it('rejects a blank display name', async () => {
    await expect(
      handler.execute(new RegisterUserCommand('ada@example.com', '   ', 'pw-12345')),
    ).rejects.toThrow(InvalidDisplayNameError);
    expect(publishedEvents).toHaveLength(0);
  });
});
