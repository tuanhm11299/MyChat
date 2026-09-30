import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import type { RegisterUserResponse } from '@mychat/contracts';
import { RegisterUserCommand } from './register-user.command';
import { RegisterUserRequestDto } from './register-user.request.dto';

/**
 * HTTP entry point of the slice. Controllers stay thin: translate the request
 * into a command, send it, and return the result.
 */
@ApiTags('identity')
@Controller('auth')
export class RegisterUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The user was created. Returns the new user id.' })
  @ApiConflictResponse({ description: 'An account with this email already exists.' })
  async register(@Body() body: RegisterUserRequestDto): Promise<RegisterUserResponse> {
    return this.commandBus.execute(
      new RegisterUserCommand(body.email, body.displayName, body.password),
    );
  }
}
