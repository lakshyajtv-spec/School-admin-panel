import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type Content, type Lang } from "@/i18n/content";
import { getPublicSiteData, refreshCMS, type PublicSiteData } from "@/i18n/cmsBridge";
import { loadData, saveData, type AllSiteData } from "@/admin/store";

type LanguageValue = {
  lang: Lang;
  t: Content;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Full CMS data — updated on every render from localStorage */
  cms: AllSiteData;
  /** Update CMS and save to localStorage + refresh public content */
  updateCMS: (d: AllSiteData) => void;
};

const LanguageContext = createContext<LanguageValue | null>(null);

const LANG_KEY = "gbhss-lang";

function readInitialLang(): Lang {
  try {
    const stored = window.localStorage.getItem(LANG_KEY);
    return stored === "hi" || stored === "en" ? stored : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);
  const [siteData, setSiteData] = useState<PublicSiteData>(() => getPublicSiteData(lang));

  // Rebuild public content whenever lang or CMS data changes externally
  const rebuild = useCallback((l: Lang) => {
    refreshCMS();
    setSiteData(getPublicSiteData(l));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      document.title =
        lang === "hi"
          ? "शा. बालक उ. मा. विद्यालय कैंट, गुना | EFA शासकीय विद्यालय"
          : "Govt. Boys H. S. School Cantt, Guna | EFA Government School";
    } catch { /* ignore */ }
    try { window.localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
    rebuild(lang);
  }, [lang, rebuild]);

  // Poll localStorage for CMS changes from the admin panel (lightweight — every 1s)
  useEffect(() => {
    const id = window.setInterval(() => {
      const fresh = loadData();
      const current = siteData.cms;
      // Quick reference-equality check on settings + array lengths
      if (
        fresh.settings.schoolName !== current.settings.schoolName ||
        fresh.teachers.length !== current.teachers.length ||
        fresh.gallery.length !== current.gallery.length ||
        fresh.notices.length !== current.notices.length ||
        fresh.facilities.length !== current.facilities.length ||
        fresh.achievements.length !== current.achievements.length ||
        fresh.vocational.courses.length !== current.vocational.courses.length
      ) {
        rebuild(lang);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [lang, siteData.cms, rebuild]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((l) => (l === "en" ? "hi" : "en")),
    [],
  );

  const updateCMS = useCallback((d: AllSiteData) => {
    saveData(d);
    rebuild(lang);
  }, [lang, rebuild]);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      t: siteData.content,
      setLang,
      toggleLang,
      cms: siteData.cms,
      updateCMS,
    }),
    [lang, siteData, setLang, toggleLang, updateCMS],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}

/** Shorthand — only the translated content tree */
export function useT(): Content {
  return useLanguage().t;
}
