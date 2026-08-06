import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, hi, type Content, type Lang } from "@/i18n/content";
import { loadSiteData, fetchFromSupabase, type SiteData } from "@/lib/storage";

type LanguageValue = {
  lang: Lang;
  t: Content;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  cms: SiteData;
  refreshCMS: () => void;
};

const LanguageContext = createContext<LanguageValue | null>(null);
const LANG_KEY = "gbhss-lang";

function readLang(): Lang {
  try {
    const s = localStorage.getItem(LANG_KEY);
    return s === "hi" || s === "en" ? s : "en";
  } catch { return "en"; }
}

function mergeContent(lang: Lang, cms: SiteData): Content {
  const base = structuredClone(lang === "en" ? en : hi) as Record<string, unknown>;
  const meta = base.meta as Record<string, unknown>;
  const footer = base.footer as Record<string, unknown>;
  if (cms.settings.schoolName) (meta as Record<string, string>).schoolName = cms.settings.schoolName;
  if (cms.settings.schoolNameCaps) (meta as Record<string, string>).schoolNameCaps = cms.settings.schoolNameCaps;
  if (cms.settings.schoolPlace) (meta as Record<string, string>).schoolPlace = cms.settings.schoolPlace;
  if (cms.settings.footerAbout) (footer as Record<string, string>).about = cms.settings.footerAbout;
  if (cms.settings.footerDevCredit) (footer as Record<string, string>).devCredit = cms.settings.footerDevCredit;
  return base as unknown as Content;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);
  const [cms, setCMS] = useState<SiteData>(loadSiteData);
  const [t, setT] = useState<Content>(() => mergeContent(lang, cms));

  // On lang change: update document, rebuild merged content
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      document.title = lang === "hi"
        ? "शा. बालक उ. मा. विद्यालय कैंट, गुना | EFA शासकीय विद्यालय"
        : "Govt. Boys H. S. School Cantt, Guna | EFA Government School";
      localStorage.setItem(LANG_KEY, lang);
    } catch { /* */ }
    setT(mergeContent(lang, loadSiteData()));
  }, [lang]);

  // Load fresh content from Supabase database on mount
  useEffect(() => {
    fetchFromSupabase().then((supabaseData) => {
      if (supabaseData) {
        setCMS(supabaseData);
        setT(mergeContent(lang, supabaseData));
      }
    });
  }, [lang]);

  // Poll CMS changes every 2 seconds (very cheap, just reads localStorage)
  useEffect(() => {
    const id = setInterval(() => {
      const fresh = loadSiteData();
      setCMS((prev) => {
        if (JSON.stringify(fresh) !== JSON.stringify(prev)) {
          setT(mergeContent(lang, fresh));
          return fresh;
        }
        return prev;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === "en" ? "hi" : "en")), []);
  const refreshCMS = useCallback(() => {
    const fresh = loadSiteData();
    setCMS(fresh);
    setT(mergeContent(lang, fresh));
  }, [lang]);

  const value = useMemo<LanguageValue>(
    () => ({ lang, t, setLang, toggleLang, cms, refreshCMS }),
    [lang, t, setLang, toggleLang, cms, refreshCMS],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside <LanguageProvider>");
  return ctx;
}

export function useT(): Content {
  return useLanguage().t;
}
