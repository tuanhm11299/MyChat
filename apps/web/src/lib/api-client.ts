import type { ApiErrorResponse } from '@mychat/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

/** Thrown for every non-2xx response. `code` comes from the API (e.g. "identity.email_already_taken"). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * The single place where the web app talks HTTP to the API.
 * Feature code calls this through small typed functions in `features/<feature>/api/`.
 */
export async function apiRequest<TResponse>(
  path: string,
  init: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown } = {},
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: init.method ?? 'GET',
    headers: init.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as Partial<ApiErrorResponse> | null;
    throw new ApiError(
      response.status,
      error?.code ?? 'unknown',
      toMessage(error?.message) ?? `Request failed with status ${response.status}`,
    );
  }

  return (await response.json()) as TResponse;
}

// Nest's validation errors return `message` as a list of strings.
function toMessage(message: unknown): string | undefined {
  if (Array.isArray(message)) return message.join(', ');
  return typeof message === 'string' ? message : undefined;
}
