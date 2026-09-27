import { Email } from '../../domain/email';
import { User } from '../../domain/user';
import { UserOrmEntity } from './user.orm-entity';

export const UserMapper = {
  toDomain(row: UserOrmEntity): User {
    return User.restore({
      id: row.id,
      email: Email.create(row.email),
      displayName: row.displayName,
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
    });
  },

  toPersistence(user: User): UserOrmEntity {
    const row = new UserOrmEntity();
    row.id = user.id;
    row.email = user.email.value;
    row.displayName = user.displayName;
    row.passwordHash = user.passwordHash;
    row.createdAt = user.createdAt;
    return row;
  },
};
