import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { PasswordHasher } from '../../domain/password-hasher';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keyLength: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * Hashes passwords with scrypt from Node's built-in crypto module, which is a
 * memory-hard algorithm recommended by OWASP and needs no native dependency.
 *
 * Stored format: "scrypt$<salt hex>$<hash hex>".
 */
@Injectable()
export class ScryptPasswordHasher extends PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH);
    const derived = await scryptAsync(plainPassword, salt, KEY_LENGTH);
    return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
  }

  async verify(plainPassword: string, stored: string): Promise<boolean> {
    const [algorithm, saltHex, hashHex] = stored.split('$');
    if (algorithm !== 'scrypt' || !saltHex || !hashHex) {
      return false;
    }
    const expected = Buffer.from(hashHex, 'hex');
    const actual = await scryptAsync(plainPassword, Buffer.from(saltHex, 'hex'), expected.length);
    return timingSafeEqual(actual, expected);
  }
}
