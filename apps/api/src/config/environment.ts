/**
 * Environment variables the API needs. They are read once at startup and
 * validated here, so a missing value fails fast with a clear message
 * instead of causing a confusing error later.
 *
 * Local values live in apps/api/.env (copy .env.example).
 */
export interface Environment {
  PORT: number;
  DATABASE_URL: string;
  WEB_ORIGIN: string;
}

export function validateEnvironment(raw: Record<string, unknown>): Environment {
  const databaseUrl = raw.DATABASE_URL;
  if (typeof databaseUrl !== 'string' || databaseUrl.length === 0) {
    throw new Error(
      'DATABASE_URL is required, e.g. postgres://mychat:mychat@localhost:5432/mychat',
    );
  }

  const port = Number(raw.PORT ?? 4000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`PORT must be a positive integer, got "${String(raw.PORT)}"`);
  }

  const webOrigin = typeof raw.WEB_ORIGIN === 'string' ? raw.WEB_ORIGIN : 'http://localhost:3000';

  return { PORT: port, DATABASE_URL: databaseUrl, WEB_ORIGIN: webOrigin };
}
