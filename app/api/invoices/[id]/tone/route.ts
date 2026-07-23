import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_TONES = ["gentle", "standard", "firm"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { tone } = await request.json();

  if (!VALID_TONES.includes(tone)) {
    return NextResponse.json({ error: "Invalid tone." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  // We filter by both the invoice id AND the user id — this is a
  // second layer of protection on top of Supabase's row-level
  // security, making sure someone can never update an invoice that
  // isn't theirs just by guessing another invoice's id.
  const { error } = await supabase
    .from("invoices")
    .update({ tone })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
