// No "use client" here — this runs on the SERVER, which is exactly
// what we want for a security check: we decide whether to show this
// page before any of it ever reaches the browser.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import ConnectStripeForm from "@/components/ConnectStripeForm";
import SampleDataButton from "@/components/SampleDataButton";
import InvoiceList from "@/components/InvoiceList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, client_name, client_email, amount_cents, currency, due_date, status, tone")
    .eq("user_id", user.id);

  const hasInvoices = invoices && invoices.length > 0;

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

        {hasInvoices ? (
          <>
            <InvoiceList invoices={invoices} />
            <details className="rounded-lg bg-white p-4 text-sm text-zinc-500 shadow-sm">
              <summary className="cursor-pointer font-medium text-zinc-700">
                Connect a different Stripe account or reload sample data
              </summary>
              <div className="mt-4 space-y-4">
                <ConnectStripeForm />
                <SampleDataButton />
              </div>
            </details>
          </>
        ) : (
          <>
            <ConnectStripeForm />
            <SampleDataButton />
          </>
        )}
      </div>
    </main>
  );
}



