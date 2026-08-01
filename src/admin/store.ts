/**
 * Complete Admin CMS Data Store
 *
 * All website content lives here. The main website reads from the `useWebsiteData`
 * hook, and the admin panel writes through this store. Every change is persisted
 * to localStorage, so edits appear on the public site instantly.
 *
 * Architecture: ready to swap localStorage → REST/GraphQL API without touching UI.
 */

import { STORAGE_PREFIX } from "@/config/admin";

/* ============ Entity Types ============ */

export interface TeacherEntity {
  id: string;
  name: string;
  photo: string;
  subject: string;
  designation: string;
  qualification: string;
  experience: string;
}

export interface GalleryEntity {
  id: string;
  src: string;
  category: string;
  title: string;
  caption: string;
}

export interface NoticeEntity {
  id: string;
  tag: string;
  date: string;
  title: string;
  body: string;
  pinned: boolean;
  important: boolean;
  published: boolean;
}

export interface FacilityEntity {
  id: string;
  icon: string;
  title: string;
  desc: string;
  meta: string;
}

export interface AchievementEntity {
  id: string;
  period: string;
  tag: string;
  title: string;
  body: string;
}

export interface VocationalCourse {
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

export interface WebsiteSettings {
  schoolName: string;
  schoolNameCaps: string;
  schoolPlace: string;
  logoUrl: string;
  favicon: string;
  address: string;
  phone: string;
  email: string;
  mapEmbed: string;
  socialLinks: { platform: string; url: string }[];
  footerAbout: string;
  footerDevCredit: string;
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
    eyebrow: string;
    title: string;
    highlight: string;
    desc: string;
    courses: VocationalCourse[];
  };
}

/* ============ Defaults ============ */

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

export const DEFAULT_GALLERY: GalleryEntity[] = (() => {
  const urls = [
    "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    "https://images.pexels.com/photos/35551059/pexels-photo-35551059.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/35550999/pexels-photo-35550999.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/8472004/pexels-photo-8472004.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/5530438/pexels-photo-5530438.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/8927020/pexels-photo-8927020.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
    "https://images.pexels.com/photos/35551044/pexels-photo-35551044.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    "https://images.pexels.com/photos/13812360/pexels-photo-13812360.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
  ];
  const captions = [
    "School Building", "Classroom", "Library", "Chemistry Practical",
    "Computer Lab", "Playground", "Biology Lab", "School Activities",
  ];
  return urls.map((src, i) => ({
    id: `g${i + 1}`, src, category: "campus",
    title: captions[i], caption: captions[i],
  }));
})();

export const DEFAULT_NOTICES: NoticeEntity[] = [
  { id: "n1", tag: "Latest Notice", date: "Current Session", title: "Parent–Teacher Meeting", body: "Parents are requested to visit the school as per the notified date.", pinned: true, important: false, published: true },
  { id: "n2", tag: "Exam Schedule", date: "Current Session", title: "Half-Yearly & Board Exam Timetable", body: "Examination timetables are displayed on the school notice board.", pinned: false, important: false, published: true },
  { id: "n3", tag: "Holiday List", date: "Current Session", title: "Government Holiday Calendar", body: "The school follows the holiday calendar issued by the Education Department.", pinned: false, important: false, published: true },
  { id: "n4", tag: "Vocational", date: "Current Session", title: "Vocational Trade Selection for Class 9", body: "Students may choose between IT/ITES and Electronics & Hardware.", pinned: false, important: true, published: true },
];

export const DEFAULT_FACILITIES: FacilityEntity[] = [
  { id: "f1", icon: "cpu", title: "Computer Lab", desc: "Used for IT/ITES vocational practicals, typing practice and basic computer education.", meta: "Vocational Use" },
  { id: "f2", icon: "flask", title: "Physics Lab", desc: "Apparatus for board-level practical work in mechanics, optics and electricity.", meta: "Senior Wing" },
  { id: "f3", icon: "beaker", title: "Chemistry Lab", desc: "Reagents, glassware and work benches for prescribed practical experiments.", meta: "Practical Work" },
  { id: "f4", icon: "leaf", title: "Biology Lab", desc: "Microscopes, charts and specimens for senior class biology practicals.", meta: "Senior Classes" },
  { id: "f5", icon: "circuit", title: "Electronics & Hardware Lab", desc: "Tool kits, components and computer hardware for the vocational trade.", meta: "Vocational Trade" },
  { id: "f6", icon: "library", title: "Library", desc: "Textbooks, reference books, competitive exam material and a reading space.", meta: "Reading Room" },
  { id: "f7", icon: "droplets", title: "Drinking Water", desc: "Clean drinking water arrangement available for students on campus.", meta: "Campus Wide" },
  { id: "f8", icon: "volleyball", title: "Playground", desc: "Open ground used for morning assembly, sports periods and school events.", meta: "Sports & Assembly" },
];

export const DEFAULT_ACHIEVEMENTS: AchievementEntity[] = [
  { id: "a1", period: "Every Year", tag: "Academics", title: "Board Examination Preparation", body: "Regular tests, revision classes and extra doubt-clearing sessions for Class 10 and 12 students." },
  { id: "a2", period: "Every Year", tag: "Vocational", title: "Vocational Practical Training", body: "Hands-on practical classes and NSQF skill assessment for IT/ITES and Electronics & Hardware students." },
  { id: "a3", period: "Annual", tag: "Sports", title: "Sports Day & District Participation", body: "Annual sports meet on the school ground and participation in district level school competitions." },
  { id: "a4", period: "Annual", tag: "Science", title: "Science Exhibition", body: "Students prepare working models and charts for the school and district level science exhibition." },
  { id: "a5", period: "As Notified", tag: "Scholarships", title: "Government Scholarship Assistance", body: "Help with scholarship forms, documents and online submission as per state government schemes." },
];

export const DEFAULT_VOCATIONAL: VocationalCourse[] = [
  {
    id: "v1", name: "IT / ITES", tagline: "Information Technology & IT Enabled Services",
    intro: "The IT/ITES trade introduces students to computers, office software and basic web technology.",
    eligibility: "Class 9 onwards", duration: "4 years (Class 9–12)",
    subjects: ["Computer fundamentals", "Word processing", "Spreadsheets", "Internet & email"],
    certificates: ["NSQF Level 3 (Class 9–10)", "NSQF Level 5 (Class 11–12)"],
    skills: ["Computer fundamentals", "Word processing & documentation", "Spreadsheets & data entry", "Presentations", "Internet, email & digital safety", "Basic web page design (HTML/CSS)"],
    careers: ["Data entry operator", "Computer operator", "Customer care executive", "IT support assistant"],
  },
  {
    id: "v2", name: "Electronics & Hardware", tagline: "Electronics, Computer Hardware & Repair",
    intro: "The Electronics & Hardware trade teaches students how electronic components and computer systems actually work.",
    eligibility: "Class 9 onwards", duration: "4 years (Class 9–12)",
    subjects: ["Basic electronics", "Soldering", "Computer assembly", "Troubleshooting"],
    certificates: ["NSQF Level 3 (Class 9–10)", "NSQF Level 5 (Class 11–12)"],
    skills: ["Basic electronics & components", "Soldering and circuit basics", "Computer assembly & peripherals", "Installation & troubleshooting", "Electrical safety practices", "Basic networking & CCTV concepts"],
    careers: ["Computer hardware technician", "Field technician", "Electronics repair assistant", "CCTV / installation helper"],
  },
];

export const DEFAULT_SETTINGS: WebsiteSettings = {
  schoolName: "Govt. Boys H. S. School Cantt, Guna",
  schoolNameCaps: "GOVT. BOYS H. S. SCHOOL",
  schoolPlace: "Cantt, Guna",
  logoUrl: "",
  favicon: "",
  address: "Cantt Area, Guna, Madhya Pradesh – 473001",
  phone: "",
  email: "",
  mapEmbed: "",
  socialLinks: [],
  footerAbout: "A government higher secondary school in Guna (M.P.) working under the Education For All (EFA) initiative.",
  footerDevCredit: "Website Designed & Developed by Lakshya Jatav",
};

function defaults(): AllSiteData {
  return {
    settings: structuredClone(DEFAULT_SETTINGS),
    hero: {},
    about: {},
    principal: {},
    highlights: {},
    teachers: structuredClone(DEFAULT_TEACHERS),
    gallery: structuredClone(DEFAULT_GALLERY),
    notices: structuredClone(DEFAULT_NOTICES),
    facilities: structuredClone(DEFAULT_FACILITIES),
    achievements: structuredClone(DEFAULT_ACHIEVEMENTS),
    vocational: { eyebrow: "NSQF Skill Education", title: "Vocational", highlight: "Education", desc: "Vocational education starts from Class 9.", courses: structuredClone(DEFAULT_VOCATIONAL) },
  };
}

/* ============ Storage ============ */

const KEY = `${STORAGE_PREFIX}-cms-data-v2`;
const AUTH_KEY = `${STORAGE_PREFIX}-auth`;

export function loadData(): AllSiteData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AllSiteData;
      if (parsed && parsed.settings) return parsed;
    }
  } catch { /* corrupt */ }
  return defaults();
}

export function saveData(d: AllSiteData) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage full */ }
}

export function resetAllData(): AllSiteData {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  return defaults();
}

export function exportJSON(d: AllSiteData) {
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gbhss-cms-full-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseImportJSON(text: string): AllSiteData | null {
  try {
    const d = JSON.parse(text) as AllSiteData;
    if (d && d.settings && typeof d.settings.schoolName === "string") return d;
  } catch { /* invalid */ }
  return null;
}

/* ============ Auth (password override) ============ */

import { ADMIN_PASSWORD } from "@/config/admin";

/** Only here for backwards compat — real password is in config/admin.ts */
let runtimePassword = ADMIN_PASSWORD;

export function getPassword(): string { return runtimePassword; }

export function setPassword(p: string) {
  if (p.trim().length >= 4) {
    runtimePassword = p.trim();
    authLogout(); // force re-login with new password
  }
}

export function authLogin(pass: string): boolean {
  if (pass === getPassword()) {
    try { localStorage.setItem(AUTH_KEY, "1"); } catch { /* */ }
    return true;
  }
  return false;
}

export function authLogout() {
  try { localStorage.removeItem(AUTH_KEY); } catch { /* */ }
}

export function authIsLoggedIn(): boolean {
  try { return localStorage.getItem(AUTH_KEY) === "1"; } catch { return false; }
}

/* ============ Backend-Ready Service Layer ============ */

export async function publishChanges(data: AllSiteData): Promise<void> {
  saveData(data);
  // When connecting a backend, replace with:
  // await fetch(`${API_BASE}/site/publish`, { method: "POST", body: JSON.stringify(data) });
  return Promise.resolve();
}
