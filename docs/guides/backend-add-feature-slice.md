# How to add a backend feature (vertical slice)

This guide adds a new use case to the API. It uses a realistic example, **"change my display
name"** (a command), and then shows what differs for a query.

Before starting, skim the reference slices:

- Command: `apps/api/src/modules/identity/features/register-user/`
- Query: `apps/api/src/modules/identity/features/get-user-profile/`

## 0. Decide: command or query?

- Does it **change** anything? → **command** (goes through the domain aggregate).
- Does it only **read**? → **query** (reads the database directly).

"Change display name" changes a user, so it is a command.

## 1. Put the business rule in the domain

Rules belong to the aggregate, not the handler. `User` already validates display names on
registration (`checkDisplayName`), so add a method that reuses it:

```ts
// modules/identity/domain/user.ts
changeDisplayName(newName: string): void {
  this.props.displayName = User.checkDisplayName(newName);
}
```

(Only code inside `User` can change `props`. Outside code can read `displayName` but has no
setter, so the rule can't be bypassed.) Add a test in `domain/user.spec.ts`:

```ts
it('changes the display name, trimming spaces', () => {
  const user = User.restore(validProps());
  user.changeDisplayName('  Grace ');
  expect(user.displayName).toBe('Grace');
});
```

If the domain needs something new from storage, add it to the port (`user.repository.ts`), then
implement it in **both** `TypeOrmUserRepository` and `testing/InMemoryUserRepository`.

## 2. Create the slice folder

```
modules/identity/features/change-display-name/
├── change-display-name.command.ts
├── change-display-name.handler.ts
├── change-display-name.handler.spec.ts
├── change-display-name.controller.ts
└── change-display-name.request.dto.ts
```

Naming: folder = use case in kebab-case, verb first. Classes = PascalCase of the same words +
suffix (`ChangeDisplayNameCommand`, `ChangeDisplayNameHandler`, …).

### The command

```ts
// change-display-name.command.ts
import { Command } from '@nestjs/cqrs';

export class ChangeDisplayNameCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly displayName: string,
  ) {
    super();
  }
}
```

The generic (`Command<void>`) is what `commandBus.execute()` returns.

### The handler

```ts
// change-display-name.handler.ts
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserRepository } from '../../domain/user.repository';
import { ChangeDisplayNameCommand } from './change-display-name.command';

@CommandHandler(ChangeDisplayNameCommand)
export class ChangeDisplayNameHandler implements ICommandHandler<ChangeDisplayNameCommand, void> {
  constructor(
    private readonly users: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChangeDisplayNameCommand): Promise<void> {
    const user = await this.users.findById(command.userId);
    if (!user) {
      throw new UserNotFoundError(command.userId);
    }

    user.changeDisplayName(command.displayName); // rule lives in the aggregate

    await this.users.save(user);
    this.eventBus.publishAll(user.pullDomainEvents());
  }
}
```

The shape of every command handler is the same: **load → call domain → save → publish events**.

### The request DTO

```ts
// change-display-name.request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeDisplayNameRequestDto {
  @ApiProperty({ example: 'Grace Hopper', maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayName: string;
}
```

If the contract is shared with clients, add the type to `packages/contracts` first and write
`implements ChangeDisplayNameRequest` on the DTO (see `register-user.request.dto.ts`).

### The controller

```ts
// change-display-name.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { ChangeDisplayNameCommand } from './change-display-name.command';
import { ChangeDisplayNameRequestDto } from './change-display-name.request.dto';

@ApiTags('identity')
@Controller('users')
export class ChangeDisplayNameController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/display-name')
  @HttpCode(HttpStatus.NO_CONTENT)
  async change(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ChangeDisplayNameRequestDto,
  ): Promise<void> {
    await this.commandBus.execute(new ChangeDisplayNameCommand(id, body.displayName));
  }
}
```

(Once authentication exists in Phase 1, the user id will come from the token via `@CurrentUser()`
instead of the URL.)

### The unit test

Use the in-memory fakes, not mocks. Test behaviour, not implementation:

```ts
// change-display-name.handler.spec.ts
import { EventBus, IEvent } from '@nestjs/cqrs';
import { Email } from '../../domain/email';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { User } from '../../domain/user';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { ChangeDisplayNameCommand } from './change-display-name.command';
import { ChangeDisplayNameHandler } from './change-display-name.handler';

describe('ChangeDisplayNameHandler', () => {
  let users: InMemoryUserRepository;
  let handler: ChangeDisplayNameHandler;

  beforeEach(async () => {
    users = new InMemoryUserRepository();
    const eventBus = { publishAll: (_events: IEvent[]) => undefined };
    handler = new ChangeDisplayNameHandler(users, eventBus as EventBus);
    await users.save(
      User.restore({
        id: 'user-1',
        email: Email.create('ada@example.com'),
        displayName: 'Ada',
        passwordHash: 'x',
        createdAt: new Date(),
      }),
    );
  });

  it('renames the user', async () => {
    await handler.execute(new ChangeDisplayNameCommand('user-1', 'Countess Ada'));
    expect((await users.findById('user-1'))?.displayName).toBe('Countess Ada');
  });

  it('fails for an unknown user', async () => {
    await expect(handler.execute(new ChangeDisplayNameCommand('nope', 'X'))).rejects.toThrow(
      UserNotFoundError,
    );
  });
});
```

## 3. Register the slice in the module

Open `modules/identity/identity.module.ts` and add the controller and handler. Nothing is
discovered automatically, so this file always shows every slice in the module:

```ts
controllers: [
  RegisterUserController,
  GetUserProfileController,
  ChangeDisplayNameController,   // ← new
],
providers: [
  RegisterUserHandler,
  GetUserProfileHandler,
  ChangeDisplayNameHandler,      // ← new
  ...
],
```

**Forgot this step?** The request fails with _"The command handler for the
ChangeDisplayNameCommand command was not found!"_ (handler missing) or 404 (controller missing).

## 4. Errors

Need a new business error? Add a class in `domain/errors/`:

```ts
export class DisplayNameTakenError extends DomainError {
  readonly code = 'identity.display_name_taken'; // stable; clients may rely on it
  readonly kind = 'conflict'; // → HTTP 409
}
```

Kinds map to HTTP statuses in `shared/infrastructure/domain-error.filter.ts`.

## 5. Database changes?

If you added a column or table, create a migration:
[database-migrations.md](database-migrations.md).

## 6. End-to-end test

Add a case to `apps/api/test/*.e2e-spec.ts` (or a new file) that calls the endpoint over HTTP.

## 7. Check and document

```sh
pnpm --filter @mychat/api lint        # also checks the architecture rules
pnpm --filter @mychat/api test
pnpm --filter @mychat/api test:e2e
```

Then add the endpoint to [docs/api/contracts.md](../api/contracts.md) (and the Kotlin mirror if
mobile uses it).

---

## Adding a query instead

Differences from a command:

1. **No domain changes**: queries don't use aggregates.
2. The class extends `Query<ResponseType>` and is named `<name>.query.ts`.
3. The handler injects a TypeORM repository (or `DataSource`) and reads straight into the
   response shape:

```ts
@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, UserSummary[]> {
  constructor(@InjectRepository(UserOrmEntity) private readonly users: Repository<UserOrmEntity>) {}

  async execute(query: ListUsersQuery): Promise<UserSummary[]> {
    const rows = await this.users.find({
      select: { id: true, displayName: true },
      order: { displayName: 'ASC' },
      take: query.limit,
    });
    return rows.map((row) => ({ id: row.id, displayName: row.displayName }));
  }
}
```

4. The controller uses `QueryBus` and `@Get`.
5. Test it with an e2e test (it's all database access), not a unit test.

## Checklist

- [ ] Business rules are in `domain/`, not in the handler or controller
- [ ] Slice folder has the standard files and names
- [ ] Controller + handler registered in `<module>.module.ts`
- [ ] Unit test for the handler (commands) / e2e test (queries and endpoints)
- [ ] Migration if the schema changed
- [ ] Contract + `docs/api/contracts.md` (+ Kotlin mirror) updated if clients use it
- [ ] `pnpm lint && pnpm test` pass
