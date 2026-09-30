import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordHasher } from './domain/password-hasher';
import { UserRepository } from './domain/user.repository';
import { GetUserProfileController } from './features/get-user-profile/get-user-profile.controller';
import { GetUserProfileHandler } from './features/get-user-profile/get-user-profile.handler';
import { RegisterUserController } from './features/register-user/register-user.controller';
import { RegisterUserHandler } from './features/register-user/register-user.handler';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { ScryptPasswordHasher } from './infrastructure/security/scrypt-password-hasher';

/**
 * Identity module: user accounts and (in Phase 1) authentication.
 *
 * Every slice is registered here by hand, so this file is the table of
 * contents of the module. To add a slice, add its controller and handler below.
 */
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [
    // features/register-user
    RegisterUserController,
    // features/get-user-profile
    GetUserProfileController,
  ],
  providers: [
    // Command and query handlers
    RegisterUserHandler,
    GetUserProfileHandler,

    // Ports (domain abstractions) bound to their adapters (infrastructure)
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    { provide: PasswordHasher, useClass: ScryptPasswordHasher },
  ],
})
export class IdentityModule {}
