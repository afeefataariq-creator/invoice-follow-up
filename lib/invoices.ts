// Small, focused helper functions — the kind of logic that's easy to
// get subtly wrong (off-by-one day errors, wrong currency symbol), so
// it lives in one place instead of being retyped on every page.

export function daysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  // Zero out the time portion so we're comparing whole days, not
  // hours/minutes — otherwise "due today" could wrongly show as
  // overdue by a few hours depending on time of day.
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - due.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

export type OverdueSeverity = "paid" | "notYetDue" | "mild" | "moderate" | "severe";

// Buckets the days-overdue number into a severity level, so the UI
// can color-code invoices by urgency instead of just showing a
// number the user has to interpret themselves.
export function getSeverity(status: string, days: number): OverdueSeverity {
  if (status === "paid") return "paid";
  if (days <= 0) return "notYetDue";
  if (days < 14) return "mild";
  if (days < 30) return "moderate";
  return "severe";
}
