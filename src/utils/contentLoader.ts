import { en as builtin, hi as builtinHi, type Content } from "@/i18n/content";

type LangData = { en: Content; hi: Content };

let cached: LangData | null = null;
let fetchPromise: Promise<LangData> | null = null;

async function loadExternal(): Promise<LangData> {
  const res = await fetch("/site-data.json", {
    cache: "no-cache",
  });
  if (!res.ok) throw new Error(`site-data.json ${res.status}`);
  const json = await res.json();
  // Sanity: must have both locales
  if (!json?.en || !json?.hi) throw new Error("Missing en/hi in site-data.json");
  // Merge with builtin so any missing keys fall back to builtin defaults
    return {
      en: { ...builtin, ...json.en } as unknown as Content,
      hi: { ...builtinHi, ...json.hi } as unknown as Content,
    } as LangData;
}

/** Returns EN+HI content; tries external JSON first, falls back to builtin. */
export async function loadContent(): Promise<LangData> {
  if (cached) return cached;
  if (!fetchPromise) {
    fetchPromise = loadExternal()
      .then((d) => {
        cached = d;
        return d;
      })
      .catch(() => {
        // Silent fallback — use builtin content
        const fallback: LangData = { en: builtin as unknown as Content, hi: builtinHi as unknown as Content };
        cached = fallback;
        return fallback;
      })
      .finally(() => {
        fetchPromise = null;
      });
  }
  return fetchPromise;
}

/** Synchronous getter — returns cached data or builtin if not loaded yet. */
export function getContentSync(): LangData {
  if (cached) return cached;
  return { en: builtin as unknown as Content, hi: builtinHi as unknown as Content };
}

/** For the admin panel: returns the raw JSON from site-data.json */
export async function getRawJSON(): Promise<string> {
  try {
    const res = await fetch("/site-data.json", { cache: "no-cache" });
    return await res.text();
  } catch {
    return JSON.stringify({ en: builtin, hi: builtinHi }, null, 2);
  }
}
