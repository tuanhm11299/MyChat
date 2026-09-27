---
name: backend-aggregate
description: Add or change a domain aggregate / value object in apps/api together with its repository port, TypeORM entity, mapper, adapter and in-memory fake. Use when introducing a new business concept or table.
---

# Add a domain aggregate with persistence

Full human guide (source of truth): `docs/guides/backend-add-aggregate.md`
Reference implementation: `apps/api/src/modules/identity/` (`User`, `Email`, `UserRepository`).

## Checklist

1. `domain/<name>.ts`: `extends AggregateRoot`, private constructor, `static create()` (validates + records
   event) and `static restore()` (no validation, no events), getters only, behaviour methods named after
   business actions. Pure TS: no `@nestjs/*`, no `typeorm`.
2. Value objects for values with rules (see `email.ts`).
3. `domain/<name>.repository.ts`: abstract class port with only the methods commands need.
4. `infrastructure/persistence/<name>.orm-entity.ts`: snake_case table/columns via `name:`.
   Add it to `ORM_ENTITIES` in `src/database/typeorm-options.ts`.
5. `<name>.mapper.ts` (`toDomain` / `toPersistence`) and `typeorm-<name>.repository.ts` adapter
   (translate meaningful DB errors, e.g. unique violations, into domain errors).
6. `testing/in-memory-<name>.repository.ts` fake with the same behaviour.
7. Bind the port in the module: `{ provide: Port, useClass: Adapter }`; add the module to `app.module.ts` if new.
8. `domain/<name>.spec.ts` covering every rule.
9. Run the `db-migration` skill.
