import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { UserProfileResponse } from '@mychat/contracts';
import { Repository } from 'typeorm';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserOrmEntity } from '../../infrastructure/persistence/user.orm-entity';
import { GetUserProfileQuery } from './get-user-profile.query';

/**
 * Read side of CQRS: queries don't need business rules, so they skip the
 * domain aggregate and read straight from the database into the response
 * shape. This keeps reads simple and fast. Only commands go through the domain.
 */
@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<
  GetUserProfileQuery,
  UserProfileResponse
> {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
  ) {}

  async execute(query: GetUserProfileQuery): Promise<UserProfileResponse> {
    const user = await this.users.findOne({
      where: { id: query.userId },
      select: { id: true, email: true, displayName: true, createdAt: true },
    });
    if (!user) {
      throw new UserNotFoundError(query.userId);
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
