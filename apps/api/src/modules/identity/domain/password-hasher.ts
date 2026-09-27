/**
 * Port: hashing is a technical detail, so the domain only describes what it
 * needs. Implemented in infrastructure/security/scrypt-password-hasher.ts.
 */
export abstract class PasswordHasher {
  abstract hash(plainPassword: string): Promise<string>;
  abstract verify(plainPassword: string, hash: string): Promise<boolean>;
}
