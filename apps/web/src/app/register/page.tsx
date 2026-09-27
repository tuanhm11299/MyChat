import type { Metadata } from 'next';
import { RegisterForm } from '@/features/identity/components/register-form';

export const metadata: Metadata = { title: 'Create account · MyChat' };

/**
 * Pages in app/ stay thin: they compose feature components.
 * The logic lives in src/features/identity.
 */
export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <RegisterForm />
    </main>
  );
}
