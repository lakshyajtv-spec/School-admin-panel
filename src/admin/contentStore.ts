/**
 * Admin data store.
 * - Site data (EN + HI content + images) is persisted to localStorage.
 * - The main website reads from this store at runtime, so admin edits
 *   appear on the website instantly — no code changes required.
 * - Export/Import JSON lets you move content to any device/browser.
 */
import { en, hi, type Content } from "@/i18n/content";
import { DEFAULT_IMAGES } from "@/data/site";

export interface ImageSet {
  hero: string;
  heroCard: string;
  aboutA: string;
  aboutB: string;
  gallery: string[];
}

export interface SiteData {
  en: Content;
  hi: Content;
  images: ImageSet;
}

const STORE_KEY = "gbhss-site-data-v1";
const PASS_KEY = "gbhss-admin-pass";
const SESSION_KEY = "gbhss-admin-session";

export const DEFAULT_PASSWORD = "admin123";

export function defaultSiteData(): SiteData {
  return {
    en: structuredClone(en) as unknown as Content,
    hi: structuredClone(hi) as unknown as Content,
    images: {
      ...DEFAULT_IMAGES,
      gallery: [...DEFAULT_IMAGES.gallery],
    },
  };
}

function isValidSiteData(d: unknown): d is SiteData {
  if (!d || typeof d !== "object") return false;
  const o = d as Record<string, unknown>;
  const en = o.en as Record<string, unknown> | undefined;
  const hi = o.hi as Record<string, unknown> | undefined;
  const img = o.images as Record<string, unknown> | undefined;
  return (
    !!en &&
    !!hi &&
    !!img &&
    typeof en === "object" &&
    typeof hi === "object" &&
    typeof img === "object" &&
    typeof en.meta === "object" &&
    typeof en.hero === "object" &&
    typeof hi.meta === "object" &&
    typeof hi.hero === "object" &&
    typeof img.hero === "string" &&
    typeof img.gallery === "object" &&
    img.gallery !== null &&
    typeof (img.gallery as unknown[]).length === "number"
  );
}

export function loadSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidSiteData(parsed)) return parsed;
    }
  } catch {
    /* corrupted or unavailable — fall through to defaults */
  }
  return defaultSiteData();
}

export function persistSiteData(d: SiteData) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(d));
  } catch {
    /* storage full/unavailable — ignore */
  }
}

export function resetSiteData(): SiteData {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
  return defaultSiteData();
}

export function downloadSiteData(d: SiteData) {
  const blob = new Blob([JSON.stringify(d, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gbhss-content.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseSiteData(text: string): SiteData | null {
  try {
    const d = JSON.parse(text);
    return isValidSiteData(d) ? d : null;
  } catch {
    return null;
  }
}

/* ---------- Simple client-side auth ---------- */

export function getPassword(): string {
  try {
    return localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export function setPassword(p: string) {
  try {
    localStorage.setItem(PASS_KEY, p);
  } catch {
    /* ignore */
  }
}

export function isAuthed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAuthed(v: boolean) {
  try {
    if (v) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
