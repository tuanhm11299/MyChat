import type { RegisterUserRequest, RegisterUserResponse } from '@mychat/contracts';
import { apiRequest } from '@/lib/api-client';

export function registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
  return apiRequest<RegisterUserResponse>('/auth/register', { method: 'POST', body: request });
}
