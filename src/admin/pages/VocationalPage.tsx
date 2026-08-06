import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Wrench, X } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import type { SiteData, VocCourse } from "@/lib/storage";
import toast from "react-hot-toast";

function empty(): VocCourse { return { id: "v" + Date.now(), name: "", tagline: "", intro: "", eligibility: "", duration: "", subjects: [], certificates: [], skills: [], careers: [] }; }

function TagInput({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <span className="mb-1 block font-heading text-[0.68rem] font-semibold text-slate-600 uppercase">{label}</span>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {items.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-royal-100 bg-royal-50 px-2.5 py-1 font-body text-[0.7rem] text-royal-800">
            {s}<button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), input.trim() && (onChange([...items, input.trim()]), setInput("")))}
          placeholder="Add item…" className="flex-1 rounded-lg border border-royal-100 px-2.5 py-1.5 font-body text-xs outline-none focus:ring-2 focus:ring-royal-100" />
        <button type="button" onClick={() => { if (input.trim()) { onChange([...items, input.trim()]); setInput(""); } }} className="rounded-lg bg-royal-700 px-3 py-1 font-body text-xs text-white">Add</button>
      </div>
    </div>
  );
}

export default function VocationalPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const [form, setForm] = useState<VocCourse>(empty());
  const [editing, setEditing] = useState(false);

  const save = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const list = [...data.vocational.courses];
    const idx = list.findIndex((c) => c.id === form.id);
    if (idx >= 0) { list[idx] = form; toast.success("Updated"); }
    else { list.push(form); toast.success("Added"); }
    update({ ...data, vocational: { ...data.vocational, courses: list } });
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Wrench className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900 sm:text-2xl">Vocational</h2>
        </div>
        <Button icon={Plus} onClick={() => { setForm(empty()); setEditing(true); }}>Add Course</Button>
      </div>

      <Card>
        <Input label="Section Eyebrow" value={data.vocational.eyebrow} onChange={(v) => update({ ...data, vocational: { ...data.vocational, eyebrow: v } })} />
        <Input label="Section Description" value={data.vocational.desc} onChange={(v) => update({ ...data, vocational: { ...data.vocational, desc: v } })} textarea className="mt-3" />
      </Card>

      <AnimatePresence>{editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <Card className="mb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-royal-900">Edit Course</h3>
              <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Input label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
              <Input label="Eligibility" value={form.eligibility} onChange={(v) => setForm({ ...form, eligibility: v })} />
              <Input label="Duration" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
              <Input label="Introduction" value={form.intro} onChange={(v) => setForm({ ...form, intro: v })} textarea className="sm:col-span-2" />
            </div>
            <div className="mt-4 space-y-3">
              <TagInput label="Subjects" items={form.subjects} onChange={(v) => setForm({ ...form, subjects: v })} />
              <TagInput label="Certificates" items={form.certificates} onChange={(v) => setForm({ ...form, certificates: v })} />
              <TagInput label="Skills" items={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
              <TagInput label="Career Opportunities" items={form.careers} onChange={(v) => setForm({ ...form, careers: v })} />
            </div>
            <div className="mt-4 flex gap-2"><Button onClick={save}>Save</Button><Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button></div>
          </Card>
        </motion.div>
      )}</AnimatePresence>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.vocational.courses.map((c) => (
          <motion.div key={c.id} layout className="rounded-[1.5rem] border border-white bg-white/80 p-5 shadow-sm backdrop-blur hover:-translate-y-1 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-heading text-sm font-semibold text-royal-900">{c.name}</p>
                <p className="text-[0.7rem] text-gold-600">{c.tagline}</p>
                <p className="text-[0.65rem] text-slate-400">{c.eligibility} · {c.duration}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setForm({ ...c }); setEditing(true); }} className="rounded-lg px-2 py-1 font-heading text-[0.65rem] text-slate-400 hover:text-royal-600">Edit</button>
                <button onClick={() => { update({ ...data, vocational: { ...data.vocational, courses: data.vocational.courses.filter((x) => x.id !== c.id) } }); toast.success("Removed"); }} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.skills.slice(0, 4).map((s, i) => (
                <span key={i} className="rounded-full border border-royal-100 bg-royal-50 px-2 py-0.5 font-body text-[0.6rem] text-royal-700">{s}</span>
              ))}
              {c.skills.length > 4 && <span className="rounded-full bg-slate-100 px-2 py-0.5 font-body text-[0.6rem] text-slate-500">+{c.skills.length - 4}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
