# Govt. Boys H. S. School Cantt, Guna — website & CMS

A responsive bilingual (English/Hindi) school website and integrated CMS, built with React, Vite and Supabase. Admin entry: `/Lakshya-admin`.

## Local development

```sh
npm ci
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Vite's development server URL is printed in the terminal. The site can render its bundled school content without configuration, but admin login, remote CMS sync, and uploads deliberately remain unavailable until Supabase is configured; there is no local/default-password bypass.

## Supabase setup

1. Use the connected Supabase project (Project Settings → API) to provide the project URL and publishable/anon key as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` locally and in Vercel. Never expose a service-role key.
2. Apply `supabase/migrations/20261116000000_school_cms.sql` using Supabase CLI (`supabase link --project-ref <project-ref> && supabase db push`) or the SQL editor. The migration creates the CMS table, RLS policies and public `school-media` bucket.
3. Create an administrator from Supabase Authentication (public signups should be disabled). In the user's `app_metadata`, set `{ "role": "school_admin" }` using a trusted Supabase admin mechanism/dashboard. Do not put this role in user-editable `user_metadata`.
4. Sign in at `/Lakshya-admin`. Public visitors can read the published content; only authenticated users with the trusted `app_metadata.role=school_admin` claim can write content or upload/delete school media.

## Production

Vercel can build this Vite app with `npm run build` and output directory `dist`; `vercel.json` routes direct paths such as `/Lakshya-admin` to the SPA. Configure both Supabase environment variables for Production, Preview and Development, then deploy from the connected Git repository. Configure the Supabase Auth site URL and redirect allowlist to the deployment domain. No production deployment is configured by this repository alone.

## Verification

`npm run build` and `npx tsc --noEmit` succeed. Remote database migration and live authentication/CRUD/storage checks require Supabase's API to be reachable and administrator-role setup; they have not been verified here.
