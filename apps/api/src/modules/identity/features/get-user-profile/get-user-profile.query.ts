import { Query } from '@nestjs/cqrs';
import type { UserProfileResponse } from '@mychat/contracts';

/**
 * Query: a request for data that never changes state.
 * The generic parameter tells the QueryBus what `execute()` returns.
 */
export class GetUserProfileQuery extends Query<UserProfileResponse> {
  constructor(public readonly userId: string) {
    super();
  }
}
