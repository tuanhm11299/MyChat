import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { createTestApp } from './create-test-app';

describe('Identity (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    ({ app, dataSource } = await createTestApp());
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE users CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  const register = (body: object) => request(app.getHttpServer()).post('/auth/register').send(body);

  it('registers a user and returns their profile', async () => {
    const created = await register({
      email: 'Ada@Example.com',
      displayName: 'Ada',
      password: 'secret-password',
    }).expect(201);

    const profile = await request(app.getHttpServer()).get(`/users/${created.body.id}`).expect(200);

    expect(profile.body).toEqual({
      id: created.body.id,
      email: 'ada@example.com',
      displayName: 'Ada',
      createdAt: expect.any(String),
    });
  });

  it('stores a hash, never the plain password', async () => {
    await register({ email: 'ada@example.com', displayName: 'Ada', password: 'secret-password' });

    const [row] = await dataSource.query('SELECT password_hash FROM users');
    expect(row.password_hash).toMatch(/^scrypt\$/);
    expect(row.password_hash).not.toContain('secret-password');
  });

  it('returns 409 when the email is already taken', async () => {
    const body = { email: 'ada@example.com', displayName: 'Ada', password: 'secret-password' };
    await register(body).expect(201);

    const response = await register({ ...body, email: 'ADA@example.com' }).expect(409);
    expect(response.body.code).toBe('identity.email_already_taken');
  });

  it('returns 400 for an invalid request body', async () => {
    await register({ email: 'not-an-email', displayName: '', password: 'short' }).expect(400);
  });

  it('returns 404 for an unknown user', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/00000000-0000-4000-8000-000000000000')
      .expect(404);
    expect(response.body.code).toBe('identity.user_not_found');
  });

  it('reports health', async () => {
    await request(app.getHttpServer()).get('/health').expect(200, { status: 'ok', database: 'up' });
  });
});
