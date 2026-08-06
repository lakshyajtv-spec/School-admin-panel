import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trophy, Trash2, X } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import type { SiteData, Achievement } from "@/lib/storage";
import toast from "react-hot-toast";

function empty(): Achievement { return { id: "a" + Date.now(), period: "", tag: "", title: "", body: "" }; }

export default function AchievementsPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const [form, setForm] = useState<Achievement>(empty());
  const [editing, setEditing] = useState(false);

  const save = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const list = [...data.achievements];
    const idx = list.findIndex((a) => a.id === form.id);
    if (idx >= 0) { list[idx] = form; toast.success("Updated"); }
    else { list.push(form); toast.success("Added"); }
    update({ ...data, achievements: list });
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Trophy className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900 sm:text-2xl">Achievements</h2>
        </div>
        <Button icon={Plus} onClick={() => { setForm(empty()); setEditing(true); }}>Add</Button>
      </div>

      {editing && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-royal-900">Edit Achievement</h3>
            <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Period" value={form.period} onChange={(v) => setForm({ ...form, period: v })} placeholder="e.g. Annual" />
            <Input label="Tag" value={form.tag} onChange={(v) => setForm({ ...form, tag: v })} placeholder="e.g. Sports" />
            <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} className="sm:col-span-2" />
            <Input label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea className="sm:col-span-2" />
          </div>
          <div className="mt-4 flex gap-2"><Button onClick={save}>Save</Button><Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button></div>
        </Card>
      )}

      <div className="space-y-3">
        {data.achievements.map((a) => (
          <motion.div key={a.id} layout className="group rounded-[1.25rem] border border-white bg-white/80 p-4 shadow-sm backdrop-blur hover:-translate-y-1 transition">
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
                <button onClick={() => { setForm({ ...a }); setEditing(true); }} className="rounded-lg px-2 py-1 font-heading text-[0.65rem] text-slate-400 hover:text-royal-600">Edit</button>
                <button onClick={() => { update({ ...data, achievements: data.achievements.filter((x) => x.id !== a.id) }); toast.success("Removed"); }} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
