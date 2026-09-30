---
name: db-migration
description: Generate, review, apply or revert a TypeORM migration for apps/api. Use for any PostgreSQL schema change (new table, column, index) or data migration.
---

# Database migration

Full human guide (source of truth): `docs/guides/database-migrations.md`

## Steps

1. Ensure PostgreSQL is running (`pnpm db:up`) and `apps/api/.env` exists.
2. Change the `*.orm-entity.ts` (new entities → `ORM_ENTITIES` in `src/database/typeorm-options.ts`).
3. Generate: `pnpm --filter @mychat/api migration:generate src/database/migrations/<PascalCaseName>`
4. **Review the file**: `up()` does only the intended change; `down()` reverses it exactly; no
   DROP+ADD for renames; NOT NULL columns on existing tables have a default/backfill.
5. Apply: `pnpm --filter @mychat/api migration:run`. Then run `pnpm --filter @mychat/api test:e2e`
   (it runs all migrations on the test DB).
6. Commit the entity change and the migration together.

## Never

- Enable `synchronize`.
- Edit a migration already merged to `main`. Write a new one.
