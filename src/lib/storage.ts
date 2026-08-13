/** 
 * localStorage + Appwrite unified data adapter — always returns valid data, never throws.
 * Appwrite Cloud is the single source of truth for the production deployment.
 */
import { STORAGE_KEYS } from "@/config/admin";
import { databases, storage, account, isAppwriteReady, APPWRITE_CONFIG } from "@/lib/appwrite";
import { ID } from "appwrite";

const BUCKET_ID = APPWRITE_CONFIG.bucketId;
const DATABASE_ID = APPWRITE_CONFIG.databaseId;
const COLLECTION_ID = "website_content"; // Single collection storing all unified CMS documents

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

/* ---------- Auth (Appwrite Cloud based) ---------- */
import { ADMIN_PASSWORD } from "@/config/admin";

let runtimePassword = ADMIN_PASSWORD;

export function getPassword() { return runtimePassword; }
export function setPassword(p: string) { if (p.trim().length >= 4) { runtimePassword = p.trim(); authLogout(); } }

/** Logs in using Appwrite Auth Session or localStorage fallback if Appwrite is not configured */
export async function authLogin(email: string, pass: string): Promise<boolean> {
  if (isAppwriteReady()) {
    try {
      // Clear previous session if any
      try { await account.deleteSession("current"); } catch { /* */ }
      await account.createEmailPasswordSession(email, pass);
      lsSet(STORAGE_KEYS.auth, "1");
      return true;
    } catch (error: any) {
      console.error("[Auth] Appwrite login failed:", error.message || error);
      throw new Error(error.message || "Authentication failed. Check credentials.");
    }
  }

  // Fallback mode: standard password check
  if (pass === getPassword()) {
    lsSet(STORAGE_KEYS.auth, "1");
    return true;
  }
  return false;
}

/** Logs out and destroys the Appwrite session */
export async function authLogout(): Promise<void> {
  if (isAppwriteReady()) {
    try {
      await account.deleteSession("current");
    } catch { /* */ }
  }
  lsSet(STORAGE_KEYS.auth, "");
}

export function authIsLoggedIn(): boolean {
  return lsGet<string>(STORAGE_KEYS.auth, "") === "1";
}

/* ---------- Image upload (Appwrite Storage, falls back to passthrough URL) ---------- */
export async function uploadImage(file: File, _folder: string): Promise<string> {
  if (!isAppwriteReady()) return URL.createObjectURL(file);
  try {
    const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
    // Retrieve public view URL
    const fileUrl = `${APPWRITE_CONFIG.endpoint}/storage/buckets/${BUCKET_ID}/files/${response.$id}/view?project=${APPWRITE_CONFIG.projectId}`;
    return fileUrl;
  } catch (error: any) {
    console.error("[Storage] Upload failed:", error);
    throw new Error(error.message || "File upload failed.");
  }
}

export async function deleteImage(url: string) {
  if (!isAppwriteReady()) return;
  try {
    // Extract file ID from view URL
    const fileId = url.split("/files/")[1]?.split("/")[0];
    if (fileId) await storage.deleteFile(BUCKET_ID, fileId);
  } catch { /* */ }
}

/* ==========================================================================
   APPWRITE CMS UNIFIED DOCUMENT INTEGRATION LAYER
   ========================================================================== */

/** Asynchronously fetches and compiles completely fresh website content from Appwrite */
export async function fetchFromAppwrite(): Promise<SiteData | null> {
  if (!isAppwriteReady()) {
    console.log("[CMS Storage] Appwrite not configured. Using high-performance localStorage fallback.");
    return null;
  }

  try {
    const documentId = "master_cms_data";
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, documentId);
    if (doc && doc.data) {
      const parsedSiteData = JSON.parse(doc.data) as SiteData;
      // Cache locally for instant startup
      lsSet(STORAGE_KEYS.data, parsedSiteData);
      return parsedSiteData;
    }
    return null;
  } catch (error: any) {
    // If document doesn't exist yet, we attempt to initialize it with defaults
    if (error.code === 404) {
      console.log("[CMS Storage] Document not found. Initializing master document on first-time load...");
      const fresh = defaultsSiteData();
      try {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, "master_cms_data", { data: JSON.stringify(fresh) });
        return fresh;
      } catch (createErr) {
        console.warn("[CMS Storage] Auto-initialization skipped (check Collection attributes/permissions):", createErr);
      }
    }
    console.error("[CMS Storage] Appwrite database load failed. Falling back to local cached copy:", error);
    return null;
  }
}

/** Publishes website changes immediately to the unified Appwrite document */
export async function publishToAppwrite(d: SiteData): Promise<void> {
  if (!isAppwriteReady()) {
    console.warn("[CMS Storage] Appwrite NOT ready or unconfigured. Skipping remote sync.");
    return;
  }

  // Save locally first to guarantee zero state friction
  saveSiteData(d);

  try {
    const documentId = "master_cms_data";
    // Check if exists
    let exists = false;
    try {
      await databases.getDocument(DATABASE_ID, COLLECTION_ID, documentId);
      exists = true;
    } catch { /* */ }

    if (exists) {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, {
        data: JSON.stringify(d)
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, documentId, {
        data: JSON.stringify(d)
      });
    }
    console.log("[CMS Storage] Successfully published unified data to Appwrite Cloud.");
  } catch (error: any) {
    console.error("[CMS Storage] Failed to publish changes to Appwrite:", error);
    throw new Error(error.message || "Appwrite publication failed. Check collection permissions or configuration.");
  }
}
