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

function defaultSiteData(): PublicSiteData {
  return {
    content: {} as Content,
    cms: {
      settings: {
        schoolName: "", schoolNameCaps: "", schoolPlace: "",
        logoUrl: "", favicon: "", address: "", phone: "", email: "",
        mapEmbed: "", socialLinks: [], footerAbout: "", footerDevCredit: "",
      },
      hero: {}, about: {}, principal: {}, highlights: {},
      teachers: [], gallery: [], notices: [],
      facilities: [], achievements: [],
      vocational: { eyebrow: "", title: "", highlight: "", desc: "", courses: [] },
    },
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);
  const [siteData, setSiteData] = useState<PublicSiteData>(defaultSiteData);
  const [ready, setReady] = useState(false);

  // Initial load
  useEffect(() => {
    (async () => {
      const data = await getPublicSiteData(lang);
      setSiteData(data);
      setReady(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rebuild = useCallback(async (l: Lang) => {
    refreshCMS();
    const data = await getPublicSiteData(l);
    setSiteData(data);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      document.title = lang === "hi"
        ? "शा. बालक उ. मा. विद्यालय कैंट, गुना | EFA शासकीय विद्यालय"
        : "Govt. Boys H. S. School Cantt, Guna | EFA Government School";
    } catch { /* */ }
    try { window.localStorage.setItem(LANG_KEY, lang); } catch { /* */ }
    if (ready) rebuild(lang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Poll for CMS changes
  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(async () => {
      const fresh = await loadData();
      setSiteData((prev) => {
        if (
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
        return prev;
      });
    }, 2000);
    return () => window.clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === "en" ? "hi" : "en")), []);

  const updateCMS = useCallback((d: AllSiteData) => {
    saveData(d);
    rebuild(lang);
  }, [lang, rebuild]);

  const value = useMemo<LanguageValue>(() => ({
    lang, t: siteData.content, setLang, toggleLang, cms: siteData.cms, updateCMS,
  }), [lang, siteData, setLang, toggleLang, updateCMS]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fd]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-royal-200 border-t-royal-700" />
          <p className="font-body text-sm text-slate-500">Loading school website…</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

/** Sync version for the polling interval */
function getPublicSiteDataSync(lang: "en" | "hi", cms: AllSiteData): PublicSiteData {
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

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside <LanguageProvider>");
  return ctx;
}

export function useT(): Content {
  return useLanguage().t;
}
