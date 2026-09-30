import { join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';
import { UserOrmEntity } from '../modules/identity/infrastructure/persistence/user.orm-entity';

/**
 * Every TypeORM entity must be listed here. Keeping one explicit list (instead
 * of a file glob) makes it obvious which tables the app knows about.
 */
export const ORM_ENTITIES = [UserOrmEntity];

/**
 * Connection settings shared by the running app (database.module.ts) and the
 * TypeORM CLI used for migrations (data-source.ts).
 */
export function buildTypeOrmOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    entities: ORM_ENTITIES,
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    // The schema is only ever changed by migrations. Never enable synchronize:
    // it can silently drop columns and data.
    synchronize: false,
  };
}
