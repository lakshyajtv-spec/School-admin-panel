import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Pin, Plus, Star, Trash2, X } from "lucide-react";
import { AdminBtn, AdminCard, AdminInput, SectionTitle } from "@/admin/components/AdminUI";
import { useToast } from "@/admin/components/Toast";
import type { AllSiteData, NoticeEntity } from "@/admin/store";
import { cn } from "@/utils/cn";

function empty(): NoticeEntity { return { id: `n${Date.now()}`, tag: "", date: "", title: "", body: "", pinned: false, important: false, published: true }; }

export default function NoticesPage({ data, update }: { data: AllSiteData; update: (d: AllSiteData) => void }) {
  const toast = useToast();
  const [form, setForm] = useState<NoticeEntity>(empty());
  const [editing, setEditing] = useState(false);

  const openNew = () => { setForm(empty()); setEditing(true); };
  const openEdit = (n: NoticeEntity) => { setForm({ ...n }); setEditing(true); };
  const save = () => {
    if (!form.title.trim()) { toast("Title is required", "error"); return; }
    const idx = data.notices.findIndex((n) => n.id === form.id);
    let next: NoticeEntity[];
    if (idx >= 0) { next = data.notices.map((n) => (n.id === form.id ? form : n)); toast("Notice updated", "success"); }
    else { next = [...data.notices, form]; toast("Notice added", "success"); }
    update({ ...data, notices: next }); setEditing(false);
  };
  const remove = (id: string) => { update({ ...data, notices: data.notices.filter((n) => n.id !== id) }); toast("Notice removed", "success"); };
  const togglePin = (n: NoticeEntity) => { update({ ...data, notices: data.notices.map((x) => (x.id === n.id ? { ...x, pinned: !x.pinned } : x)) }); };

  return (
    <div className="space-y-5">
      <SectionTitle icon={Bell} title="Notice Board">
        <AdminBtn icon={Plus} onClick={openNew}>New Notice</AdminBtn>
      </SectionTitle>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <AdminCard className="mb-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-royal-900">{form.title ? "Edit Notice" : "New Notice"}</h3>
                <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput label="Tag" value={form.tag} onChange={(v) => setForm({ ...form, tag: v })} placeholder="e.g. Latest Notice" />
                <AdminInput label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="e.g. Current Session" />
                <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Notice title" className="sm:col-span-2" />
                <AdminInput label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} placeholder="Notice content" textarea className="sm:col-span-2" />
              </div>
              <div className="mt-3 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={() => setForm({ ...form, pinned: !form.pinned })} className="accent-royal-600" />
                  <span className="font-body text-xs text-slate-600">Pin this notice</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.important} onChange={() => setForm({ ...form, important: !form.important })} className="accent-gold-500" />
                  <span className="font-body text-xs text-slate-600">Mark as Important</span>
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <AdminBtn onClick={save}>Save Notice</AdminBtn>
                <AdminBtn variant="secondary" onClick={() => setEditing(false)}>Cancel</AdminBtn>
              </div>
            </AdminCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.notices.map((n) => (
          <motion.div key={n.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-[1.5rem] border bg-white/85 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1",
              n.pinned ? "border-gold-300 bg-gold-50/60" : "border-white")}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-royal-100 px-2.5 py-0.5 font-body text-[0.65rem] font-bold text-royal-700 uppercase">{n.tag}</span>
                {n.pinned && <Pin className="h-3.5 w-3.5 text-gold-500" />}
                {n.important && <Star className="h-3.5 w-3.5 text-gold-400" />}
              </div>
              <div className="flex gap-1">
                <button onClick={() => togglePin(n)} className="rounded-lg p-1 text-slate-300 hover:text-gold-500"><Pin className="h-3.5 w-3.5" /></button>
                <button onClick={() => openEdit(n)} className="rounded-lg p-1 text-slate-300 hover:text-royal-600"><span className="font-heading text-[0.65rem]">Edit</span></button>
                <button onClick={() => remove(n.id)} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <p className="mt-2 font-heading text-sm font-semibold text-royal-900">{n.title}</p>
            <p className="mt-1 font-body text-[0.75rem] text-slate-500">{n.body.slice(0, 100)}{n.body.length > 100 ? "…" : ""}</p>
            <span className="mt-2 inline-block font-body text-[0.65rem] text-slate-400">{n.date}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
