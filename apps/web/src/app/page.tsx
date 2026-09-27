import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-4">
      <h1 className="text-4xl font-bold">MyChat</h1>
      <p className="text-lg text-gray-600">
        Chat with your friends and teams, on the web and on your phone.
      </p>
      <Link
        href="/register"
        className="w-fit rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
      >
        Create an account
      </Link>
    </main>
  );
}
