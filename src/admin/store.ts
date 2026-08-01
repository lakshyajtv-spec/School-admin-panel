/**
 * Admin CMS Store — Supabase-first with localStorage fallback.
 * 
 * When Supabase env vars are configured:
 *   → All reads go through Supabase
 *   → All writes go through Supabase (then also save to localStorage as cache)
 * 
 * When Supabase is NOT configured:
 *   → Falls back to localStorage transparently
 *   → Everything still works for local development
 */
import { ADMIN_PASSWORD } from "@/config/admin";
import { isSupabaseConfigured } from "@/lib/supabase";
import * as api from "@/lib/supabaseService";
import type {
  TeacherRow, GalleryRow, NoticeRow, FacilityRow, AchievementRow,
} from "@/lib/supabaseTypes";

/* ============ Local interfaces (same as before for fallback) ============ */

export interface TeacherEntity {
  id: string; name: string; photo: string; subject: string;
  designation: string; qualification: string; experience: string;
}
export interface GalleryEntity {
  id: string; src: string; category: string; title: string; caption: string;
}
export interface NoticeEntity {
  id: string; tag: string; date: string; title: string; body: string;
  pinned: boolean; important: boolean; published: boolean;
}
export interface FacilityEntity {
  id: string; icon: string; title: string; desc: string; meta: string;
}
export interface AchievementEntity {
  id: string; period: string; tag: string; title: string; body: string;
}
export interface VocationalCourse {
  id: string; name: string; tagline: string; intro: string;
  eligibility: string; duration: string;
  subjects: string[]; certificates: string[]; skills: string[]; careers: string[];
}
export interface WebsiteSettings {
  schoolName: string; schoolNameCaps: string; schoolPlace: string;
  logoUrl: string; favicon: string; address: string; phone: string;
  email: string; mapEmbed: string; socialLinks: { platform: string; url: string }[];
  footerAbout: string; footerDevCredit: string;
}
export interface AllSiteData {
  settings: WebsiteSettings;
  hero: Record<string, unknown>;
  about: Record<string, unknown>;
  principal: Record<string, unknown>;
  highlights: Record<string, unknown>;
  teachers: TeacherEntity[];
  gallery: GalleryEntity[];
  notices: NoticeEntity[];
  facilities: FacilityEntity[];
  achievements: AchievementEntity[];
  vocational: {
    eyebrow: string; title: string; highlight: string; desc: string;
    courses: VocationalCourse[];
  };
}

/* ============ Mappers — Supabase Row ↔ Local Entity ============ */

function toTeacher(r: TeacherRow): TeacherEntity {
  return { id: r.id, name: r.name, photo: r.photo, subject: r.subject, designation: r.designation, qualification: r.qualification, experience: r.experience };
}
function toTeacherInsert(t: TeacherEntity): TeacherRow {
  return { id: t.id, name: t.name, photo: t.photo, subject: t.subject, designation: t.designation, qualification: t.qualification, experience: t.experience, display_order: 0 };
}

function toGallery(r: GalleryRow): GalleryEntity {
  return { id: r.id, src: r.image_url, category: r.category, title: r.title, caption: r.caption };
}
function toGalleryInsert(g: GalleryEntity): GalleryRow {
  return { id: g.id, image_url: g.src, category: g.category, title: g.title, caption: g.caption, display_order: 0 };
}

function toNotice(r: NoticeRow): NoticeEntity {
  return { id: r.id, tag: r.tag, date: r.notice_date, title: r.title, body: r.body, pinned: r.pinned, important: r.important, published: r.published };
}
function toNoticeInsert(n: NoticeEntity): NoticeRow {
  return { id: n.id, tag: n.tag, notice_date: n.date, title: n.title, body: n.body, pinned: n.pinned, important: n.important, published: n.published };
}

function toFacility(r: FacilityRow): FacilityEntity {
  return { id: r.id, icon: r.icon_name, title: r.title, desc: r.description, meta: r.meta_badge };
}
function toFacilityInsert(f: FacilityEntity): FacilityRow {
  return { id: f.id, icon_name: f.icon, title: f.title, description: f.desc, meta_badge: f.meta, display_order: 0 };
}

function toAchievement(r: AchievementRow): AchievementEntity {
  return { id: r.id, period: r.period, tag: r.tag, title: r.title, body: r.body };
}
function toAchievementInsert(a: AchievementEntity): AchievementRow {
  return { id: a.id, period: a.period, tag: a.tag, title: a.title, body: a.body, display_order: 0 };
}

/* ============ LocalStorage fallback ============ */

import { STORAGE_PREFIX } from "@/config/admin";

const KEY = `${STORAGE_PREFIX}-cms-data-v2`;
const AUTH_KEY = `${STORAGE_PREFIX}-auth`;

function localStorageSave(d: AllSiteData) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* */ }
}
function localStorageLoad(): AllSiteData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const p = JSON.parse(raw) as AllSiteData; if (p?.settings) return p; }
  } catch { /* */ }
  return null;
}

// Defaults (used when nothing is saved yet)
export const DEFAULT_TEACHERS: TeacherEntity[] = [
  { id: "t1", name: "", photo: "", subject: "Mathematics", designation: "Subject Teacher", qualification: "", experience: "" },
  { id: "t2", name: "", photo: "", subject: "Physics", designation: "Subject Teacher", qualification: "", experience: "" },
  { id: "t3", name: "", photo: "", subject: "Chemistry", designation: "Subject Teacher", qualification: "", experience: "" },
  { id: "t4", name: "", photo: "", subject: "Biology", designation: "Subject Teacher", qualification: "", experience: "" },
  { id: "t5", name: "", photo: "", subject: "English", designation: "Subject Teacher", qualification: "", experience: "" },
  { id: "t6", name: "", photo: "", subject: "Hindi & Sanskrit", designation: "Subject Teacher", qualification: "", experience: "" },
  { id: "t7", name: "", photo: "", subject: "Social Science", designation: "Subject Teacher", qualification: "", experience: "" },
  { id: "t8", name: "", photo: "", subject: "Computer / IT", designation: "Vocational Trainer", qualification: "", experience: "" },
];
export const DEFAULT_GALLERY: GalleryEntity[] = [
  "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  "https://images.pexels.com/photos/35551059/pexels-photo-35551059.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
  "https://images.pexels.com/photos/35550999/pexels-photo-35550999.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
  "https://images.pexels.com/photos/8472004/pexels-photo-8472004.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
  "https://images.pexels.com/photos/5530438/pexels-photo-5530438.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
  "https://images.pexels.com/photos/8927020/pexels-photo-8927020.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
  "https://images.pexels.com/photos/35551044/pexels-photo-35551044.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
  "https://images.pexels.com/photos/13812360/pexels-photo-13812360.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
].map((src, i) => ({ id: `g${i + 1}`, src, category: "campus", title: `Gallery ${i + 1}`, caption: "" }));
export const DEFAULT_NOTICES: NoticeEntity[] = [
  { id: "n1", tag: "Latest Notice", date: "Current Session", title: "Parent–Teacher Meeting", body: "Parents are requested to visit the school.", pinned: true, important: false, published: true },
  { id: "n2", tag: "Exam Schedule", date: "Current Session", title: "Board Exam Timetable", body: "Timetables are displayed on the notice board.", pinned: false, important: false, published: true },
  { id: "n3", tag: "Holiday List", date: "Current Session", title: "Holiday Calendar", body: "The school follows the government holiday calendar.", pinned: false, important: false, published: true },
  { id: "n4", tag: "Vocational", date: "Current Session", title: "Trade Selection for Class 9", body: "Choose between IT/ITES and Electronics.", pinned: false, important: true, published: true },
];
export const DEFAULT_FACILITIES: FacilityEntity[] = [
  { id: "f1", icon: "cpu", title: "Computer Lab", desc: "IT/ITES vocational practicals.", meta: "Vocational Use" },
  { id: "f2", icon: "flask", title: "Physics Lab", desc: "Board-level practical work.", meta: "Senior Wing" },
  { id: "f3", icon: "beaker", title: "Chemistry Lab", desc: "Prescribed experiments.", meta: "Practical Work" },
  { id: "f4", icon: "leaf", title: "Biology Lab", desc: "Senior class practicals.", meta: "Senior Classes" },
  { id: "f5", icon: "circuit", title: "Electronics Lab", desc: "Vocational trade tools.", meta: "Vocational Trade" },
  { id: "f6", icon: "library", title: "Library", desc: "Reading room.", meta: "Reading Room" },
  { id: "f7", icon: "droplets", title: "Drinking Water", desc: "Clean drinking water.", meta: "Campus Wide" },
  { id: "f8", icon: "volleyball", title: "Playground", desc: "Assembly & sports.", meta: "Sports & Assembly" },
];
export const DEFAULT_ACHIEVEMENTS: AchievementEntity[] = [
  { id: "a1", period: "Every Year", tag: "Academics", title: "Board Exam Preparation", body: "Regular tests and revision classes." },
  { id: "a2", period: "Every Year", tag: "Vocational", title: "Practical Training", body: "NSQF skill assessment." },
  { id: "a3", period: "Annual", tag: "Sports", title: "Sports Day", body: "Annual sports meet." },
  { id: "a4", period: "Annual", tag: "Science", title: "Science Exhibition", body: "Working models and charts." },
  { id: "a5", period: "As Notified", tag: "Scholarships", title: "Scholarship Assistance", body: "Government scheme forms." },
];
export const DEFAULT_VOCATIONAL: VocationalCourse[] = [
  { id: "v1", name: "IT / ITES", tagline: "Information Technology", intro: "Computer and office software skills.", eligibility: "Class 9", duration: "4 years", subjects: ["Computers"], certificates: ["NSQF L3"], skills: ["Typing", "Word", "Excel"], careers: ["Data entry"] },
  { id: "v2", name: "Electronics & Hardware", tagline: "Electronics & Repair", intro: "Electronic components and repair.", eligibility: "Class 9", duration: "4 years", subjects: ["Electronics"], certificates: ["NSQF L3"], skills: ["Soldering", "Assembly"], careers: ["Technician"] },
];

function defaults(): AllSiteData {
  return {
    settings: {
      schoolName: "Govt. Boys H. S. School Cantt, Guna",
      schoolNameCaps: "GOVT. BOYS H. S. SCHOOL",
      schoolPlace: "Cantt, Guna",
      logoUrl: "", favicon: "",
      address: "Cantt Area, Guna, MP - 473001",
      phone: "", email: "", mapEmbed: "",
      socialLinks: [],
      footerAbout: "A government higher secondary school in Guna (M.P.).",
      footerDevCredit: "Website Designed & Developed by Lakshya Jatav",
    },
    hero: {}, about: {}, principal: {}, highlights: {},
    teachers: [...DEFAULT_TEACHERS],
    gallery: [...DEFAULT_GALLERY],
    notices: [...DEFAULT_NOTICES],
    facilities: [...DEFAULT_FACILITIES],
    achievements: [...DEFAULT_ACHIEVEMENTS],
    vocational: {
      eyebrow: "NSQF Skill Education",
      title: "Vocational", highlight: "Education",
      desc: "Vocational education starts from Class 9.",
      courses: [...DEFAULT_VOCATIONAL],
    },
  };
}

/* ============ Main Load / Save ============ */

export async function loadData(): Promise<AllSiteData> {
  if (isSupabaseConfigured()) {
    try {
      const [settings, teachers, gallery, notices, facilities, achievements, hero, marquee, principal, vocSection, vocCourses] = await Promise.all([
        api.fetchSettings(), api.fetchTeachers(), api.fetchGallery(),
        api.fetchNotices(), api.fetchFacilities(), api.fetchAchievements(),
        api.fetchHeroSection(), api.fetchHeroMarquee(), api.fetchPrincipal(),
        api.fetchVocationalSection(), api.fetchVocationalCourses(),
      ]);

      // Map all data
      const teacherEntities = (teachers || []).map(toTeacher);
      const galleryEntities = (gallery || []).map(toGallery);
      const noticeEntities = (notices || []).map(toNotice);
      const facilityEntities = (facilities || []).map(toFacility);
      const achievementEntities = (achievements || []).map(toAchievement);

      // Fetch relations for each vocational course
      const courseEntities: VocationalCourse[] = await Promise.all(
        (vocCourses || []).map(async (c) => {
          const rel = await api.fetchVocationalRelations(c.id);
          return {
            id: c.id, name: c.name, tagline: c.tagline, intro: c.intro,
            eligibility: c.eligibility, duration: c.duration,
            subjects: rel.subjects, certificates: rel.certificates,
            skills: rel.skills, careers: rel.careers,
          };
        }),
      );

      const result: AllSiteData = {
        settings: {
          schoolName: settings?.school_name || defaults().settings.schoolName,
          schoolNameCaps: settings?.school_name_caps || defaults().settings.schoolNameCaps,
          schoolPlace: settings?.school_place || defaults().settings.schoolPlace,
          logoUrl: settings?.logo_url || "",
          favicon: settings?.favicon || "",
          address: settings?.address || "",
          phone: settings?.phone || "",
          email: settings?.email || "",
          mapEmbed: settings?.map_embed || "",
          socialLinks: [],
          footerAbout: settings?.footer_about || "",
          footerDevCredit: settings?.footer_dev_credit || "",
        },
        hero: {
          ...hero,
          marquee: marquee || [],
          badges: [hero?.badge1 || "EFA School", hero?.badge2 || "MPBSE", hero?.badge3 || "Class 1–12"],
        },
        about: {},
        principal: {
          ...principal,
          messageP1: principal?.paragraph1 || "",
          messageP2: principal?.paragraph2 || "",
        },
        highlights: {},
        teachers: teacherEntities,
        gallery: galleryEntities,
        notices: noticeEntities,
        facilities: facilityEntities,
        achievements: achievementEntities,
        vocational: {
          eyebrow: vocSection?.eyebrow || "",
          title: vocSection?.title || "",
          highlight: vocSection?.highlight || "",
          desc: vocSection?.description || "",
          courses: courseEntities,
        },
      };

      // Also cache in localStorage for fast reloads
      localStorageSave(result);
      return result;
    } catch (err) {
      console.error("Supabase load failed, using localStorage fallback:", err);
    }
  }

  // Fallback to localStorage
  return localStorageLoad() ?? defaults();
}

export async function saveData(d: AllSiteData): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      // Settings
      await api.updateSettings({
        school_name: d.settings.schoolName,
        school_name_caps: d.settings.schoolNameCaps,
        school_place: d.settings.schoolPlace,
        logo_url: d.settings.logoUrl,
        favicon: d.settings.favicon,
        address: d.settings.address,
        phone: d.settings.phone,
        email: d.settings.email,
        map_embed: d.settings.mapEmbed,
        footer_about: d.settings.footerAbout,
        footer_dev_credit: d.settings.footerDevCredit,
      });

      // Entities — replace all
      // Note: For true sync, we'd diff. For simplicity, we use upsert on saves triggered by admin.
      // The admin CRUD pages call individual functions; this is a bulk save fallback.
    } catch (err) {
      console.error("Supabase save failed:", err);
    }
  }
  localStorageSave(d);
}

export function resetAllData(): AllSiteData {
  const fresh = defaults();
  localStorageSave(fresh);
  return fresh;
}

export function exportJSON(d: AllSiteData) {
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "gbhss-full-backup.json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export function parseImportJSON(text: string): AllSiteData | null {
  try {
    const d = JSON.parse(text) as AllSiteData;
    if (d?.settings?.schoolName) return d;
  } catch { /* */ }
  return null;
}

/* ============ Individual entity saves (called from admin CRUD pages) ============ */

export async function saveTeacher(t: TeacherEntity) {
  if (isSupabaseConfigured()) await api.upsertTeacher(toTeacherInsert(t));
  localStorageSave(await loadData()); // refresh cache
}

export async function removeTeacher(id: string) {
  if (isSupabaseConfigured()) await api.deleteTeacher(id);
}

export async function saveGalleryItem(g: GalleryEntity) {
  if (isSupabaseConfigured()) await api.upsertGalleryItem(toGalleryInsert(g));
}

export async function removeGalleryItem(id: string) {
  if (isSupabaseConfigured()) await api.deleteGalleryItem(id);
}

export async function saveNotice(n: NoticeEntity) {
  if (isSupabaseConfigured()) await api.upsertNotice(toNoticeInsert(n));
}

export async function removeNotice(id: string) {
  if (isSupabaseConfigured()) await api.deleteNotice(id);
}

export async function saveFacility(f: FacilityEntity) {
  if (isSupabaseConfigured()) await api.upsertFacility(toFacilityInsert(f));
}

export async function removeFacility(id: string) {
  if (isSupabaseConfigured()) await api.deleteFacility(id);
}

export async function saveAchievement(a: AchievementEntity) {
  if (isSupabaseConfigured()) await api.upsertAchievement(toAchievementInsert(a));
}

export async function removeAchievement(id: string) {
  if (isSupabaseConfigured()) await api.deleteAchievement(id);
}

export async function saveVocationalCourse(c: VocationalCourse) {
  if (isSupabaseConfigured()) {
    await api.upsertVocationalCourse(
      { id: c.id, name: c.name, tagline: c.tagline, intro: c.intro, eligibility: c.eligibility, duration: c.duration, display_order: 0 },
      c.subjects, c.certificates, c.skills, c.careers,
    );
  }
}

export async function removeVocationalCourse(id: string) {
  if (isSupabaseConfigured()) await api.deleteVocationalCourse(id);
}

export async function saveVocationalSection(row: { eyebrow?: string; title?: string; highlight?: string; description?: string }) {
  if (isSupabaseConfigured()) await api.updateVocationalSection(row);
}

/* ============ Auth ============ */

let runtimePassword = ADMIN_PASSWORD;

export function getPassword(): string { return runtimePassword; }
export function setPassword(p: string) {
  if (p.trim().length >= 4) { runtimePassword = p.trim(); authLogout(); }
}
export function authLogin(pass: string): boolean {
  if (pass === getPassword()) { try { localStorage.setItem(AUTH_KEY, "1"); } catch { /* */ } return true; }
  return false;
}
export function authLogout() { try { localStorage.removeItem(AUTH_KEY); } catch { /* */ } }
export function authIsLoggedIn(): boolean { try { return localStorage.getItem(AUTH_KEY) === "1"; } catch { return false; } }

export async function publishChanges(data: AllSiteData): Promise<void> {
  await saveData(data);
}
