# 0004 — Authentication: scrypt password hashes + JWT access/refresh tokens

Status: Accepted (registration implemented; login/tokens in Phase 1)

## Decision

- Passwords are hashed with **scrypt** from Node's built-in `crypto` module. It's memory-hard and
  recommended by OWASP, and needs no native npm dependency (argon2 requires native builds). Hashes
  are stored as `scrypt$<salt>$<hash>` so the algorithm can be changed later.
- Login returns a short-lived **access token** (JWT, 15 min) and a long-lived **refresh token**
  (random string, 30 days, stored _hashed_ in `refresh_tokens`, rotated on every use).
- Web stores the refresh token in an httpOnly cookie; mobile stores it in Keychain (iOS) /
  EncryptedSharedPreferences (Android).
- The WebSocket handshake authenticates with the access token (see
  [realtime.md](../architecture/realtime.md)).

## Consequences

- Revoking a session = deleting its refresh token; access tokens expire quickly on their own.
