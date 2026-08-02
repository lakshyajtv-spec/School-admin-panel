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
import { defaultSiteData, type SiteData } from "@/cms/lib/types";
import { fetchSiteData, publishSiteData } from "@/cms/lib/repository";

type LanguageValue = {
  lang: Lang;
  t: Content;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Full editable site data — loaded from Supabase (defaults on first paint). */
  siteData: SiteData;
  /** True once fresh data has been fetched from Supabase. */
  dataReady: boolean;
  /** Publish draft to Supabase. Returns success flag. */
  saveSiteData: (d: SiteData) => Promise<boolean>;
  /** Re-fetch the latest content from Supabase. */
  refreshSiteData: () => Promise<void>;
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
  const [siteData, setSiteData] = useState<SiteData>(() => defaultSiteData());
  const [dataReady, setDataReady] = useState(false);

  // Load fresh content from Supabase on mount (website + admin both use this).
  // The repository itself falls back to localStorage/defaults — a backend
  // failure can never reject here, but we still guard with .catch.
  useEffect(() => {
    let cancelled = false;
    fetchSiteData()
      .then((d) => {
        if (!cancelled) {
          setSiteData(d);
          setDataReady(true);
        }
      })
      .catch((err) => {
        console.error("[LanguageProvider] Content load failed:", err);
        if (!cancelled) setDataReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  /** Publish to Supabase; on success the whole site updates instantly. */
  const saveSiteData = useCallback(async (d: SiteData): Promise<boolean> => {
    const res = await publishSiteData(d);
    if (res.ok) {
      setSiteData(d);
      return true;
    }
    return false;
  }, []);

  const refreshSiteData = useCallback(async () => {
    const d = await fetchSiteData();
    setSiteData(d);
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      t: siteData[lang] as Content,
      setLang,
      toggleLang,
      siteData,
      dataReady,
      saveSiteData,
      refreshSiteData,
    }),
    [lang, siteData, dataReady, setLang, toggleLang, saveSiteData, refreshSiteData],
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
