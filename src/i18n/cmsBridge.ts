/**
 * CMS Bridge — connects the async Supabase-driven store to the public website.
 */
import { loadData, type AllSiteData } from "@/admin/store";
import type { Content } from "@/i18n/content";
import { en, hi } from "@/i18n/content";

export interface PublicSiteData {
  content: Content;
  cms: AllSiteData;
}

let cached: { data: AllSiteData; ts: number } | null = null;

export async function readCMS(): Promise<AllSiteData> {
  const now = Date.now();
  if (cached && now - cached.ts < 500) return cached.data;
  const data = await loadData();
  cached = { data, ts: now };
  return data;
}

export function refreshCMS() {
  cached = null;
}

export async function getPublicSiteData(lang: "en" | "hi"): Promise<PublicSiteData> {
  const cms = await readCMS();

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
