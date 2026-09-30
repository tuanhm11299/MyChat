import { Command } from '@nestjs/cqrs';

export interface RegisterUserResult {
  id: string;
}

/**
 * Command: an intention to change the system ("register this user").
 * It is a plain data holder. The work happens in RegisterUserHandler.
 * The generic parameter tells the CommandBus what `execute()` returns.
 */
export class RegisterUserCommand extends Command<RegisterUserResult> {
  constructor(
    public readonly email: string,
    public readonly displayName: string,
    public readonly password: string,
  ) {
    super();
  }
}
