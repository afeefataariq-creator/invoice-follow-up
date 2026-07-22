// No "use client" here — this runs on the SERVER, which is exactly
// what we want for a security check: we decide whether to show this
// page before any of it ever reaches the browser.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If there's no logged-in user, send them to the login page instead
  // of showing anything. This is the actual "wall" we built this
  // milestone for.
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="mt-2 text-zinc-600">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>
        <p className="mt-8 rounded-lg bg-white p-6 text-sm text-zinc-500 shadow-sm">
          Your invoices will show up here soon — next milestone connects
          Stripe.
        </p>
      </div>
    </main>
  );
}
