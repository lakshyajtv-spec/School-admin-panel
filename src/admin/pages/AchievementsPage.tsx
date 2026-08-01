import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trophy, Trash2, X } from "lucide-react";
import { AdminBtn, AdminCard, AdminInput, SectionTitle } from "@/admin/components/AdminUI";
import { useToast } from "@/admin/components/Toast";
import type { AllSiteData, AchievementEntity } from "@/admin/store";

function empty(): AchievementEntity { return { id: `a${Date.now()}`, period: "", tag: "", title: "", body: "" }; }

export default function AchievementsPage({ data, update }: { data: AllSiteData; update: (d: AllSiteData) => void }) {
  const toast = useToast();
  const [form, setForm] = useState<AchievementEntity>(empty());
  const [editing, setEditing] = useState(false);

  const openNew = () => { setForm(empty()); setEditing(true); };
  const openEdit = (a: AchievementEntity) => { setForm({ ...a }); setEditing(true); };
  const save = () => {
    if (!form.title.trim()) { toast("Title is required", "error"); return; }
    const idx = data.achievements.findIndex((a) => a.id === form.id);
    let next: AchievementEntity[];
    if (idx >= 0) { next = data.achievements.map((a) => (a.id === form.id ? form : a)); toast("Achievement updated", "success"); }
    else { next = [...data.achievements, form]; toast("Achievement added", "success"); }
    update({ ...data, achievements: next }); setEditing(false);
  };
  const remove = (id: string) => { update({ ...data, achievements: data.achievements.filter((a) => a.id !== id) }); toast("Achievement removed", "success"); };

  return (
    <div className="space-y-5">
      <SectionTitle icon={Trophy} title="Achievements & Activities">
        <AdminBtn icon={Plus} onClick={openNew}>Add Achievement</AdminBtn>
      </SectionTitle>

      {editing && (
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-royal-900">Edit Achievement</h3>
            <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Period" value={form.period} onChange={(v) => setForm({ ...form, period: v })} placeholder="e.g. Annual" />
            <AdminInput label="Tag" value={form.tag} onChange={(v) => setForm({ ...form, tag: v })} placeholder="e.g. Sports" />
            <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Achievement title" className="sm:col-span-2" />
            <AdminInput label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} placeholder="Description" textarea className="sm:col-span-2" />
          </div>
          <div className="mt-4 flex gap-2">
            <AdminBtn onClick={save}>Save Achievement</AdminBtn>
            <AdminBtn variant="secondary" onClick={() => setEditing(false)}>Cancel</AdminBtn>
          </div>
        </AdminCard>
      )}

      <div className="space-y-3">
        {data.achievements.map((a) => (
          <motion.div key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="group rounded-[1.25rem] border border-white bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-royal-700 px-2.5 py-0.5 font-body text-[0.65rem] font-bold text-white">{a.period}</span>
                  <span className="rounded-full bg-gold-100 px-2.5 py-0.5 font-body text-[0.65rem] font-bold text-gold-700 uppercase">{a.tag}</span>
                </div>
                <p className="mt-2 font-heading text-sm font-semibold text-royal-900">{a.title}</p>
                <p className="mt-1 font-body text-[0.72rem] text-slate-500">{a.body}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => openEdit(a)} className="rounded-lg p-1 text-slate-300 hover:text-royal-600"><span className="font-heading text-[0.65rem]">Edit</span></button>
                <button onClick={() => remove(a.id)} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
