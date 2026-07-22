import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// A handful of realistic-looking fake invoices — some overdue by
// different amounts, one already paid — so every later milestone
// (overdue detection, tone settings, AI drafts) has real variety to
// work with, without needing a live Stripe connection.
function buildSampleInvoices(userId: string) {
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  };

  return [
    {
      user_id: userId,
      source: "sample",
      client_name: "Bright Path Consulting",
      client_email: "accounts@brightpathconsulting.example",
      amount_cents: 240000,
      currency: "usd",
      due_date: daysAgo(35),
      status: "overdue",
      tone: "gentle",
    },
    {
      user_id: userId,
      source: "sample",
      client_name: "Marlowe & Finch Ltd",
      client_email: "finance@marlowefinch.example",
      amount_cents: 89000,
      currency: "gbp",
      due_date: daysAgo(16),
      status: "overdue",
      tone: "standard",
    },
    {
      user_id: userId,
      source: "sample",
      client_name: "Yellow Anchor Studio",
      client_email: "hello@yellowanchor.example",
      amount_cents: 152500,
      currency: "usd",
      due_date: daysAgo(46),
      status: "overdue",
      tone: "firm",
    },
    {
      user_id: userId,
      source: "sample",
      client_name: "Northwind Farms Co-op",
      client_email: "billing@northwindfarms.example",
      amount_cents: 62000,
      currency: "cad",
      due_date: daysAgo(6),
      status: "overdue",
      tone: "gentle",
    },
    {
      user_id: userId,
      source: "sample",
      client_name: "Verity Legal Partners",
      client_email: "ap@veritylegal.example",
      amount_cents: 310000,
      currency: "usd",
      due_date: daysAgo(20),
      status: "paid",
      tone: "standard",
    },
  ];
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  // Wipe any previous sample data first, so clicking this button
  // twice doesn't just keep duplicating invoices.
  await supabase
    .from("invoices")
    .delete()
    .eq("user_id", user.id)
    .eq("source", "sample");

  const { error } = await supabase
    .from("invoices")
    .insert(buildSampleInvoices(user.id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
