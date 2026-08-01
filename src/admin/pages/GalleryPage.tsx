import { useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { AdminBtn, AdminCard, AdminInput, SectionTitle } from "@/admin/components/AdminUI";
import { useToast } from "@/admin/components/Toast";
import type { AllSiteData, GalleryEntity } from "@/admin/store";

function empty(): GalleryEntity { return { id: `g${Date.now()}`, src: "", category: "campus", title: "", caption: "" }; }

export default function GalleryPage({ data, update }: { data: AllSiteData; update: (d: AllSiteData) => void }) {
  const toast = useToast();
  const [form, setForm] = useState<GalleryEntity>(empty());
  const [editing, setEditing] = useState(false);

  const openNew = () => { setForm(empty()); setEditing(true); };
  const openEdit = (g: GalleryEntity) => { setForm({ ...g }); setEditing(true); };
  const save = () => {
    if (!form.src.trim()) { toast("Image URL is required", "error"); return; }
    const idx = data.gallery.findIndex((g) => g.id === form.id);
    let next: GalleryEntity[];
    if (idx >= 0) { next = data.gallery.map((g) => (g.id === form.id ? form : g)); toast("Image updated", "success"); }
    else { next = [...data.gallery, form]; toast("Image added", "success"); }
    update({ ...data, gallery: next }); setEditing(false);
  };
  const remove = (id: string) => {
    update({ ...data, gallery: data.gallery.filter((g) => g.id !== id) });
    toast("Image removed", "success");
  };

  return (
    <div className="space-y-5">
      <SectionTitle icon={ImagePlus} title="Gallery Management">
        <AdminBtn icon={Plus} onClick={openNew}>Add Image</AdminBtn>
      </SectionTitle>

      {editing && (
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-royal-900">Add / Edit Image</h3>
            <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Image URL" value={form.src} onChange={(v) => setForm({ ...form, src: v })} placeholder="Paste image URL" className="sm:col-span-2" />
            <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. School Building" />
            <AdminInput label="Caption" value={form.caption} onChange={(v) => setForm({ ...form, caption: v })} placeholder="Short description" />
          </div>
          {form.src && <img src={form.src} alt="Preview" className="mt-3 h-24 w-full rounded-xl object-cover border border-royal-100" />}
          <div className="mt-4 flex gap-2">
            <AdminBtn onClick={save}>Save Image</AdminBtn>
            <AdminBtn variant="secondary" onClick={() => setEditing(false)}>Cancel</AdminBtn>
          </div>
        </AdminCard>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {data.gallery.map((g) => (
          <motion.div key={g.id} layout className="group relative overflow-hidden rounded-[1.25rem] border border-white/80 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <img src={g.src} alt={g.title} className="h-32 w-full object-cover" />
            <div className="p-3">
              <p className="truncate font-heading text-[0.8rem] font-semibold text-royal-900">{g.title}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <button onClick={() => openEdit(g)} className="rounded-full bg-white/90 p-1.5 text-royal-600 shadow hover:bg-white"><ImagePlus className="h-3.5 w-3.5" /></button>
              <button onClick={() => remove(g.id)} className="rounded-full bg-white/90 p-1.5 text-red-500 shadow hover:bg-white"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
