/**
 * Backup helpers — export/import the complete site data as one JSON file.
 */
import type { SiteData } from "@/cms/lib/types";

export function downloadSiteData(d: SiteData) {
  const blob = new Blob([JSON.stringify(d, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gbhss-content-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseSiteData(text: string): SiteData | null {
  try {
    const d: unknown = JSON.parse(text);
    if (!d || typeof d !== "object") return null;
    const o = d as Record<string, unknown>;
    if (
      !o.en ||
      !o.hi ||
      !o.images ||
      !Array.isArray(o.teachers) ||
      !Array.isArray(o.notices) ||
      !Array.isArray(o.gallery) ||
      !o.settings
    ) {
      return null;
    }
    return d as SiteData;
  } catch {
    return null;
  }
}

export function siteDataSizeKB(d: SiteData): number {
  try {
    return Math.round(JSON.stringify(d).length / 1024);
  } catch {
    return 0;
  }
}
