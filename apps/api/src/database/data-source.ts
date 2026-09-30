import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm-options';

/**
 * Used only by the TypeORM CLI (see the migration:* scripts in package.json).
 * The running app connects through DatabaseModule instead.
 */
const envFile = join(__dirname, '..', '..', '.env');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy apps/api/.env.example to apps/api/.env.');
}

export default new DataSource(buildTypeOrmOptions(databaseUrl));
