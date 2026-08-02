/**
 * Zod validation schemas for all CMS forms.
 */
import { z } from "zod";

export const teacherFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  qualification: z.string(),
  experience: z.string(),
  designation: z.string(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;

export const noticeFormSchema = z.object({
  tag: z.string().min(1, "Tag is required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  date: z.string(),
  pinned: z.boolean(),
  important: z.boolean(),
  status: z.enum(["published", "draft"]),
  publishDate: z.string(),
  expiryDate: z.string(),
});

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;

export const galleryFormSchema = z.object({
  title: z.string(),
  caption: z.string(),
  category: z.string(),
});

export type GalleryFormValues = z.infer<typeof galleryFormSchema>;

export const settingsFormSchema = z.object({
  logo: z.string(),
  favicon: z.string(),
  themeColor: z.string(),
  principalPhoto: z.string(),
  address: z.string().min(1, "Address is required"),
  phone: z.string(),
  email: z.string().email("Invalid email").or(z.literal("")),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
