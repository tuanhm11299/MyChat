import { z } from 'zod';

/**
 * POST /auth/register
 * Creates a new account.
 */
export const registerUserRequestSchema = z.object({
  email: z.email().max(254),
  displayName: z.string().trim().min(1).max(50),
  password: z.string().min(8).max(128),
});

export type RegisterUserRequest = z.infer<typeof registerUserRequestSchema>;

export interface RegisterUserResponse {
  id: string;
}
