/**
 * GET /users/:id
 * Public profile of a user. Never contains private data such as the password hash.
 */
export interface UserProfileResponse {
  id: string;
  email: string;
  displayName: string;
  /** ISO-8601 timestamp */
  createdAt: string;
}
