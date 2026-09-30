'use client';

import { registerUserRequestSchema } from '@mychat/contracts';
import { useState, type FormEvent } from 'react';
import { useRegisterUser } from '../hooks/use-register-user';

export function RegisterForm() {
  const registerUser = useRegisterUser();
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // Same schema the API contract is built from, so both sides agree on the rules.
    const parsed = registerUserRequestSchema.safeParse({
      email: form.get('email'),
      displayName: form.get('displayName'),
      password: form.get('password'),
    });
    if (!parsed.success) {
      setValidationError(
        parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'),
      );
      return;
    }

    setValidationError(null);
    registerUser.mutate(parsed.data);
  }

  if (registerUser.isSuccess) {
    return (
      <p role="status" className="rounded-md bg-green-50 p-4 text-green-800">
        Account created. Your user id is <code>{registerUser.data.id}</code>.
      </p>
    );
  }

  const error = validationError ?? registerUser.error?.message;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Display name" name="displayName" type="text" autoComplete="nickname" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" />

      {error && (
        <p
          role="alert"
          className="whitespace-pre-line rounded-md bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={registerUser.isPending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {registerUser.isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}

function Field(props: { label: string; name: string; type: string; autoComplete: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {props.label}
      <input
        name={props.name}
        type={props.type}
        autoComplete={props.autoComplete}
        required
        className="rounded-md border border-gray-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
