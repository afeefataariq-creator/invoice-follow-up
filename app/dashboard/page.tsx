// No "use client" here — this runs on the SERVER, which is exactly
// what we want for a security check: we decide whether to show this
// page before any of it ever reaches the browser.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import ConnectStripeForm from "@/components/ConnectStripeForm";
import SampleDataButton from "@/components/SampleDataButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: connection } = await supabase
    .from("stripe_connections")
    .select("id, created_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const { count: invoiceCount } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="text-zinc-600">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>

        {connection && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-green-700">
              ✅ Stripe connected
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Connected on{" "}
              {new Date(connection.created_at).toLocaleDateString()}.
            </p>
          </div>
        )}

        {!connection && <ConnectStripeForm />}

        {invoiceCount ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-green-700">
              ✅ {invoiceCount} invoice{invoiceCount === 1 ? "" : "s"} loaded
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              The full invoice list and overdue detection view is coming in
              the next milestone.
            </p>
          </div>
        ) : (
          <SampleDataButton />
        )}
      </div>
    </main>
  );
}


