/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_SUPABASE_URL?: string; readonly VITE_SUPABASE_ANON_KEY?: string }
interface ImportMeta { readonly env: ImportMetaEnv }

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_APPWRITE_BUCKET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
