"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectStripeForm() {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/stripe/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restrictedKey: key }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    // Refreshes the page's server-side data so the dashboard now
    // shows "Stripe connected" instead of this form.
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">
          Connect Stripe
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Paste a restricted API key with read-only access to Invoices.
          We only ever read invoice data — we never touch your money.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <input
        type="password"
        required
        placeholder="rk_test_... or rk_live_..."
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Connecting..." : "Connect Stripe"}
      </button>
    </form>
  );
}
