/**
 * CMS Bridge — connects the admin panel's CMS store to the public website.
 *
 * Every public component that needs dynamic data (teachers, gallery, notices,
 * facilities, achievements, vocational courses, website settings) reads from
 * the CMS store. When the admin saves in the admin panel, this bridge exposes
 * the latest data to all components.
 *
 * The i18n content dictionary remains the source for translatable TEXT, but
 * entity lists (teachers, gallery, notices etc.) come from the CMS store.
 */

import { loadData, type AllSiteData } from "@/admin/store";
import type { Content } from "@/i18n/content";
import { en, hi } from "@/i18n/content";

export interface PublicSiteData {
  /** Combined — CMS overrides + i18n fallback */
  content: Content;
  cms: AllSiteData;
}

let cached: { data: AllSiteData; ts: number } | null = null;

/** Read the latest CMS data (with 500ms debounce cache for performance) */
export function readCMS(): AllSiteData {
  const now = Date.now();
  if (cached && now - cached.ts < 500) return cached.data;
  cached = { data: loadData(), ts: now };
  return cached.data;
}

/** Clear cache — call after admin publish */
export function refreshCMS() {
  cached = null;
}

/**
 * Build the public site data object.
 * Merges CMS settings into the i18n content dictionary where applicable.
 */
export function getPublicSiteData(lang: "en" | "hi"): PublicSiteData {
  const cms = readCMS();

  // Clone the i18n base, then override with CMS settings where available
  const base = structuredClone(lang === "en" ? en : hi) as Record<string, unknown>;
  const meta = base.meta as Record<string, unknown>;
  const footer = base.footer as Record<string, unknown>;

  if (cms.settings.schoolName) (meta as Record<string, string>).schoolName = cms.settings.schoolName;
  if (cms.settings.schoolNameCaps) (meta as Record<string, string>).schoolNameCaps = cms.settings.schoolNameCaps;
  if (cms.settings.schoolPlace) (meta as Record<string, string>).schoolPlace = cms.settings.schoolPlace;
  if (cms.settings.footerAbout) (footer as Record<string, string>).about = cms.settings.footerAbout;
  if (cms.settings.footerDevCredit) (footer as Record<string, string>).devCredit = cms.settings.footerDevCredit;

  return { content: base as unknown as Content, cms };
}
