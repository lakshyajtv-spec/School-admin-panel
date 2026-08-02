import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import { en, hi, type Content, type Lang } from "@/i18n/content";
import { getPublicSiteData, refreshCMS, type PublicSiteData } from "@/i18n/cmsBridge";
import { loadData, saveData, type AllSiteData } from "@/admin/store";

type LanguageValue = {
  lang: Lang;
  t: Content;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  cms: AllSiteData;
  updateCMS: (d: AllSiteData) => void;
};

const LanguageContext = createContext<LanguageValue | null>(null);
const LANG_KEY = "gbhss-lang";

function readInitialLang(): Lang {
  try {
    const stored = window.localStorage.getItem(LANG_KEY);
    return stored === "hi" || stored === "en" ? stored : "en";
  } catch { return "en"; }
}

/** Fallback content returned while async data loads */
function fallbackSiteData(lang: "en" | "hi"): PublicSiteData {
  const base = structuredClone(lang === "en" ? en : hi) as Record<string, unknown>;
  return {
    content: base as unknown as Content,
    cms: {
      settings: { schoolName: "", schoolNameCaps: "", schoolPlace: "", logoUrl: "", favicon: "", address: "", phone: "", email: "", mapEmbed: "", socialLinks: [], footerAbout: "", footerDevCredit: "" },
      hero: {}, about: {}, principal: {}, highlights: {},
      teachers: [], gallery: [], notices: [], facilities: [], achievements: [],
      vocational: { eyebrow: "", title: "", highlight: "", desc: "", courses: [] },
    },
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);
  const [siteData, setSiteData] = useState<PublicSiteData>(() => fallbackSiteData(lang));

  // Initial async load — non-blocking, children render immediately with fallback
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPublicSiteData(lang);
        if (!cancelled) setSiteData(data);
      } catch (err) {
        console.warn("[LanguageProvider] Initial load failed, using fallback:", err);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild on language change
  useEffect(() => {
    document.documentElement.lang = lang;
    try { window.localStorage.setItem(LANG_KEY, lang); } catch { /* */ }
    let cancelled = false;
    (async () => {
      try {
        refreshCMS();
        const data = await getPublicSiteData(lang);
        if (!cancelled) {
          setSiteData(data);
          try {
            document.title = lang === "hi"
              ? "शा. बालक उ. मा. विद्यालय कैंट, गुना | EFA शासकीय विद्यालय"
              : "Govt. Boys H. S. School Cantt, Guna | EFA Government School";
          } catch { /* */ }
        }
      } catch (err) {
        console.warn("[LanguageProvider] Rebuild failed:", err);
      }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  // Lightweight polling — updates CMS in background, never blocks
  useEffect(() => {
    const id = window.setInterval(() => {
      loadData()
        .then((fresh) => {
          setSiteData((prev) => {
            try {
              if (
                !prev ||
                fresh.settings.schoolName !== prev.cms.settings.schoolName ||
                fresh.teachers.length !== prev.cms.teachers.length ||
                fresh.gallery.length !== prev.cms.gallery.length ||
                fresh.notices.length !== prev.cms.notices.length ||
                fresh.facilities.length !== prev.cms.facilities.length ||
                fresh.achievements.length !== prev.cms.achievements.length ||
                fresh.vocational.courses.length !== prev.cms.vocational.courses.length
              ) {
                return getPublicSiteDataSync(lang, fresh);
              }
            } catch { /* */ }
            return prev;
          });
        })
        .catch((err) => console.warn("[LanguageProvider] Poll failed:", err));
    }, 2000);
    return () => window.clearInterval(id);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((l) => (l === "en" ? "hi" : "en")),
    [],
  );

  const updateCMS = useCallback(
    (d: AllSiteData) => {
      saveData(d).catch(console.error);
      refreshCMS();
      getPublicSiteData(lang)
        .then((data) => setSiteData(data))
        .catch(console.error);
    },
    [lang],
  );

  const value = useMemo<LanguageValue>(
    () => ({ lang, t: siteData.content, setLang, toggleLang, cms: siteData.cms, updateCMS }),
    [lang, siteData, setLang, toggleLang, updateCMS],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Sync version — no external dependencies */
function getPublicSiteDataSync(lang: "en" | "hi", cms: AllSiteData): PublicSiteData {
  try {
    const base = structuredClone(lang === "en" ? en : hi) as Record<string, unknown>;
    const meta = base.meta as Record<string, unknown>;
    const footer = base.footer as Record<string, unknown>;
    if (cms.settings.schoolName) (meta as Record<string, string>).schoolName = cms.settings.schoolName;
    if (cms.settings.schoolNameCaps) (meta as Record<string, string>).schoolNameCaps = cms.settings.schoolNameCaps;
    if (cms.settings.schoolPlace) (meta as Record<string, string>).schoolPlace = cms.settings.schoolPlace;
    if (cms.settings.footerAbout) (footer as Record<string, string>).about = cms.settings.footerAbout;
    if (cms.settings.footerDevCredit) (footer as Record<string, string>).devCredit = cms.settings.footerDevCredit;
    return { content: base as unknown as Content, cms };
  } catch {
    return fallbackSiteData(lang);
  }
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside <LanguageProvider>");
  return ctx;
}

export function useT(): Content {
  return useLanguage().t;
}
