/** localStorage + Supabase unified data adapter — always returns valid data, never throws. */
import { STORAGE_KEYS } from "@/config/admin";
import { supabase, isSupabaseReady } from "@/lib/supabase";

const BUCKET = "school-media";

/* ---------- Generic JSON helpers ---------- */
function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — ignore */
  }
}

/* ---------- Data shape ---------- */
export interface Teacher {
  id: string;
  name: string;
  photo: string;
  subject: string;
  designation: string;
  qualification: string;
  experience: string;
  order: number;
}
export interface GalleryItem {
  id: string;
  image_url: string;
  category?: string;
  title: string;
  caption: string;
  order: number;
}
export interface Notice {
  id: string;
  tag: string;
  date: string;
  title: string;
  body: string;
  pinned: boolean;
  important: boolean;
  published: boolean;
}
export interface Facility {
  id: string;
  icon: string;
  title: string;
  desc: string;
  meta: string;
}
export interface Achievement {
  id: string;
  period: string;
  tag: string;
  title: string;
  body: string;
}
export interface VocCourse {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  eligibility: string;
  duration: string;
  subjects: string[];
  certificates: string[];
  skills: string[];
  careers: string[];
}
export interface SiteSettings {
  schoolName: string;
  schoolNameCaps: string;
  schoolPlace: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  map: string;
  footerAbout: string;
  footerDevCredit: string;
  socialLinks: { platform: string; url: string }[];
}
export interface SiteData {
  settings: SiteSettings;
  hero: {
    badge: string;
    titleA: string;
    titleHighlight: string;
    titleB: string;
    subtitle: string;
    exploreBtn: string;
    cardTitle: string;
    cardSub: string;
    floatA: string;
    floatB: string;
    badges: string[];
    marquee: string[];
    bgImage: string;
    cardImage: string;
    aboutAImage: string;
    aboutBImage: string;
  };
  principal: {
    name: string;
    designation: string;
    quoteA: string;
    quoteB: string;
    p1: string;
    p2: string;
    photoUrl: string;
    note: string;
  };
  about: Record<string, unknown>;
  teachers: Teacher[];
  gallery: GalleryItem[];
  notices: Notice[];
  facilities: Facility[];
  achievements: Achievement[];
  vocational: { eyebrow: string; title: string; highlight: string; desc: string; courses: VocCourse[] };
  highlights: { title: string; desc: string }[];
}

/* ---------- Defaults ---------- */
export const defaultsSiteData = (): SiteData => ({
  settings: {
    schoolName: "Govt. Boys H. S. School Cantt, Guna",
    schoolNameCaps: "GOVT. BOYS H. S. SCHOOL",
    schoolPlace: "Cantt, Guna",
    logoUrl: "",
    address: "Cantt Area, Guna, MP - 473001",
    phone: "",
    email: "",
    map: "",
    footerAbout: "A government higher secondary school in Guna (M.P.).",
    footerDevCredit: "Website Designed & Developed by Lakshya Jatav",
    socialLinks: [],
  },
  hero: {
    badge: "Government of Madhya Pradesh · District Guna",
    titleA: "Welcome to",
    titleHighlight: "Govt. Boys H. S. School",
    titleB: "Cantt, Guna",
    subtitle: "Empowering students through quality education.",
    exploreBtn: "Explore Campus",
    cardTitle: "Learning that builds skills",
    cardSub: "Academics · Vocational trades · Practical science",
    floatA: "Students",
    floatB: "Vocational Trades",
    badges: ["EFA Government School", "MPBSE Curriculum", "Class 1 – 12"],
    marquee: [
      "Government Higher Secondary School",
      "Vocational Education: IT/ITES",
      "Vocational Education: Electronics & Hardware",
    ],
    bgImage: "",
    cardImage: "",
    aboutAImage: "",
    aboutBImage: "",
  },
  principal: {
    name: "Principal",
    designation: "Govt. Boys H. S. School Cantt, Guna",
    quoteA: "Education is the strongest tool",
    quoteB: "from school into life.",
    p1: "",
    p2: "",
    photoUrl: "",
    note: "Name and photograph to be updated by school office",
  },
  about: {},
  teachers: [
    { id: "t1", name: "", photo: "", subject: "Mathematics", designation: "Subject Teacher", qualification: "", experience: "", order: 0 },
    { id: "t2", name: "", photo: "", subject: "Physics", designation: "Subject Teacher", qualification: "", experience: "", order: 1 },
    { id: "t3", name: "", photo: "", subject: "Chemistry", designation: "Subject Teacher", qualification: "", experience: "", order: 2 },
    { id: "t4", name: "", photo: "", subject: "Biology", designation: "Subject Teacher", qualification: "", experience: "", order: 3 },
    { id: "t5", name: "", photo: "", subject: "English", designation: "Subject Teacher", qualification: "", experience: "", order: 4 },
    { id: "t6", name: "", photo: "", subject: "Hindi & Sanskrit", designation: "Subject Teacher", qualification: "", experience: "", order: 5 },
    { id: "t7", name: "", photo: "", subject: "Social Science", designation: "Subject Teacher", qualification: "", experience: "", order: 6 },
    { id: "t8", name: "", photo: "", subject: "Computer / IT", designation: "Vocational Trainer", qualification: "", experience: "", order: 7 },
  ],
  gallery: [
    "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    "https://images.pexels.com/photos/35551059/pexels-photo-35551059.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/35550999/pexels-photo-35550999.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/8472004/pexels-photo-8472004.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/5530438/pexels-photo-5530438.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/8927020/pexels-photo-8927020.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
    "https://images.pexels.com/photos/35551044/pexels-photo-35551044.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/13812360/pexels-photo-13812360.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
  ].map((url, i) => ({ id: `g${i + 1}`, image_url: url, category: "campus", title: `Gallery ${i + 1}`, caption: "", order: i })),
  notices: [
    { id: "n1", tag: "Latest", date: "Current Session", title: "Parent–Teacher Meeting", body: "Parents are requested to visit.", pinned: true, important: false, published: true },
    { id: "n2", tag: "Exam", date: "Current Session", title: "Board Exam Timetable", body: "Timetables displayed.", pinned: false, important: false, published: true },
    { id: "n3", tag: "Holiday", date: "Current Session", title: "Holiday Calendar", body: "Government holiday calendar.", pinned: false, important: false, published: true },
    { id: "n4", tag: "Vocational", date: "Current Session", title: "Trade Selection", body: "IT/ITES or Electronics.", pinned: false, important: true, published: true },
  ],
  facilities: [
    { id: "f1", icon: "computer", title: "Computer Lab", desc: "IT/ITES vocational practicals.", meta: "Vocational" },
    { id: "f2", icon: "flask", title: "Physics Lab", desc: "Board-level practical work.", meta: "Senior" },
    { id: "f3", icon: "beaker", title: "Chemistry Lab", desc: "Prescribed experiments.", meta: "Practical" },
    { id: "f4", icon: "leaf", title: "Biology Lab", desc: "Senior class practicals.", meta: "Senior" },
    { id: "f5", icon: "circuit", title: "Electronics Lab", desc: "Vocational trade tools.", meta: "Trade" },
    { id: "f6", icon: "library", title: "Library", desc: "Reading room.", meta: "Reading" },
    { id: "f7", icon: "droplets", title: "Drinking Water", desc: "Clean water.", meta: "Campus" },
    { id: "f8", icon: "volleyball", title: "Playground", desc: "Assembly & sports.", meta: "Sports" },
  ],
  achievements: [
    { id: "a1", period: "Every Year", tag: "Academics", title: "Board Exam Preparation", body: "Regular tests and revision." },
    { id: "a2", period: "Every Year", tag: "Vocational", title: "Practical Training", body: "NSQF skill assessment." },
    { id: "a3", period: "Annual", tag: "Sports", title: "Sports Day", body: "Annual sports meet." },
    { id: "a4", period: "Annual", tag: "Science", title: "Science Exhibition", body: "Models and charts." },
    { id: "a5", period: "As Notified", tag: "Scholarships", title: "Scholarship Assistance", body: "Government forms help." },
  ],
  vocational: {
    eyebrow: "NSQF Skill Education",
    title: "Vocational",
    highlight: "Education",
    desc: "Vocational education starts from Class 9.",
    courses: [
      { id: "v1", name: "IT / ITES", tagline: "Information Technology", intro: "Computers and office software.", eligibility: "Class 9", duration: "4 years", subjects: ["Computers"], certificates: ["NSQF L3"], skills: ["Typing", "Word", "Excel", "HTML"], careers: ["Data entry", "Office assistant"] },
      { id: "v2", name: "Electronics & Hardware", tagline: "Electronics & Repair", intro: "Electronic components and repair.", eligibility: "Class 9", duration: "4 years", subjects: ["Electronics"], certificates: ["NSQF L3"], skills: ["Soldering", "Assembly", "Circuits"], careers: ["Technician", "Field service"] },
    ],
  },
  highlights: [
    { title: "Government Higher Secondary School", desc: "MPBSE curriculum, Class 1 to 12." },
    { title: "Experienced Teaching Staff", desc: "Government-appointed teachers." },
    { title: "Science Laboratories", desc: "Physics, Chemistry and Biology." },
    { title: "Computer Lab", desc: "IT practicals and vocational classes." },
    { title: "Library", desc: "Textbooks and reference material." },
    { title: "Vocational Education", desc: "IT/ITES & Electronics from Class 9." },
    { title: "Playground", desc: "Assembly, sports and events." },
    { title: "Government Support", desc: "Scholarships and free textbooks." },
  ],
});

/* ---------- Main load / save ---------- */
export function loadSiteData(): SiteData {
  return lsGet<SiteData>(STORAGE_KEYS.data, defaultsSiteData());
}
export function saveSiteData(d: SiteData) {
  lsSet(STORAGE_KEYS.data, d);
}
export function resetSiteData(): SiteData {
  const fresh = defaultsSiteData();
  lsSet(STORAGE_KEYS.data, fresh);
  return fresh;
}

export function exportJSON(d: SiteData) {
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gbhss-backup.json";
  a.click();
  a.remove();
}

export function importJSON(text: string): SiteData | null {
  try {
    const d = JSON.parse(text) as SiteData;
    return d?.settings?.schoolName ? d : null;
  } catch {
    return null;
  }
}

/* ---------- Auth ---------- */
import { ADMIN_PASSWORD } from "@/config/admin";

let runtimePassword = ADMIN_PASSWORD;

export function getPassword() { return runtimePassword; }
export function setPassword(p: string) { if (p.trim().length >= 4) { runtimePassword = p.trim(); authLogout(); } }
export function authLogin(pass: string) {
  if (pass === getPassword()) { lsSet(STORAGE_KEYS.auth, "1"); return true; }
  return false;
}
export function authLogout() { lsSet(STORAGE_KEYS.auth, ""); }
export function authIsLoggedIn() { return lsGet<string>(STORAGE_KEYS.auth, "") === "1"; }

/* ---------- Image upload (Supabase Storage, falls back to passthrough URL) ---------- */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!isSupabaseReady()) return URL.createObjectURL(file);
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(url: string) {
  if (!isSupabaseReady()) return;
  try {
    const path = url.split(`/${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  } catch { /* */ }
}

/* ==========================================================================
   SUPABASE CMS NORMALIZED RELATIONAL DATABASE INTEGRATION LAYER
   ========================================================================== */

/** Asynchronously fetches and compiles completely fresh website content from Supabase */
export async function fetchFromSupabase(): Promise<SiteData | null> {
  if (!isSupabaseReady()) {
    console.log("[CMS Storage] Supabase not configured. Using high-performance localStorage fallback.");
    return null;
  }

  try {
    const [
      settingsRes, socialRes, teachersRes, galleryRes, noticesRes,
      facilitiesRes, achievementsRes, vocSectionRes, vocCoursesRes,
      vocSubjectsRes, vocCertificatesRes, vocSkillsRes, vocCareersRes,
      heroRes, marqueeRes, principalRes
    ] = await Promise.all([
      supabase.from("website_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("social_links").select("*").order("position", { ascending: true }),
      supabase.from("teachers").select("*").order("display_order", { ascending: true }),
      supabase.from("gallery").select("*").order("display_order", { ascending: true }),
      supabase.from("notices").select("*").order("created_at", { ascending: false }),
      supabase.from("facilities").select("*").order("display_order", { ascending: true }),
      supabase.from("achievements").select("*").order("display_order", { ascending: true }),
      supabase.from("vocational_section").select("*").eq("id", 1).maybeSingle(),
      supabase.from("vocational_courses").select("*").order("display_order", { ascending: true }),
      supabase.from("vocational_subjects").select("*"),
      supabase.from("vocational_certificates").select("*"),
      supabase.from("vocational_skills").select("*"),
      supabase.from("vocational_careers").select("*"),
      supabase.from("hero_section").select("*").eq("id", 1).maybeSingle(),
      supabase.from("hero_marquee").select("*").order("position", { ascending: true }),
      supabase.from("principal").select("*").eq("id", 1).maybeSingle(),
    ]);

    // Handle any fetch errors gracefully without breaking the UI
    const defaultData = defaultsSiteData();

    // 1. Map Website Settings & Social Links
    const settingsData = settingsRes.data;
    const socialLinks = (socialRes.data || []).map(link => ({ platform: link.platform, url: link.url }));
    const settings: SiteSettings = {
      schoolName: settingsData?.school_name || defaultData.settings.schoolName,
      schoolNameCaps: settingsData?.school_name_caps || defaultData.settings.schoolNameCaps,
      schoolPlace: settingsData?.school_place || defaultData.settings.schoolPlace,
      logoUrl: settingsData?.logo_url || defaultData.settings.logoUrl,
      address: settingsData?.address || defaultData.settings.address,
      phone: settingsData?.phone || defaultData.settings.phone,
      email: settingsData?.email || defaultData.settings.email,
      map: settingsData?.map_embed || defaultData.settings.map,
      footerAbout: settingsData?.footer_about || defaultData.settings.footerAbout,
      footerDevCredit: settingsData?.footer_dev_credit || defaultData.settings.footerDevCredit,
      socialLinks,
    };

    // 2. Map Hero Section & Marquee
    const heroData = heroRes.data;
    const marquee = (marqueeRes.data || []).map(item => item.text);
    const hero = {
      badge: heroData?.badge_text || defaultData.hero.badge,
      titleA: heroData?.title_a || defaultData.hero.titleA,
      titleHighlight: heroData?.title_highlight || defaultData.hero.titleHighlight,
      titleB: heroData?.title_b || defaultData.hero.titleB,
      subtitle: heroData?.subtitle || defaultData.hero.subtitle,
      exploreBtn: heroData?.explore_btn || defaultData.hero.exploreBtn,
      cardTitle: heroData?.card_title || defaultData.hero.cardTitle,
      cardSub: heroData?.card_subtitle || defaultData.hero.cardSub,
      floatA: heroData?.float_label_a || defaultData.hero.floatA,
      floatB: heroData?.float_label_b || defaultData.hero.floatB,
      badges: [
        heroData?.badge1 || defaultData.hero.badges[0],
        heroData?.badge2 || defaultData.hero.badges[1],
        heroData?.badge3 || defaultData.hero.badges[2],
      ],
      marquee: marquee.length > 0 ? marquee : defaultData.hero.marquee,
      bgImage: heroData?.bg_image_url || defaultData.hero.bgImage,
      cardImage: heroData?.card_image_url || defaultData.hero.cardImage,
      aboutAImage: "",
      aboutBImage: "",
    };

    // 3. Map Principal Message
    const principalData = principalRes.data;
    const principal = {
      name: principalData?.name || defaultData.principal.name,
      designation: principalData?.designation || defaultData.principal.designation,
      quoteA: principalData?.quote_a || defaultData.principal.quoteA,
      quoteB: principalData?.quote_b || defaultData.principal.quoteB,
      p1: principalData?.paragraph1 || defaultData.principal.p1,
      p2: principalData?.paragraph2 || defaultData.principal.p2,
      photoUrl: principalData?.photo_url || defaultData.principal.photoUrl,
      note: principalData?.note || defaultData.principal.note,
    };

    // 4. Map Teachers
    const teachers: Teacher[] = (teachersRes.data || []).map(t => ({
      id: t.id,
      name: t.name,
      photo: t.photo,
      subject: t.subject,
      designation: t.designation,
      qualification: t.qualification,
      experience: t.experience,
      order: t.display_order,
    }));

    // 5. Map Gallery
    const gallery: GalleryItem[] = (galleryRes.data || []).map(g => ({
      id: g.id,
      image_url: g.image_url,
      category: g.category || "campus",
      title: g.title,
      caption: g.caption,
      order: g.display_order,
    }));

    // 6. Map Notices
    const notices: Notice[] = (noticesRes.data || []).map(n => ({
      id: n.id,
      tag: n.tag,
      date: n.notice_date,
      title: n.title,
      body: n.body,
      pinned: n.pinned || false,
      important: n.important || false,
      published: n.published || false,
    }));

    // 7. Map Facilities
    const facilities: Facility[] = (facilitiesRes.data || []).map(f => ({
      id: f.id,
      icon: f.icon_name,
      title: f.title,
      desc: f.description,
      meta: f.meta_badge,
    }));

    // 8. Map Achievements
    const achievements: Achievement[] = (achievementsRes.data || []).map(a => ({
      id: a.id,
      period: a.period,
      tag: a.tag,
      title: a.title,
      body: a.body,
    }));

    // 9. Map Vocational Education Section
    const vocSection = vocSectionRes.data;
    const courses: VocCourse[] = (vocCoursesRes.data || []).map(course => {
      const courseId = course.id;
      return {
        id: courseId,
        name: course.name,
        tagline: course.tagline,
        intro: course.intro,
        eligibility: course.eligibility,
        duration: course.duration,
        subjects: (vocSubjectsRes.data || []).filter(r => r.course_id === courseId).map(r => r.subject),
        certificates: (vocCertificatesRes.data || []).filter(r => r.course_id === courseId).map(r => r.certificate),
        skills: (vocSkillsRes.data || []).filter(r => r.course_id === courseId).map(r => r.skill),
        careers: (vocCareersRes.data || []).filter(r => r.course_id === courseId).map(r => r.career),
      };
    });

    const vocational = {
      eyebrow: vocSection?.eyebrow || defaultData.vocational.eyebrow,
      title: vocSection?.title || defaultData.vocational.title,
      highlight: vocSection?.highlight || defaultData.vocational.highlight,
      desc: vocSection?.description || defaultData.vocational.desc,
      courses,
    };

    const parsedSiteData: SiteData = {
      settings,
      hero,
      about: {},
      principal,
      teachers: teachers.length > 0 ? teachers : defaultData.teachers,
      gallery: gallery.length > 0 ? gallery : defaultData.gallery,
      notices: notices.length > 0 ? notices : defaultData.notices,
      facilities: facilities.length > 0 ? facilities : defaultData.facilities,
      achievements: achievements.length > 0 ? achievements : defaultData.achievements,
      vocational,
      highlights: defaultData.highlights,
    };

    // Cache to localStorage for instant startup on next page refresh
    lsSet(STORAGE_KEYS.data, parsedSiteData);
    return parsedSiteData;
  } catch (error) {
    console.error("[CMS Storage] Supabase load failed. Gracefully falling back to local cached copy:", error);
    return null;
  }
}

/** Publishes website changes immediately to normalized Supabase database tables */
export async function publishToSupabase(d: SiteData): Promise<void> {
  if (!isSupabaseReady()) {
    console.warn("[CMS Storage] Supabase NOT ready or unconfigured. Skipping remote sync.");
    return;
  }

  // Save locally first to guarantee zero state friction
  saveSiteData(d);

  try {
    // 1. Publish Website Settings (Singleton ID = 1)
    await supabase.from("website_settings").upsert({
      id: 1,
      school_name: d.settings.schoolName,
      school_name_caps: d.settings.schoolNameCaps,
      school_place: d.settings.schoolPlace,
      logo_url: d.settings.logoUrl,
      address: d.settings.address,
      phone: d.settings.phone,
      email: d.settings.email,
      map_embed: d.settings.map,
      footer_about: d.settings.footerAbout,
      footer_dev_credit: d.settings.footerDevCredit,
    });

    // 2. Publish Social Links
    await supabase.from("social_links").delete().neq("id", 0);
    if (d.settings.socialLinks && d.settings.socialLinks.length > 0) {
      const socialPayload = d.settings.socialLinks.map((item, index) => ({
        platform: item.platform,
        url: item.url,
        position: index,
      }));
      await supabase.from("social_links").insert(socialPayload);
    }

    // 3. Publish Hero Section
    await supabase.from("hero_section").upsert({
      id: 1,
      badge_text: d.hero.badge,
      title_a: d.hero.titleA,
      title_highlight: d.hero.titleHighlight,
      title_b: d.hero.titleB,
      subtitle: d.hero.subtitle,
      explore_btn: d.hero.exploreBtn,
      card_title: d.hero.cardTitle,
      card_subtitle: d.hero.cardSub,
      float_label_a: d.hero.floatA,
      float_label_b: d.hero.floatB,
      badge1: d.hero.badges[0] || "",
      badge2: d.hero.badges[1] || "",
      badge3: d.hero.badges[2] || "",
      bg_image_url: d.hero.bgImage,
      card_image_url: d.hero.cardImage,
    });

    // 4. Publish Hero Marquee Strip Items
    await supabase.from("hero_marquee").delete().neq("id", 0);
    if (d.hero.marquee && d.hero.marquee.length > 0) {
      const marqueePayload = d.hero.marquee.map((text, index) => ({
        text,
        position: index,
      }));
      await supabase.from("hero_marquee").insert(marqueePayload);
    }

    // 5. Publish Principal Message (Singleton ID = 1)
    await supabase.from("principal").upsert({
      id: 1,
      name: d.principal.name,
      designation: d.principal.designation,
      quote_a: d.principal.quoteA,
      quote_b: d.principal.quoteB,
      paragraph1: d.principal.p1,
      paragraph2: d.principal.p2,
      photo_url: d.principal.photoUrl,
      note: d.principal.note,
    });

    // 6. Publish Teachers
    // Clean deleted records or do total sync:
    // For robust relational synchronization without complex diffing, delete existing then rewrite
    await supabase.from("teachers").delete().neq("name", "###FORCE_DELETE_SAFE###");
    if (d.teachers && d.teachers.length > 0) {
      const teachersPayload = d.teachers.map((t, index) => ({
        id: t.id.startsWith("t") ? undefined : t.id, // generate UUID if temporary ID
        name: t.name,
        photo: t.photo,
        subject: t.subject,
        designation: t.designation,
        qualification: t.qualification,
        experience: t.experience,
        display_order: index,
      }));
      await supabase.from("teachers").insert(teachersPayload);
    }

    // 7. Publish Gallery
    await supabase.from("gallery").delete().neq("category", "###FORCE_DELETE_SAFE###");
    if (d.gallery && d.gallery.length > 0) {
      const galleryPayload = d.gallery.map((g, index) => ({
        id: g.id.startsWith("g") ? undefined : g.id,
        image_url: g.image_url,
        category: g.category || "campus",
        title: g.title,
        caption: g.caption,
        display_order: index,
      }));
      await supabase.from("gallery").insert(galleryPayload);
    }

    // 8. Publish Notices
    await supabase.from("notices").delete().neq("title", "###FORCE_DELETE_SAFE###");
    if (d.notices && d.notices.length > 0) {
      const noticesPayload = d.notices.map((n) => ({
        id: n.id.startsWith("n") ? undefined : n.id,
        tag: n.tag,
        notice_date: n.date,
        title: n.title,
        body: n.body,
        pinned: n.pinned,
        important: n.important,
        published: n.published,
      }));
      await supabase.from("notices").insert(noticesPayload);
    }

    // 9. Publish Facilities
    await supabase.from("facilities").delete().neq("title", "###FORCE_DELETE_SAFE###");
    if (d.facilities && d.facilities.length > 0) {
      const facilitiesPayload = d.facilities.map((f, index) => ({
        id: f.id.startsWith("f") ? undefined : f.id,
        icon_name: f.icon,
        title: f.title,
        description: f.desc,
        meta_badge: f.meta,
        display_order: index,
      }));
      await supabase.from("facilities").insert(facilitiesPayload);
    }

    // 10. Publish Achievements
    await supabase.from("achievements").delete().neq("title", "###FORCE_DELETE_SAFE###");
    if (d.achievements && d.achievements.length > 0) {
      const achievementsPayload = d.achievements.map((a, index) => ({
        id: a.id.startsWith("a") ? undefined : a.id,
        period: a.period,
        tag: a.tag,
        title: a.title,
        body: a.body,
        display_order: index,
      }));
      await supabase.from("achievements").insert(achievementsPayload);
    }

    // 11. Publish Vocational Section (Singleton ID = 1)
    await supabase.from("vocational_section").upsert({
      id: 1,
      eyebrow: d.vocational.eyebrow,
      title: d.vocational.title,
      highlight: d.vocational.highlight,
      description: d.vocational.desc,
    });

    // 12. Publish Vocational Courses & Related Child Arrays
    await supabase.from("vocational_courses").delete().neq("name", "###FORCE_DELETE_SAFE###");
    if (d.vocational.courses && d.vocational.courses.length > 0) {
      for (let index = 0; index < d.vocational.courses.length; index++) {
        const c = d.vocational.courses[index];
        const cid = c.id.startsWith("v") ? undefined : c.id;

        // Insert course
        const { data: insertedCourse } = await supabase.from("vocational_courses").insert({
          id: cid,
          name: c.name,
          tagline: c.tagline,
          intro: c.intro,
          eligibility: c.eligibility,
          duration: c.duration,
          display_order: index,
        }).select().single();

        if (insertedCourse) {
          const courseUUID = insertedCourse.id;

          // Insert nested relational records
          if (c.subjects && c.subjects.length > 0) {
            await supabase.from("vocational_subjects").insert(c.subjects.map(subject => ({ course_id: courseUUID, subject })));
          }
          if (c.certificates && c.certificates.length > 0) {
            await supabase.from("vocational_certificates").insert(c.certificates.map(certificate => ({ course_id: courseUUID, certificate })));
          }
          if (c.skills && c.skills.length > 0) {
            await supabase.from("vocational_skills").insert(c.skills.map(skill => ({ course_id: courseUUID, skill })));
          }
          if (c.careers && c.careers.length > 0) {
            await supabase.from("vocational_careers").insert(c.careers.map(career => ({ course_id: courseUUID, career })));
          }
        }
      }
    }

    console.log("[CMS Storage] Successfully published all normalized data to Supabase PostgreSQL.");
  } catch (error) {
    console.error("[CMS Storage] Failed to publish changes to Supabase:", error);
    throw error;
  }
}
