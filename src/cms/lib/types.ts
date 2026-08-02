/**
 * Shared CMS types + default data.
 * The website frontend consumes these exact shapes via LanguageContext,
 * so the public site and the admin CMS stay fully compatible.
 */
import { en, hi, type Content } from "@/i18n/content";
import { DEFAULT_IMAGES } from "@/data/site";

export interface TeacherRecord {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  designation: string;
  photo: string; // Supabase Storage URL or data-URL (local fallback)
}

export interface NoticeRecord {
  id: string;
  tag: string;
  date: string;
  title: string;
  body: string;
  pinned: boolean;
  important: boolean;
  status: "published" | "draft";
  publishDate: string; // YYYY-MM-DD (empty = now)
  expiryDate: string; // YYYY-MM-DD (empty = never)
}

export interface GalleryRecord {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  logo: string;
  favicon: string;
  themeColor: string;
  principalPhoto: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
}

export interface ImageSet {
  hero: string;
  heroCard: string;
  aboutA: string;
  aboutB: string;
  gallery: string[];
}

export interface SiteData {
  en: Content;
  hi: Content;
  images: ImageSet;
  teachers: TeacherRecord[];
  notices: NoticeRecord[];
  gallery: GalleryRecord[];
  settings: SiteSettings;
  publishedAt: string | null;
}

/* ------------------------------ helpers ------------------------------ */

export function uid(): string {
  return (
    Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
  );
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/* --------------------------- default data --------------------------- */

export function defaultSiteData(): SiteData {
  const teachers: TeacherRecord[] = (en.teachers.list as typeof en.teachers.list).map(
    (x, i) => ({
      id: uid() + i,
      name: "",
      subject: x.subject,
      qualification: "",
      experience: "",
      designation: x.designation,
      photo: "",
    }),
  );
  const notices: NoticeRecord[] = (en.notices.items as typeof en.notices.items).map(
    (x, i) => ({
      id: uid() + i,
      tag: x.tag,
      date: x.date,
      title: x.title,
      body: x.body,
      pinned: false,
      important: false,
      status: "published" as const,
      publishDate: "",
      expiryDate: "",
    }),
  );
  const gallery: GalleryRecord[] = DEFAULT_IMAGES.gallery.map((src, i) => ({
    id: uid() + i,
    src,
    title: en.gallery.items[i]?.title ?? "",
    caption: en.gallery.items[i]?.caption ?? "",
    category: "",
  }));

  return {
    en: structuredClone(en) as unknown as Content,
    hi: structuredClone(hi) as unknown as Content,
    images: { ...DEFAULT_IMAGES, gallery: [...DEFAULT_IMAGES.gallery] },
    teachers,
    notices,
    gallery,
    settings: {
      logo: "",
      favicon: "",
      themeColor: "#0F4C81",
      principalPhoto: "",
      address: "Cantt Area, Guna, Madhya Pradesh – 473001",
      phone: "+91 XXXXX XXXXX",
      email: "office@gbhss-guna.example",
      socialLinks: [
        { label: "Website", url: "" },
        { label: "YouTube", url: "" },
        { label: "Instagram", url: "" },
      ],
    },
    publishedAt: null,
  };
}
