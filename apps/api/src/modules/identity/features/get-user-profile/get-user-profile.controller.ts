import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { UserProfileResponse } from '@mychat/contracts';
import { GetUserProfileQuery } from './get-user-profile.query';

@ApiTags('identity')
@Controller('users')
export class GetUserProfileController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @ApiOkResponse({ description: 'The public profile of the user.' })
  @ApiNotFoundResponse({ description: 'No user with this id.' })
  async getProfile(@Param('id', ParseUUIDPipe) id: string): Promise<UserProfileResponse> {
    return this.queryBus.execute(new GetUserProfileQuery(id));
  }
}
