# How to add a web feature

Reference: `apps/web/src/features/identity/` (registration form). Architecture:
[architecture/web.md](../architecture/web.md).

Example: a "profile" page showing a user's profile.

## 1. Make sure the contract exists

The response type must be in `packages/contracts` (here `UserProfileResponse`). If not, add it
there first and rebuild: `pnpm --filter @mychat/contracts build`.

## 2. API function (`features/profile/api/get-user-profile.ts`)

```ts
import type { UserProfileResponse } from '@mychat/contracts';
import { apiRequest } from '@/lib/api-client';

export function getUserProfile(userId: string): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>(`/users/${userId}`);
}
```

One function per endpoint. Never call `fetch` anywhere else.

## 3. Hook (`features/profile/hooks/use-user-profile.ts`)

```ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/get-user-profile';

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'profile'],
    queryFn: () => getUserProfile(userId),
  });
}
```

Query keys: start with the resource (`['users', id, …]`) so related caches can be invalidated
together. Use `useMutation` for writes (see `use-register-user.ts`).

## 4. Component (`features/profile/components/profile-card.tsx`)

Handle the three states explicitly: `isPending`, `error`, data.

## 5. Page (`app/users/[id]/page.tsx`)

Keep it thin: read params and render the feature component.

## 6. Check

```sh
pnpm --filter @mychat/web lint
pnpm --filter @mychat/web typecheck
pnpm --filter @mychat/web build
```

Rules to remember: features don't import other features (ESLint enforces it), and API types come
only from `@mychat/contracts`.
