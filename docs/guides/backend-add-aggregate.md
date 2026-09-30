# How to add a domain aggregate (and its persistence)

Use this when a module needs a new kind of thing to store with rules, e.g. `Conversation` in the
`conversations` module. Reference: the `User` aggregate in `modules/identity/`.

## Files you will create

```
modules/conversations/
├── conversations.module.ts
├── domain/
│   ├── conversation.ts                     Aggregate root
│   ├── conversation.repository.ts          Port (abstract class)
│   ├── events/conversation-created.event.ts
│   └── errors/…
├── infrastructure/persistence/
│   ├── conversation.orm-entity.ts          Table definition
│   ├── conversation.mapper.ts              Domain ↔ row
│   └── typeorm-conversation.repository.ts  Adapter
└── testing/in-memory-conversation.repository.ts
```

## 1. The aggregate (`domain/conversation.ts`)

Follow the shape of `identity/domain/user.ts`:

- `extends AggregateRoot` (from `shared/domain/aggregate-root.ts`).
- A **private constructor** + two static factories:
  - `static create(...)` for new objects: validates rules and records a `…CreatedEvent`.
  - `static restore(props)` for loading from the database: no validation, no events.
- **Getters only**, no public setters. State changes happen through methods named after business
  actions (`rename()`, `addParticipant()`), which check the rules and record events.
- Values with their own rules become **value objects** (like `Email`): a class with a private
  constructor and a `static create(raw)` that validates.
- Imports allowed: `shared/domain/*` and files inside `domain/`. ESLint rejects anything else.

## 2. The port (`domain/conversation.repository.ts`)

```ts
export abstract class ConversationRepository {
  abstract findById(id: string): Promise<Conversation | null>;
  abstract save(conversation: Conversation): Promise<void>;
}
```

Only add methods a command handler actually needs. Reads for screens go in query handlers, not here.

## 3. The ORM entity (`infrastructure/persistence/conversation.orm-entity.ts`)

```ts
@Entity({ name: 'conversations' })
export class ConversationOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 10 })
  type: 'direct' | 'group';

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
```

- Table names: plural snake_case. Columns: snake_case via `name:`.
- **Register it** in `ORM_ENTITIES` in `src/database/typeorm-options.ts`, or TypeORM won't know it.

## 4. The mapper and the adapter

- `conversation.mapper.ts`: `toDomain(row)` uses `Conversation.restore(...)`; `toPersistence(aggregate)`
  builds the ORM entity. See `user.mapper.ts`.
- `typeorm-conversation.repository.ts`: `@Injectable()`, `extends ConversationRepository`, injects
  `@InjectRepository(ConversationOrmEntity)`. Translate database errors that have a business meaning
  (e.g. unique violations) into domain errors, as `TypeOrmUserRepository.save` does.

## 5. The in-memory fake (`testing/`)

Implements the same port with a `Map`. It must behave like the real adapter (same uniqueness
rules), otherwise unit tests lie.

## 6. Wire the module

```ts
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ConversationOrmEntity])],
  controllers: [],
  providers: [{ provide: ConversationRepository, useClass: TypeOrmConversationRepository }],
})
export class ConversationsModule {}
```

Add `ConversationsModule` to `imports` in `src/app.module.ts`.

## 7. Migration

Generate and review it: [database-migrations.md](database-migrations.md).

## 8. Tests

`domain/conversation.spec.ts`: test every rule of the aggregate without any fakes (it's pure).

Then add slices that use it: [backend-add-feature-slice.md](backend-add-feature-slice.md).
