import { createClient } from "@supabase/supabase-js";

// Real Supabase credentials compiled as robust, permanent defaults
const REAL_SUPABASE_URL = "https://mmjlbbaccyehmmvdfgoj.supabase.co";
const REAL_SUPABASE_ANON_KEY = "sb_publishable_JguOoHuiZ85mfgPjCmMV0A_iJFOyvmU";

// Load from environment with strict validation, falling back to the real production Supabase project
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = envUrl && !envUrl.includes("your-project-id") ? envUrl : REAL_SUPABASE_URL;
  const key = envKey && !envKey.includes("your-anon-key") ? envKey : REAL_SUPABASE_ANON_KEY;

  return { url, key };
};

const { url, key } = getSupabaseConfig();

export const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Since we have the compiled-in real production Supabase fallback, it is always ready to sync.
export const isSupabaseReady = (): boolean => {
  return Boolean(url && key && !url.includes("your-project-id") && !key.includes("your-anon-key"));
};
