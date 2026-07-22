// This client is used in code that runs on OUR SERVER (e.g. checking
// "is this visitor logged in?" before showing the dashboard). It reads
// and writes the login session via cookies, which is how the server
// knows who's asking without the browser having to resend credentials
// on every request.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // This can be safely ignored if setAll is called from a
            // Server Component — middleware (below) handles refreshing
            // the session in that case instead.
          }
        },
      },
    }
  );
}
