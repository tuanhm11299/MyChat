# Database migrations

The schema is changed **only** by migrations in `apps/api/src/database/migrations/`. TypeORM's
`synchronize` is disabled on purpose: it can drop columns and data without warning.

All commands run from the repository root and need PostgreSQL running (`pnpm db:up`) and
`apps/api/.env`.

## Create a migration after changing an ORM entity

1. Change or add the `*.orm-entity.ts` (and list new entities in `ORM_ENTITIES`,
   `src/database/typeorm-options.ts`).
2. Generate the migration from the difference between your entities and the database:

   ```sh
   pnpm --filter @mychat/api migration:generate src/database/migrations/AddConversations
   ```

   Use a descriptive PascalCase name. TypeORM prefixes a timestamp.

3. **Read the generated file.** Check that `up()` does only what you intended and that `down()`
   exactly reverses it. Watch out for:
   - Renames showing up as DROP + ADD: that loses data. Rewrite them as `ALTER TABLE … RENAME COLUMN`.
   - New NOT NULL columns on tables with data: add a `DEFAULT` or backfill in the same migration.
   - Indexes: TypeORM generates random names. Rename them to something readable if you like
     (e.g. `IDX_messages_conversation_created_at`), in both `up()` and `down()`.
4. Apply it:

   ```sh
   pnpm --filter @mychat/api migration:run
   ```

5. Commit the entity change and the migration together.

## Write a migration by hand

For data changes or SQL TypeORM can't generate (e.g. full-text indexes), create a file in the same
folder following the same shape as the existing ones: a class implementing `MigrationInterface`
with `up` and `down`, named `<timestamp>-<Name>.ts`, where `<timestamp>` is `Date.now()`.

## Undo the last migration

```sh
pnpm --filter @mychat/api migration:revert
```

## Rules

- Never edit a migration that has been merged to `main`. Other databases have already run it.
  Write a new migration instead.
- Every migration must have a working `down()`.
- E2E tests run all migrations on the test database (`test/create-test-app.ts`), so a broken
  migration fails CI.

## How it works

`migration:*` scripts build the API, then run the TypeORM CLI against
`dist/database/data-source.js`, which loads `apps/api/.env` and uses the same settings as the app
(`buildTypeOrmOptions`).
