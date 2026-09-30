import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Email } from '../../domain/email';
import { EmailAlreadyTakenError } from '../../domain/errors/email-already-taken.error';
import { User } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';
import { UserMapper } from './user.mapper';
import { UserOrmEntity } from './user.orm-entity';

// Postgres error code for "unique constraint violated".
const PG_UNIQUE_VIOLATION = '23505';

/** Adapter: implements the UserRepository port with TypeORM + Postgres. */
@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly rows: Repository<UserOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.rows.findOneBy({ id });
    return row ? UserMapper.toDomain(row) : null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    return this.rows.existsBy({ email: email.value });
  }

  async save(user: User): Promise<void> {
    try {
      await this.rows.save(UserMapper.toPersistence(user));
    } catch (error) {
      // Two sign-ups with the same email can pass the existsByEmail check at the
      // same time; the unique index is the real guarantee.
      if (error instanceof QueryFailedError && error.driverError?.code === PG_UNIQUE_VIOLATION) {
        throw new EmailAlreadyTakenError(user.email.value);
      }
      throw error;
    }
  }
}
