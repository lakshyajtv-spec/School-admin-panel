/**
 * Site content repository — the ONLY data access layer for website content.
 *
 * Data sources (priority order):
 *   1. Supabase (when configured) — shared live database + storage
 *   2. localStorage  (when Supabase is NOT configured) — offline/demo fallback
 *   3. Built-in defaults (first paint / empty storage)
 *
 * Every operation is wrapped in try/catch: a backend failure can NEVER crash
 * the UI — it simply falls back to the previous source and logs the error.
 */
import type {
  GalleryRecord,
  NoticeRecord,
  SiteData,
  SiteSettings,
  TeacherRecord,
} from "@/cms/lib/types";
import type { Content } from "@/i18n/content";
import { defaultSiteData } from "@/cms/lib/types";
import { supabase, isSupabaseConfigured } from "@/cms/lib/supabase";

export interface PublishResult {
  ok: boolean;
  error?: string;
}

/* ------------------------------ safe utils ------------------------------ */

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Deep-merge `patch` onto `base`. null/undefined patch values keep base. */
export function deepMerge<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base;
  if (isPlainObject(base) && isPlainObject(patch)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(patch)) {
      const pv = patch[key];
      if (pv === undefined || pv === null) continue;
      out[key] = deepMerge(base[key], pv);
    }
    return out as T;
  }
  if (Array.isArray(base) && Array.isArray(patch)) {
    return (patch.length > 0 ? patch : base) as T;
  }
  return patch as T;
}

/** structuredClone with JSON fallback — can never throw. */
export function safeClone<T>(v: T): T {
  try {
    return structuredClone(v);
  } catch {
    try {
      return JSON.parse(JSON.stringify(v)) as T;
    } catch {
      return v;
    }
  }
}

/* ------------------------- localStorage fallback ------------------------- */

const LOCAL_KEY = "gbhss-site-data-v2";

function normalize(d: SiteData): SiteData {
  d.teachers = (d.teachers ?? []).map((t) => ({
    id: t.id,
    name: t.name ?? "",
    subject: t.subject ?? "",
    qualification: t.qualification ?? "",
    experience: t.experience ?? "",
    designation: t.designation ?? "",
    photo: t.photo ?? "",
  }));
  d.notices = (d.notices ?? []).map((n) => ({
    id: n.id,
    tag: n.tag ?? "",
    date: n.date ?? "",
    title: n.title ?? "",
    body: n.body ?? "",
    pinned: !!n.pinned,
    important: !!n.important,
    status: n.status === "draft" ? "draft" : "published",
    publishDate: n.publishDate ?? "",
    expiryDate: n.expiryDate ?? "",
  }));
  d.gallery = (d.gallery ?? []).map((g) => ({
    id: g.id,
    src: g.src ?? "",
    title: g.title ?? "",
    caption: g.caption ?? "",
    category: g.category ?? "",
  }));
  const base = defaultSiteData();
  d.settings = deepMerge(base.settings, d.settings ?? {}) as SiteSettings;
  return d;
}

function isSiteDataShape(o: unknown): o is SiteData {
  if (!isPlainObject(o)) return false;
  return (
    isPlainObject(o.en) &&
    isPlainObject(o.hi) &&
    isPlainObject(o.images) &&
    isPlainObject(o.settings) &&
    Array.isArray(o.teachers) &&
    Array.isArray(o.notices) &&
    Array.isArray(o.gallery)
  );
}

export function loadLocalData(): SiteData | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSiteDataShape(parsed) ? normalize(parsed) : null;
  } catch {
    return null;
  }
}

export function saveLocalData(d: SiteData) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(d));
  } catch {
    /* storage full/unavailable */
  }
}

export function clearLocalData() {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------ row mapping ------------------------------ */

interface TeacherRow {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  designation: string;
  photo_url: string;
}
interface NoticeRow {
  id: string;
  tag: string;
  date: string;
  title: string;
  body: string;
  pinned: boolean;
  important: boolean;
  status: string;
  publish_date: string;
  expiry_date: string;
}
interface GalleryRow {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: string;
}

const mapTeacher = (r: TeacherRow): TeacherRecord => ({
  id: r.id,
  name: r.name ?? "",
  subject: r.subject ?? "",
  qualification: r.qualification ?? "",
  experience: r.experience ?? "",
  designation: r.designation ?? "",
  photo: r.photo_url ?? "",
});

const mapNotice = (r: NoticeRow): NoticeRecord => ({
  id: r.id,
  tag: r.tag ?? "",
  date: r.date ?? "",
  title: r.title ?? "",
  body: r.body ?? "",
  pinned: r.pinned ?? false,
  important: r.important ?? false,
  status: r.status === "draft" ? "draft" : "published",
  publishDate: r.publish_date ?? "",
  expiryDate: r.expiry_date ?? "",
});

const mapGallery = (r: GalleryRow): GalleryRecord => ({
  id: r.id,
  src: r.src ?? "",
  title: r.title ?? "",
  caption: r.caption ?? "",
  category: r.category ?? "",
});

/* ------------------------------ fetch ------------------------------ */

/** Assemble the full site data from normalized section rows. */
function assembleSections(
  d: SiteData,
  rows: { lang: string; key: string; data: unknown }[],
) {
  for (const r of rows) {
    if (!isPlainObject(r.data)) continue;
    if (r.lang === "en" || r.lang === "hi") {
      const tree = (r.lang === "en" ? d.en : d.hi) as unknown as Record<
        string,
        unknown
      >;
      if (r.key in tree) {
        tree[r.key] = deepMerge(tree[r.key], r.data);
      } else if (r.key === "images") {
        d.images = deepMerge(d.images, r.data);
      }
    } else if (r.lang === "global" && r.key === "images") {
      d.images = deepMerge(d.images, r.data);
    }
  }
}

export async function fetchSiteData(): Promise<SiteData> {
  // Source 1: Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const d = defaultSiteData();

      const { data: sections, error: secErr } = await supabase
        .from("site_sections")
        .select("lang,key,data");
      if (secErr) throw secErr;
      if (sections?.length) {
        assembleSections(d, sections as { lang: string; key: string; data: unknown }[]);
      }

      const { data: settingsRows } = await supabase
        .from("site_settings")
        .select("key,data");
      if (settingsRows?.length) {
        for (const s of settingsRows as { key: string; data: unknown }[]) {
          if (s.key === "main") {
            d.settings = deepMerge(d.settings, s.data) as SiteSettings;
          } else if (s.key === "publishedAt" && typeof s.data === "string") {
            d.publishedAt = s.data;
          }
        }
      }

      const { data: teachers } = await supabase
        .from("teachers")
        .select("*")
        .order("sort_order", { ascending: true });
      if (teachers?.length) d.teachers = (teachers as TeacherRow[]).map(mapTeacher);

      const { data: notices } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: true });
      if (notices?.length) d.notices = (notices as NoticeRow[]).map(mapNotice);

      const { data: gallery } = await supabase
        .from("gallery")
        .select("*")
        .order("sort_order", { ascending: true });
      if (gallery?.length) d.gallery = (gallery as GalleryRow[]).map(mapGallery);

      return d;
    } catch (err) {
      console.error("[cms/repository] Supabase fetch failed — falling back:", err);
    }
  }

  // Source 2: localStorage
  const local = loadLocalData();
  if (local) return local;

  // Source 3: defaults
  return defaultSiteData();
}

/* ------------------------------ publish ------------------------------ */

async function replaceTable<T extends { id: string }>(
  table: string,
  rows: T[],
): Promise<Error | null> {
  const db = supabase;
  if (!db) return null;
  if (rows.length) {
    const { error } = await db.from(table).upsert(rows);
    if (error) return error;
    const { error: delErr } = await db
      .from(table)
      .delete()
      .not("id", "in", rows.map((r) => r.id));
    if (delErr) return delErr;
  } else {
    const { error } = await db.from(table).delete().neq("id", "-");
    if (error) return error;
  }
  return null;
}

/** Flatten en/hi content trees into per-section rows (normalized). */
function flattenTree(
  lang: "en" | "hi",
  tree: Content,
): { lang: string; key: string; data: unknown; updated_at: string }[] {
  const now = new Date().toISOString();
  const o = tree as unknown as Record<string, unknown>;
  return Object.keys(o).map((key) => ({
    lang,
    key,
    data: o[key],
    updated_at: now,
  }));
}

export async function publishSiteData(d: SiteData): Promise<PublishResult> {
  // Not configured → persist locally (demo/offline mode), never throw.
  if (!isSupabaseConfigured || !supabase) {
    saveLocalData(d);
    console.info("[cms/repository] Supabase not configured — saved to localStorage.");
    return { ok: true };
  }

  try {
    const now = new Date().toISOString();
    const sections = [
      ...flattenTree("en", d.en),
      ...flattenTree("hi", d.hi),
      { lang: "global", key: "images", data: d.images, updated_at: now },
    ];
    const { error: secErr } = await supabase.from("site_sections").upsert(sections);
    if (secErr) throw new Error(secErr.message);

    const { error: setErr } = await supabase.from("site_settings").upsert([
      { key: "main", data: d.settings, updated_at: now },
      { key: "publishedAt", data: d.publishedAt ?? null, updated_at: now },
    ]);
    if (setErr) throw new Error(setErr.message);

    const tErr = await replaceTable(
      "teachers",
      d.teachers.map((t, i) => ({
        id: t.id,
        name: t.name,
        subject: t.subject,
        qualification: t.qualification,
        experience: t.experience,
        designation: t.designation,
        photo_url: t.photo,
        sort_order: i,
      })),
    );
    if (tErr) throw new Error(tErr.message);

    const nErr = await replaceTable(
      "notices",
      d.notices.map((n) => ({
        id: n.id,
        tag: n.tag,
        date: n.date,
        title: n.title,
        body: n.body,
        pinned: n.pinned,
        important: n.important,
        status: n.status,
        publish_date: n.publishDate,
        expiry_date: n.expiryDate,
      })),
    );
    if (nErr) throw new Error(nErr.message);

    const gErr = await replaceTable(
      "gallery",
      d.gallery.map((g, i) => ({
        id: g.id,
        src: g.src,
        title: g.title,
        caption: g.caption,
        category: g.category,
        sort_order: i,
      })),
    );
    if (gErr) throw new Error(gErr.message);

    // Local cache so the website still works offline.
    saveLocalData(d);
    return { ok: true };
  } catch (err) {
    console.error("[cms/repository] Publish failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/* ------------------------------ reset ------------------------------ */

/** Delete all content (Supabase + localStorage) and return fresh defaults. */
export async function resetAllData(): Promise<SiteData> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("site_sections").delete().neq("lang", "-");
      await supabase.from("site_settings").delete().neq("key", "-");
      await supabase.from("teachers").delete().neq("id", "-");
      await supabase.from("notices").delete().neq("id", "-");
      await supabase.from("gallery").delete().neq("id", "-");
    } catch (err) {
      console.error("[cms/repository] Reset failed:", err);
    }
  }
  clearLocalData();
  return defaultSiteData();
}
