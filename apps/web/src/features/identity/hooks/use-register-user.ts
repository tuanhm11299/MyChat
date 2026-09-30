'use client';

import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/register-user';

/** React Query wrapper: gives components loading/error/success state for free. */
export function useRegisterUser() {
  return useMutation({ mutationFn: registerUser });
}
