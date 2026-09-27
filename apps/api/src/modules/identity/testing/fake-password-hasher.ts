import { PasswordHasher } from '../domain/password-hasher';

/** Predictable, instant "hashing" for unit tests. Never use outside tests. */
export class FakePasswordHasher extends PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return `hashed:${plainPassword}`;
  }

  async verify(plainPassword: string, hash: string): Promise<boolean> {
    return hash === `hashed:${plainPassword}`;
  }
}
