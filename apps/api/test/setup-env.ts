// Runs before every e2e test file (see jest-e2e.config.json).
// E2E tests use a separate database so they never touch your dev data.
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgres://mychat:mychat@localhost:5432/mychat_test';
