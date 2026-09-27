import { Email } from './email';
import { InvalidDisplayNameError } from './errors/invalid-display-name.error';
import { InvalidEmailError } from './errors/invalid-email.error';
import { UserRegisteredEvent } from './events/user-registered.event';
import { User } from './user';

const validProps = () => ({
  id: 'user-1',
  email: Email.create('ada@example.com'),
  displayName: 'Ada',
  passwordHash: 'hash',
  createdAt: new Date('2026-01-01T00:00:00Z'),
});

describe('Email', () => {
  it('normalizes case and surrounding spaces', () => {
    expect(Email.create('  Ada@Example.COM ').value).toBe('ada@example.com');
  });

  it.each(['', 'ada', 'ada@', '@example.com', 'ada @example.com'])('rejects "%s"', (raw) => {
    expect(() => Email.create(raw)).toThrow(InvalidEmailError);
  });
});

describe('User.register', () => {
  it('trims the display name', () => {
    const user = User.register({ ...validProps(), displayName: '  Ada  ' });
    expect(user.displayName).toBe('Ada');
  });

  it('rejects a display name longer than 50 characters', () => {
    expect(() => User.register({ ...validProps(), displayName: 'a'.repeat(51) })).toThrow(
      InvalidDisplayNameError,
    );
  });

  it('records a UserRegistered event that can be pulled only once', () => {
    const user = User.register(validProps());

    expect(user.pullDomainEvents()).toEqual([expect.any(UserRegisteredEvent)]);
    expect(user.pullDomainEvents()).toEqual([]);
  });
});

describe('User.restore', () => {
  it('records no events, because the user already exists', () => {
    expect(User.restore(validProps()).pullDomainEvents()).toEqual([]);
  });
});
