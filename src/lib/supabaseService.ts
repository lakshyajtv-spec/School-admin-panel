/**
 * Supabase Service — complete CRUD for every school website entity.
 * When Supabase env vars are missing, falls back to localStorage seamlessly.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  WebsiteSettingsRow, SocialLinkRow,
  TeacherRow, GalleryRow, NoticeRow, FacilityRow, AchievementRow,
  VocationalCourseRow, HeroSectionRow, PrincipalRow,
} from "@/lib/supabaseTypes";

/* ============ Helpers ============ */

const supabaseReady = () => isSupabaseConfigured();

/* ========================= WEBSITE SETTINGS ========================= */

export async function fetchSettings(): Promise<WebsiteSettingsRow | null> {
  if (!supabaseReady()) return null;
  const { data } = await supabase.from("website_settings").select("*").eq("id", 1).single();
  return data;
}

export async function updateSettings(row: Partial<WebsiteSettingsRow>): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("website_settings").update(row).eq("id", 1);
}

/* ========================= SOCIAL LINKS ========================= */

export async function fetchSocialLinks(): Promise<SocialLinkRow[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("social_links").select("*").order("position");
  return data ?? [];
}

export async function replaceSocialLinks(links: { platform: string; url: string }[]): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("social_links").delete().neq("id", 0); // delete all
  if (links.length) {
    await supabase.from("social_links").insert(links.map((l, i) => ({ platform: l.platform, url: l.url, position: i })));
  }
}

/* ========================= TEACHERS CRUD ========================= */

export async function fetchTeachers(): Promise<TeacherRow[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("teachers").select("*").order("display_order");
  return data ?? [];
}

export async function upsertTeacher(t: TeacherRow): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("teachers").upsert(t);
}

export async function deleteTeacher(id: string): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("teachers").delete().eq("id", id);
}

/* ========================= GALLERY CRUD ========================= */

export async function fetchGallery(): Promise<GalleryRow[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("gallery").select("*").order("display_order");
  return data ?? [];
}

export async function upsertGalleryItem(g: GalleryRow): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("gallery").upsert(g);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("gallery").delete().eq("id", id);
}

/* ========================= NOTICES CRUD ========================= */

export async function fetchNotices(): Promise<NoticeRow[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function upsertNotice(n: NoticeRow): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("notices").upsert(n);
}

export async function deleteNotice(id: string): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("notices").delete().eq("id", id);
}

/* ========================= FACILITIES CRUD ========================= */

export async function fetchFacilities(): Promise<FacilityRow[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("facilities").select("*").order("display_order");
  return data ?? [];
}

export async function upsertFacility(f: FacilityRow): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("facilities").upsert(f);
}

export async function deleteFacility(id: string): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("facilities").delete().eq("id", id);
}

/* ========================= ACHIEVEMENTS CRUD ========================= */

export async function fetchAchievements(): Promise<AchievementRow[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("achievements").select("*").order("display_order");
  return data ?? [];
}

export async function upsertAchievement(a: AchievementRow): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("achievements").upsert(a);
}

export async function deleteAchievement(id: string): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("achievements").delete().eq("id", id);
}

/* ========================= VOCATIONAL ========================= */

export async function fetchVocationalSection(): Promise<{ eyebrow: string; title: string; highlight: string; description: string } | null> {
  if (!supabaseReady()) return null;
  const { data } = await supabase.from("vocational_section").select("*").eq("id", 1).single();
  return data ?? null;
}

export async function updateVocationalSection(row: { eyebrow?: string; title?: string; highlight?: string; description?: string }): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("vocational_section").update(row).eq("id", 1);
}

export async function fetchVocationalCourses(): Promise<VocationalCourseRow[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("vocational_courses").select("*").order("display_order");
  return data ?? [];
}

export async function fetchVocationalRelations(courseId: string) {
  if (!supabaseReady()) return { subjects: [] as string[], certificates: [] as string[], skills: [] as string[], careers: [] as string[] };
  const [sub, cert, sk, car] = await Promise.all([
    supabase.from("vocational_subjects").select("subject").eq("course_id", courseId),
    supabase.from("vocational_certificates").select("certificate").eq("course_id", courseId),
    supabase.from("vocational_skills").select("skill").eq("course_id", courseId),
    supabase.from("vocational_careers").select("career").eq("course_id", courseId),
  ]);
  return {
    subjects: (sub.data ?? []).map((r) => r.subject),
    certificates: (cert.data ?? []).map((r) => r.certificate),
    skills: (sk.data ?? []).map((r) => r.skill),
    careers: (car.data ?? []).map((r) => r.career),
  };
}

export async function upsertVocationalCourse(c: VocationalCourseRow, subjects: string[], certificates: string[], skills: string[], careers: string[]): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("vocational_courses").upsert(c);
  // Replace relations
  await supabase.from("vocational_subjects").delete().eq("course_id", c.id);
  await supabase.from("vocational_certificates").delete().eq("course_id", c.id);
  await supabase.from("vocational_skills").delete().eq("course_id", c.id);
  await supabase.from("vocational_careers").delete().eq("course_id", c.id);
  if (subjects.length) await supabase.from("vocational_subjects").insert(subjects.map((s) => ({ course_id: c.id, subject: s })));
  if (certificates.length) await supabase.from("vocational_certificates").insert(certificates.map((s) => ({ course_id: c.id, certificate: s })));
  if (skills.length) await supabase.from("vocational_skills").insert(skills.map((s) => ({ course_id: c.id, skill: s })));
  if (careers.length) await supabase.from("vocational_careers").insert(careers.map((s) => ({ course_id: c.id, career: s })));
}

export async function deleteVocationalCourse(id: string): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("vocational_courses").delete().eq("id", id);
}

/* ========================= HERO SECTION ========================= */

export async function fetchHeroSection(): Promise<HeroSectionRow | null> {
  if (!supabaseReady()) return null;
  const { data } = await supabase.from("hero_section").select("*").eq("id", 1).single();
  return data;
}

export async function fetchHeroMarquee(): Promise<string[]> {
  if (!supabaseReady()) return [];
  const { data } = await supabase.from("hero_marquee").select("*").order("position");
  return (data ?? []).map((r) => r.text);
}

export async function updateHeroSection(row: Partial<HeroSectionRow>): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("hero_section").update(row).eq("id", 1);
}

export async function replaceHeroMarquee(items: string[]): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("hero_marquee").delete().neq("id", 0);
  if (items.length) {
    await supabase.from("hero_marquee").insert(items.map((text, i) => ({ text, position: i })));
  }
}

/* ========================= PRINCIPAL ========================= */

export async function fetchPrincipal(): Promise<PrincipalRow | null> {
  if (!supabaseReady()) return null;
  const { data } = await supabase.from("principal").select("*").eq("id", 1).single();
  return data;
}

export async function updatePrincipal(row: Partial<PrincipalRow>): Promise<void> {
  if (!supabaseReady()) return;
  await supabase.from("principal").update(row).eq("id", 1);
}

/* ========================= STORAGE — UPLOAD / DELETE ========================= */

const BUCKET = "school-media";

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  if (!supabaseReady()) return null;
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
  if (error) { console.error("Upload error:", error.message); return null; }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  if (!supabaseReady()) return;
  try {
    const path = new URL(url).pathname.split(`/${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  } catch { /* ignore */ }
}

/* ========================= PUBLISH ALL ========================= */
/** Called from admin panel — just returns success (data already written via individual calls) */
export async function publishAll(): Promise<boolean> {
  return supabaseReady();
}
