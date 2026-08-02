# 🏫 Govt. Boys H. S. School Cantt, Guna — Website + Admin CMS

A premium single-page school website with a fully integrated, production-grade
admin content management system (CMS).

- **Website** → `#` (home)
- **Admin CMS** → `#/lakshya-admin` (password protected)

---

## ✨ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 · Vite 7 · TypeScript · Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query |
| Toasts | React Hot Toast |
| Backend | Supabase (Postgres · Storage · Realtime-ready) |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure Supabase — copy .env.example to .env and fill in:
#    VITE_SUPABASE_URL=
#    VITE_SUPABASE_ANON_KEY=
#    Then run supabase/schema.sql in Supabase Dashboard → SQL Editor.

# 3. Start development
npm run dev

# 4. Build for production
npm run build
```

> **No Supabase? No problem.** If the env vars are missing, the site and the
> admin CMS automatically fall back to `localStorage` — everything keeps
> working (content is simply stored in the browser).

---

## 🔐 Admin Panel

Open: `http://localhost:5173/#/lakshya-admin`

- **Default password:** `Lakshya@123`
- Change it from **Admin Settings → Website Settings → Change Admin Password**
  (stored as an override in this browser; the default lives in
  `src/config/admin.ts`).
- Session persists in `localStorage` — refresh never re-asks.
- **Logout** clears the session.

### Admin Modules

| Module | What you can do |
|---|---|
| Dashboard | Stats, content distribution, recent activity, publish status |
| Content sections | Edit **every** text: General/Identity, Navigation, Hero, About, Principal, Highlights, Facilities, Vocational Education, Achievements, Gallery/Notice headings, Footer — in **English and हिन्दी** with live preview |
| Teachers | Add / edit / delete, photo upload (Supabase Storage), qualification, experience, designation, subject, drag & drop ordering, search |
| Gallery | Multi-image upload (auto-compression), delete, reorder (drag + arrows), categories, search, preview |
| Notice Board | Create / edit / delete, pin, important badge, **published/draft** status, publish/expiry dates, search, filters |
| Website Settings | School name, logo, favicon, principal photo, address, phone, email, social links, theme color |
| Backup & Restore | Export one master JSON, import it on any device, reset to defaults |

### Publish Flow

1. Edit any content → a **gold "Publish Changes"** button appears in the top bar.
2. Click it → data is written to Supabase (or localStorage fallback) → the
   public website updates **instantly** — no code edits, no page reload.

---

## 🗄️ Supabase Setup (optional but recommended)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into `.env`
   (Project Settings → API).
3. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.

The migration creates:

- `site_sections` — normalized content rows (`lang`, `key`, `data`) — one row
  per language per section (no single JSON blob).
- `site_settings` — branding/contact settings + last-published stamp.
- `teachers` — id, name, subject, qualification, experience, designation,
  photo_url, sort_order (indexed).
- `notices` — tag, title, body, pinned, important, status (published/draft),
  publish/expiry dates (indexed).
- `gallery` — src, title, caption, category, sort_order (indexed).
- Row Level Security policies (public read; write open to anon for
  zero-setup dev — **harden in production** by replacing write policies with
  `auth.role() = 'authenticated'` after enabling Supabase Auth).
- Storage bucket `school-images` (public) + object policies.
- Seed data (settings row + 4 default notices).

Images (teacher photos, gallery, logo, favicon, principal photo) upload
directly to **Supabase Storage** with cache-control headers; the returned
public URL is stored in the database.

---

## 📁 Folder Structure

```
src/
├── App.tsx                  # Hash router: # → website, #/lakshya-admin → CMS
├── i18n/                    # Bilingual content (EN/HI) + LanguageContext
├── data/                    # Static data, default images
├── components/              # Public website components
├── cms/                     # ★ Admin CMS (new)
│   ├── App.tsx              #   CMS entry (providers + hash routing)
│   ├── Login.tsx            #   Password login (glassmorphism)
│   ├── Shell.tsx            #   Sidebar + topbar + publish button
│   ├── context.tsx          #   Auth, draft, publish, activity (TanStack Query)
│   ├── SchemaEditor.tsx     #   Schema-driven recursive field editor
│   ├── ui.tsx               #   Reusable UI kit (Card, Modal, Toggle, …)
│   ├── lib/
│   │   ├── types.ts         #   Shared types + default site data
│   │   ├── supabase.ts      #   Supabase client singleton
│   │   ├── repository.ts    #   Data layer (Supabase + localStorage fallback)
│   │   ├── storage.ts       #   Image upload/delete (Supabase Storage)
│   │   ├── schemas.ts       #   Zod validation schemas
│   │   ├── sections.ts      #   Editable-section schema definitions
│   │   └── backup.ts        #   JSON export/import helpers
│   └── pages/               #   Dashboard, Section editor, Teachers,
│                             #   Gallery, Notices, Settings, Backup
├── config/                  # env + admin password
└── utils/                   # cn() helper
supabase/
└── schema.sql               # Full migration (tables, RLS, storage, seed)
```

---

## ☁️ Deployment Guide

### Vercel / Netlify (SPA)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   in the dashboard (or rely on localStorage fallback).
4. No redirect rules needed — routing is hash-based (`#/...`).

### Any static host (GitHub Pages, etc.)

Upload the `dist/` folder. Hash routing works from any path — no server
rewrites required.

### Moving from localStorage to Supabase

1. Fill `.env` with your Supabase credentials.
2. Run `supabase/schema.sql` once.
3. Open the admin panel → **Backup & Restore** → *Download Backup* (from the
   old device), then *Import* on the new device → **Publish Changes**.

---

## 🛡️ Error Handling

- The site is wrapped in a global **Error Boundary** — a runtime error shows a
  premium fallback page with the error details, never a white screen.
- Every async operation (fetch, publish, upload, reset) is wrapped in
  `try/catch` and surfaces via **toast notifications**.
- If Supabase is unreachable or unconfigured, the repository automatically
  falls back to `localStorage` and logs a meaningful error to the console.

---

## ✅ Validation Checklist

- [x] `npm install` works
- [x] `npm run dev` works
- [x] `npm run build` works (zero TypeScript errors)
- [x] Admin login (`#/lakshya-admin`) works
- [x] Image upload → Supabase Storage (or local fallback)
- [x] Full CRUD: teachers, gallery, notices, sections, settings
- [x] Publish → website updates instantly
- [x] Mobile responsive (sidebar drawer, grids)
- [x] No React runtime errors / no white screen (Error Boundary)
- [x] No placeholder code, no broken imports, no missing dependencies

---

Made with ❤️ for Govt. Boys H. S. School Cantt, Guna.
