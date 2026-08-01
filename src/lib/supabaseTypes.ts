/** Minimal typed Database definition for the school website */

export interface Database {
  public: {
    Tables: {
      website_settings: {
        Row: WebsiteSettingsRow;
        Insert: Partial<WebsiteSettingsRow>;
        Update: Partial<WebsiteSettingsRow>;
      };
      social_links: { Row: SocialLinkRow; Insert: { platform?: string; url?: string; position?: number }; Update: { platform?: string; url?: string; position?: number } };
      teachers: {
        Row: TeacherRow; Insert: TeacherInsert; Update: Partial<TeacherInsert>;
      };
      gallery: { Row: GalleryRow; Insert: GalleryInsert; Update: Partial<GalleryInsert> };
      notices: { Row: NoticeRow; Insert: NoticeInsert; Update: Partial<NoticeInsert> };
      facilities: { Row: FacilityRow; Insert: FacilityInsert; Update: Partial<FacilityInsert> };
      achievements: { Row: AchievementRow; Insert: AchievementInsert; Update: Partial<AchievementInsert> };
      vocational_section: { Row: { id: number; eyebrow: string; title: string; highlight: string; description: string }; Insert: { id?: number; eyebrow?: string; title?: string; highlight?: string; description?: string }; Update: { eyebrow?: string; title?: string; highlight?: string; description?: string } };
      vocational_courses: { Row: VocationalCourseRow; Insert: VocationalCourseInsert; Update: Partial<VocationalCourseInsert> };
      vocational_subjects: { Row: { id: number; course_id: string; subject: string }; Insert: { course_id: string; subject: string }; Update: { subject?: string } };
      vocational_certificates: { Row: { id: number; course_id: string; certificate: string }; Insert: { course_id: string; certificate: string }; Update: { certificate?: string } };
      vocational_skills: { Row: { id: number; course_id: string; skill: string }; Insert: { course_id: string; skill: string }; Update: { skill?: string } };
      vocational_careers: { Row: { id: number; course_id: string; career: string }; Insert: { course_id: string; career: string }; Update: { career?: string } };
      hero_section: { Row: HeroSectionRow; Insert: Partial<HeroSectionRow>; Update: Partial<HeroSectionRow> };
      hero_marquee: { Row: { id: number; text: string; position: number }; Insert: { text: string; position: number }; Update: { text?: string; position?: number } };
      principal: { Row: PrincipalRow; Insert: Partial<PrincipalRow>; Update: Partial<PrincipalRow> };
    };
  };
}

export interface WebsiteSettingsRow {
  id: number;
  school_name: string;
  school_name_caps: string;
  school_place: string;
  logo_url: string;
  favicon: string;
  address: string;
  phone: string;
  email: string;
  map_embed: string;
  footer_about: string;
  footer_dev_credit: string;
}

export interface SocialLinkRow { id: number; platform: string; url: string; position: number }

export interface TeacherRow {
  id: string; name: string; photo: string; subject: string;
  designation: string; qualification: string; experience: string;
  display_order: number;
}
export type TeacherInsert = Omit<TeacherRow, "id"> & { id?: string };

export interface GalleryRow {
  id: string; image_url: string; category: string; title: string;
  caption: string; display_order: number;
}
export type GalleryInsert = Omit<GalleryRow, "id"> & { id?: string };

export interface NoticeRow {
  id: string; tag: string; notice_date: string; title: string;
  body: string; pinned: boolean; important: boolean; published: boolean;
}
export type NoticeInsert = Omit<NoticeRow, "id"> & { id?: string };

export interface FacilityRow {
  id: string; icon_name: string; title: string; description: string;
  meta_badge: string; display_order: number;
}
export type FacilityInsert = Omit<FacilityRow, "id"> & { id?: string };

export interface AchievementRow {
  id: string; period: string; tag: string; title: string;
  body: string; display_order: number;
}
export type AchievementInsert = Omit<AchievementRow, "id"> & { id?: string };

export interface VocationalCourseRow {
  id: string; name: string; tagline: string; intro: string;
  eligibility: string; duration: string; display_order: number;
}
export type VocationalCourseInsert = Omit<VocationalCourseRow, "id"> & { id?: string };

export interface HeroSectionRow {
  id: number;
  badge_text: string; title_a: string; title_highlight: string;
  title_b: string; subtitle: string; explore_btn: string;
  card_title: string; card_subtitle: string;
  float_label_a: string; float_label_b: string;
  badge1: string; badge2: string; badge3: string;
  bg_image_url: string; card_image_url: string;
}

export interface PrincipalRow {
  id: number; name: string; designation: string;
  quote_a: string; quote_b: string;
  paragraph1: string; paragraph2: string;
  photo_url: string; note: string;
}
