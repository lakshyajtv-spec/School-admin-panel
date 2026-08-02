/**
 * Supabase Storage service — all image uploads go through here.
 * Images land in the public 'school-images' bucket; the public URL is
 * saved into the content database.
 * When Supabase is not configured, images fall back to compressed
 * data-URLs (localStorage mode) — the UI never breaks.
 */
import { supabase, isSupabaseConfigured } from "@/cms/lib/supabase";

export const STORAGE_BUCKET = "school-images";

/** Compress + resize a File to a data-URL (used for preview / local fallback). */
export function fileToDataUrl(
  file: File,
  maxW = 1280,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image to Supabase Storage.
 * @param file   image file
 * @param folder teachers | gallery | branding | principal
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    console.info("[cms/storage] Supabase not configured — using local data-URL.");
    return fileToDataUrl(file, 1280, 0.82);
  }

  const ext = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Delete an image from storage by its public URL (best-effort). */
export async function deleteImageByUrl(publicUrl: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const bucket = supabase.storage.from(STORAGE_BUCKET);
    // Extract the object path from the public URL
    const marker = `/object/public/${STORAGE_BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = publicUrl.slice(idx + marker.length).split("?")[0];
    if (path) await bucket.remove([path]);
  } catch (err) {
    console.warn("[cms/storage] Delete failed (ignored):", err);
  }
}
