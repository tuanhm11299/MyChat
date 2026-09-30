# 0003 — PostgreSQL with TypeORM as a data mapper

Status: Accepted

## Context

Chat data is relational (users ↔ conversations ↔ messages), needs strong consistency and good
indexing for "latest messages in a conversation". The domain layer must stay free of ORM details.

## Decision

- **PostgreSQL 16+**.
- **TypeORM**, used in _data-mapper_ style only:
  - ORM classes (`*.orm-entity.ts`) live in `infrastructure/persistence/` and describe tables.
  - Domain classes are separate. A `*.mapper.ts` converts between them.
  - Repository adapters implement domain ports.
- **Schema changes only through migrations** (`src/database/migrations/`). `synchronize` is always
  `false`.
- Column names are `snake_case` (set explicitly with `name:`), property names `camelCase`.
- Entities are listed explicitly in `ORM_ENTITIES` (`src/database/typeorm-options.ts`), not found
  by a file glob.

## Consequences

- A mapper per aggregate is extra code, but database changes never ripple into business rules.
- Active Record (`user.save()`) and ORM relations in the domain are not used.
- Query handlers may use TypeORM repositories/query builder directly: reads don't need the domain.
