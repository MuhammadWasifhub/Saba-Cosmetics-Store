import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// This client uses the SERVICE ROLE key which bypasses Row Level Security.
// It must ONLY ever be used in server-side code (API routes), never sent to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
