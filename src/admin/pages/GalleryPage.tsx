import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import { uploadImage, type SiteData, type GalleryItem } from "@/lib/storage";
import toast from "react-hot-toast";

function empty(): GalleryItem { return { id: "g" + Date.now(), image_url: "", title: "", caption: "", order: 0 }; }

export default function GalleryPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const [form, setForm] = useState<GalleryItem>(empty());
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openNew = () => { setForm(empty()); setEditing(true); };
  const openEdit = (g: GalleryItem) => { setForm({ ...g }); setEditing(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "gallery");
      setForm({ ...form, image_url: url });
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const save = () => {
    if (!form.image_url.trim()) { toast.error("Image URL is required"); return; }
    const list = [...data.gallery];
    const idx = list.findIndex((g) => g.id === form.id);
    if (idx >= 0) { list[idx] = form; toast.success("Image updated"); }
    else { list.push(form); toast.success("Image added"); }
    update({ ...data, gallery: list });
    setEditing(false);
  };

  const remove = (id: string) => {
    update({ ...data, gallery: data.gallery.filter((g) => g.id !== id) });
    toast.success("Image removed");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Image className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900 sm:text-2xl">Gallery</h2>
        </div>
        <Button icon={Plus} onClick={openNew}>Add Image</Button>
      </div>

      {editing && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-royal-900">Edit Image</h3>
            <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Input label="Caption" value={form.caption} onChange={(v) => setForm({ ...form, caption: v })} />
            <Input label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="Paste URL or upload" className="sm:col-span-2" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label className="cursor-pointer">
              <Button icon={Upload} variant="secondary" loading={uploading}>Upload Image</Button>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
            <span className="font-body text-xs text-slate-400">or paste a URL above</span>
          </div>
          {form.image_url && <img src={form.image_url} alt="Preview" className="mt-3 h-24 w-full rounded-xl border border-royal-100 object-cover" />}
          <div className="mt-4 flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {data.gallery.map((g) => (
          <motion.div key={g.id} layout className="group relative overflow-hidden rounded-[1.25rem] border border-white/80 bg-white/80 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
            <img src={g.image_url} alt={g.title} className="h-32 w-full object-cover" />
            <div className="p-3"><p className="truncate font-heading text-[0.8rem] font-semibold text-royal-900">{g.title}</p></div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => openEdit(g)} className="rounded-full bg-white/90 p-1.5 text-royal-600 shadow hover:bg-white">Edit</button>
              <button onClick={() => remove(g.id)} className="rounded-full bg-white/90 p-1.5 text-red-500 shadow hover:bg-white"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
