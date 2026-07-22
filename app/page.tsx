// This is the homepage — the very first thing anyone sees when they
// visit our app's URL. Right now it just proves the app is alive and
// deployed. In a later milestone, this becomes our real marketing
// page ("Stop chasing invoices manually").

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">
        Invoice Follow-Up Assistant
      </h1>
      <p className="mt-3 max-w-md text-zinc-600">
        AI-drafted, human-approved follow-ups for overdue invoices.
      </p>
      <div className="mt-6 flex gap-3">
        <a
          href="/signup"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Sign up
        </a>
        <a
          href="/login"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
        >
          Log in
        </a>
      </div>
    </main>
  );
}
