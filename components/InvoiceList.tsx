"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { daysOverdue, formatCurrency, getSeverity } from "@/lib/invoices";

type Invoice = {
  id: string;
  client_name: string;
  client_email: string;
  amount_cents: number;
  currency: string;
  due_date: string;
  status: string;
  tone: string;
};

const severityStyles = {
  paid: "bg-zinc-100 text-zinc-500",
  notYetDue: "bg-blue-50 text-blue-700",
  mild: "bg-yellow-50 text-yellow-700",
  moderate: "bg-orange-50 text-orange-700",
  severe: "bg-red-50 text-red-700",
};

function severityLabel(status: string, days: number): string {
  if (status === "paid") return "Paid";
  if (days <= 0) return days === 0 ? "Due today" : `Due in ${Math.abs(days)} days`;
  return `${days} days overdue`;
}

function ToneSelector({ invoiceId, tone }: { invoiceId: string; tone: string }) {
  const [value, setValue] = useState(tone);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(newTone: string) {
    setValue(newTone);
    setSaving(true);

    await fetch(`/api/invoices/${invoiceId}/tone`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone: newTone }),
    });

    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 disabled:opacity-50"
    >
      <option value="gentle">Gentle</option>
      <option value="standard">Standard</option>
      <option value="firm">Firm</option>
    </select>
  );
}

export default function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  // Most overdue first — that's the whole point of this screen: show
  // the user what needs their attention most urgently, right at top.
  const sorted = [...invoices].sort(
    (a, b) => daysOverdue(b.due_date) - daysOverdue(a.due_date)
  );

  return (
    <div className="space-y-3">
      {sorted.map((invoice) => {
        const days = daysOverdue(invoice.due_date);
        const severity = getSeverity(invoice.status, days);

        return (
          <div
            key={invoice.id}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-zinc-900">
                {invoice.client_name}
              </p>
              <p className="text-sm text-zinc-500">{invoice.client_email}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium text-zinc-900">
                {formatCurrency(invoice.amount_cents, invoice.currency)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${severityStyles[severity]}`}
              >
                {severityLabel(invoice.status, days)}
              </span>
              {invoice.status !== "paid" && (
                <ToneSelector invoiceId={invoice.id} tone={invoice.tone} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

