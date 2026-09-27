import { ApiProperty } from '@nestjs/swagger';
import type { RegisterUserRequest } from '@mychat/contracts';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * HTTP request body. The decorators validate the shape of the input (checked by
 * the global ValidationPipe) and document it in Swagger.
 *
 * `implements RegisterUserRequest` makes the compiler fail if this DTO drifts
 * from the shared contract used by the web app.
 */
export class RegisterUserRequestDto implements RegisterUserRequest {
  @ApiProperty({ example: 'ada@example.com' })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'Ada Lovelace', maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayName: string;

  @ApiProperty({ example: 'correct horse battery staple', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
