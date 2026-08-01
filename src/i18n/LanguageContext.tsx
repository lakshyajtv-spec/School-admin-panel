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
import {
  loadSiteData,
  persistSiteData,
  type SiteData,
} from "@/admin/contentStore";

type LanguageValue = {
  lang: Lang;
  t: Content;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Full editable site data (EN + HI + images) — backed by localStorage. */
  siteData: SiteData;
  saveSiteData: (d: SiteData) => void;
  refreshSiteData: () => void;
};

const LanguageContext = createContext<LanguageValue | null>(null);

const STORAGE_KEY = "gbhss-lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "hi" || stored === "en" ? stored : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);
  const [siteData, setSiteData] = useState<SiteData>(loadSiteData);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      document.title =
        lang === "hi"
          ? "शा. बालक उ. मा. विद्यालय कैंट, गुना | सर्व शिक्षा (EFA) शासकीय विद्यालय"
          : "Govt. Boys H. S. School Cantt, Guna | EFA Government School";
    } catch {
      /* document.title assignment can throw in sandboxed iframes */
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable — ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((l) => (l === "en" ? "hi" : "en")),
    [],
  );

  const saveSiteData = useCallback((d: SiteData) => {
    setSiteData(d);
    persistSiteData(d);
  }, []);

  const refreshSiteData = useCallback(() => {
    setSiteData(loadSiteData());
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      t: siteData[lang] as Content,
      setLang,
      toggleLang,
      siteData,
      saveSiteData,
      refreshSiteData,
    }),
    [lang, siteData, setLang, toggleLang, saveSiteData, refreshSiteData],
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

/** Shorthand for components that only need the translated content tree. */
export function useT(): Content {
  return useLanguage().t;
}
