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

/**
 * Merges Supabase CMS records directly into the English/Hindi translation tree
 * at runtime. This connects every single public frontend component to the Supabase
 * database dynamically, while keeping localization perfectly intact.
 */
function mergeContent(lang: Lang, cms: SiteData): Content {
  const base = structuredClone(lang === "en" ? en : hi) as any;

  // 1. Merge Website settings
  if (cms.settings) {
    if (cms.settings.schoolName) base.meta.schoolName = cms.settings.schoolName;
    if (cms.settings.schoolNameCaps) base.meta.schoolNameCaps = cms.settings.schoolNameCaps;
    if (cms.settings.schoolPlace) base.meta.schoolPlace = cms.settings.schoolPlace;
    if (cms.settings.footerAbout) base.footer.about = cms.settings.footerAbout;
    if (cms.settings.footerDevCredit) base.footer.devCredit = cms.settings.footerDevCredit;
  }

  // 2. Merge Hero Section
  if (cms.hero) {
    if (cms.hero.badge) base.hero.badge = cms.hero.badge;
    if (cms.hero.titleA) base.hero.titleA = cms.hero.titleA;
    if (cms.hero.titleHighlight) base.hero.titleHighlight = cms.hero.titleHighlight;
    if (cms.hero.titleB) base.hero.titleB = cms.hero.titleB;
    if (cms.hero.subtitle) base.hero.subtitle = cms.hero.subtitle;
    if (cms.hero.exploreBtn) base.hero.exploreBtn = cms.hero.exploreBtn;
    if (cms.hero.cardTitle) base.hero.cardTitle = cms.hero.cardTitle;
    if (cms.hero.cardSub) base.hero.cardSub = cms.hero.cardSub;
    if (cms.hero.floatA) base.hero.floatA = cms.hero.floatA;
    if (cms.hero.floatB) base.hero.floatB = cms.hero.floatB;
    if (cms.hero.badges && cms.hero.badges.length > 0) base.hero.badges = cms.hero.badges;
    if (cms.hero.marquee && cms.hero.marquee.length > 0) base.hero.marquee = cms.hero.marquee;
  }

  // 3. Merge Principal Message
  if (cms.principal) {
    if (cms.principal.name) base.principal.name = cms.principal.name;
    if (cms.principal.designation) base.principal.designation = cms.principal.designation;
    if (cms.principal.quoteA) base.principal.quoteA = cms.principal.quoteA;
    if (cms.principal.quoteB) base.principal.quoteB = cms.principal.quoteB;
    if (cms.principal.p1) base.principal.p1 = cms.principal.p1;
    if (cms.principal.p2) base.principal.p2 = cms.principal.p2;
    if (cms.principal.photoUrl) base.principal.photoUrl = cms.principal.photoUrl;
    if (cms.principal.note) base.principal.note = cms.principal.note;
  }

  // 4. Merge Teachers List
  if (cms.teachers && cms.teachers.length > 0) {
    base.teachers.list = cms.teachers.map(t => ({
      id: t.id,
      name: t.name,
      photo: t.photo,
      subject: t.subject,
      designation: t.designation,
      qualification: t.qualification,
      experience: t.experience,
    }));
  }

  // 5. Merge Gallery Items
  if (cms.gallery && cms.gallery.length > 0) {
    base.gallery.items = cms.gallery.map(g => ({
      id: g.id,
      title: g.title,
      caption: g.caption,
      image_url: g.image_url,
    }));
  }

  // 6. Merge Notices List
  if (cms.notices && cms.notices.length > 0) {
    base.notices.items = cms.notices.map(n => ({
      id: n.id,
      tag: n.tag,
      date: n.date,
      title: n.title,
      body: n.body,
      pinned: n.pinned,
      important: n.important,
      published: n.published,
    }));
  }

  // 7. Merge Facilities List
  if (cms.facilities && cms.facilities.length > 0) {
    base.facilities.items = cms.facilities.map(f => ({
      id: f.id,
      icon: f.icon,
      title: f.title,
      desc: f.desc,
      meta: f.meta,
    }));
  }

  // 8. Merge Achievements List
  if (cms.achievements && cms.achievements.length > 0) {
    base.achievements.items = cms.achievements.map(a => ({
      id: a.id,
      period: a.period,
      tag: a.tag,
      title: a.title,
      body: a.body,
    }));
  }

  // 9. Merge Vocational Section
  if (cms.vocational) {
    if (cms.vocational.eyebrow) base.vocational.eyebrow = cms.vocational.eyebrow;
    if (cms.vocational.title) base.vocational.title = cms.vocational.title;
    if (cms.vocational.highlight) base.vocational.highlight = cms.vocational.highlight;
    if (cms.vocational.desc) base.vocational.desc = cms.vocational.desc;
    if (cms.vocational.courses && cms.vocational.courses.length > 0) {
      base.vocational.courses = cms.vocational.courses.map(c => ({
        id: c.id,
        name: c.name,
        tagline: c.tagline,
        intro: c.intro,
        eligibility: c.eligibility,
        duration: c.duration,
        subjects: c.subjects,
        certificates: c.certificates,
        skills: c.skills,
        careers: c.careers,
      }));
    }
  }

  // 10. Merge School Highlights List
  if (cms.highlights && cms.highlights.length > 0) {
    base.highlights.items = cms.highlights.map(h => ({
      title: h.title,
      desc: h.desc,
    }));
  }

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
