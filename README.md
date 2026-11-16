# Govt. Boys H. S. School Cantt, Guna — website & CMS

Bilingual React/Vite school website with Supabase Auth, a protected content manager, public contact submissions, and Supabase Storage. Admin entry: `/Lakshya-admin`.

## Development

```sh
npm ci
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

The public site retains its in-app school defaults if no CMS record has been published yet. CMS changes and contact submissions require the configured Supabase project. There is no local or default-password admin bypass.

## Supabase project

This repository is configured for the connected Supabase project in the local ignored `.env.local`; never commit that file or a service-role key. For another environment, use the Supabase project URL and publishable/anon key only.

Applied migrations:

- `20261116000000_school_cms.sql`: published CMS JSON row, RLS and public school media bucket with admin-only write policies.
- `20261116090000_contact_messages.sql`: validated contact submissions, admin-only reading, public insert, and an email-based database rate limit of three messages per hour.

The matching migrations were applied through the connected Supabase integration. Public users may read the published site CMS and submit contact messages, but cannot modify CMS content, read private contact messages, or upload media. Admin writes are limited by trusted `app_metadata.role = school_admin`. Public sign-up is disabled. Do not grant the admin role through user-editable `user_metadata`.

## Admin

The CMS uses Supabase email/password authentication and checks trusted `app_metadata.role` both on login and before publishing. The admin route is not a security boundary by itself. Add or manage admin accounts in Supabase Auth; keep passwords out of source control and chat. The existing school-admin account is maintained in Supabase; the application does not create accounts.

## Deployment

Vercel build command: `npm run build`; output directory: `dist`. `vercel.json` configures SPA fallback, and dynamic sitemap/robots handlers are in `api/`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Production, Preview, and Development environments. After the production hostname exists, update Supabase Auth Site URL/redirect allowlist to that domain. No Vercel project is attached yet, so there is no live production URL.

## Verification

`npm run build`, `npx tsc --noEmit`, and `npm audit --audit-level=high` pass. Supabase migration history and project health were checked; anonymous contact insert/delete and an admin-claim RLS CRUD transaction passed, while an anonymous CMS write was denied. Live browser login and image upload still require an interactive signed-in browser session.
