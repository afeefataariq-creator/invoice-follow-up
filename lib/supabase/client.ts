// This client is used in code that runs in the USER'S BROWSER
// (e.g. a "Sign up" button the user clicks). It only ever uses the
// public, safe-to-expose anon key — never a secret key.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
