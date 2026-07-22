import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/crypto";

export async function POST(request: Request) {
  const { restrictedKey } = await request.json();

  // Basic sanity check before we even try calling Stripe with it.
  // Stripe restricted keys always start with "rk_".
  if (!restrictedKey || typeof restrictedKey !== "string" || !restrictedKey.startsWith("rk_")) {
    return NextResponse.json(
      {
        error:
          "That doesn't look like a Stripe restricted key. It should start with 'rk_test_' or 'rk_live_'.",
      },
      { status: 400 }
    );
  }

  // Confirm the visitor is actually logged in — this key must belong
  // to somebody, not float around unattached to a user.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  // Test the key against Stripe for real, with a harmless read-only
  // call. If the key is invalid, wrong permissions, or revoked,
  // Stripe will reject this and we catch it here — before we ever
  // save a key that doesn't actually work.
  try {
    const stripe = new Stripe(restrictedKey);
    await stripe.invoices.list({ limit: 1 });
  } catch {
    return NextResponse.json(
      {
        error:
          "Stripe rejected this key. Double check it's correct and has read access to Invoices.",
      },
      { status: 400 }
    );
  }

  const { encryptedKey, iv, authTag } = encrypt(restrictedKey);

  // "upsert" means: create a new row if this user doesn't have one
  // yet, or overwrite their existing one if they're reconnecting.
  const { error } = await supabase.from("stripe_connections").upsert(
    {
      user_id: user.id,
      encrypted_key: encryptedKey,
      iv,
      auth_tag: authTag,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
