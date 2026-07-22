"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SampleDataButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    setError(null);
    setLoading(true);

    const res = await fetch("/api/invoices/seed-sample", { method: "POST" });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
      <h3 className="text-sm font-semibold text-zinc-900">
        Don&apos;t have Stripe yet?
      </h3>
      <p className="mt-1 text-sm text-zinc-500">
        Load a few sample invoices so you can try everything else —
        overdue detection, tone settings, AI-drafted emails — before
        connecting a real account.
      </p>
      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="mt-3 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      >
        {loading ? "Loading sample data..." : "Try with sample invoices"}
      </button>
    </div>
  );
}
