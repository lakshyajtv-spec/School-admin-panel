import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, Wrench, X } from "lucide-react";
import { AdminBtn, AdminCard, AdminInput, SectionTitle } from "@/admin/components/AdminUI";
import { useToast } from "@/admin/components/Toast";
import type { AllSiteData, VocationalCourse } from "@/admin/store";

function empty(): VocationalCourse { return { id: `v${Date.now()}`, name: "", tagline: "", intro: "", eligibility: "", duration: "", subjects: [], certificates: [], skills: [], careers: [] }; }

function TagList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => { if (input.trim()) { onChange([...items, input.trim()]); setInput(""); } };
  return (
    <div>
      <span className="mb-1 block font-heading text-[0.68rem] font-semibold text-slate-600 uppercase">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-royal-100 bg-royal-50 px-2.5 py-1 font-body text-[0.7rem] text-royal-800">
            {s}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="ml-0.5 text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add item…" className="flex-1 rounded-lg border border-royal-100 px-2.5 py-1.5 font-body text-xs outline-none focus:ring-2 focus:ring-royal-100" />
        <button type="button" onClick={add} className="rounded-lg bg-royal-700 px-3 py-1 font-body text-xs text-white">Add</button>
      </div>
    </div>
  );
}

export default function VocationalPage({ data, update }: { data: AllSiteData; update: (d: AllSiteData) => void }) {
  const toast = useToast();
  const [form, setForm] = useState<VocationalCourse>(empty());
  const [editing, setEditing] = useState(false);

  const openNew = () => { setForm(empty()); setEditing(true); };
  const openEdit = (v: VocationalCourse) => { setForm({ ...v, subjects: [...v.subjects], certificates: [...v.certificates], skills: [...v.skills], careers: [...v.careers] }); setEditing(true); };
  const save = () => {
    if (!form.name.trim()) { toast("Course name is required", "error"); return; }
    const idx = data.vocational.courses.findIndex((c) => c.id === form.id);
    let next: VocationalCourse[];
    if (idx >= 0) { next = data.vocational.courses.map((c) => (c.id === form.id ? form : c)); toast("Course updated", "success"); }
    else { next = [...data.vocational.courses, form]; toast("Course added", "success"); }
    update({ ...data, vocational: { ...data.vocational, courses: next } }); setEditing(false);
  };
  const remove = (id: string) => { update({ ...data, vocational: { ...data.vocational, courses: data.vocational.courses.filter((c) => c.id !== id) } }); toast("Course removed", "success"); };

  return (
    <div className="space-y-5">
      <SectionTitle icon={Wrench} title="Vocational Education">
        <AdminBtn icon={Plus} onClick={openNew}>Add Course</AdminBtn>
      </SectionTitle>

      <AdminCard>
        <AdminInput label="Section Eyebrow" value={data.vocational.eyebrow} onChange={(v) => update({ ...data, vocational: { ...data.vocational, eyebrow: v } })} placeholder="e.g. NSQF Skill Education" />
        <AdminInput label="Section Description" value={data.vocational.desc} onChange={(v) => update({ ...data, vocational: { ...data.vocational, desc: v } })} placeholder="Section description" textarea className="mt-3" />
      </AdminCard>

      <AnimatePresence>{editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <AdminCard className="mb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-royal-900">{form.name ? "Edit Course" : "New Course"}</h3>
              <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Course Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. IT / ITES" />
              <AdminInput label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} placeholder="Short description" />
              <AdminInput label="Eligibility" value={form.eligibility} onChange={(v) => setForm({ ...form, eligibility: v })} />
              <AdminInput label="Duration" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
              <AdminInput label="Introduction" value={form.intro} onChange={(v) => setForm({ ...form, intro: v })} textarea className="sm:col-span-2" />
            </div>
            <div className="mt-4 space-y-3">
              <TagList label="Subjects" items={form.subjects} onChange={(v) => setForm({ ...form, subjects: v })} />
              <TagList label="Certificates" items={form.certificates} onChange={(v) => setForm({ ...form, certificates: v })} />
              <TagList label="Skills" items={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
              <TagList label="Career Opportunities" items={form.careers} onChange={(v) => setForm({ ...form, careers: v })} />
            </div>
            <div className="mt-4 flex gap-2">
              <AdminBtn onClick={save}>Save Course</AdminBtn>
              <AdminBtn variant="secondary" onClick={() => setEditing(false)}>Cancel</AdminBtn>
            </div>
          </AdminCard>
        </motion.div>
      )}</AnimatePresence>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.vocational.courses.map((c) => (
          <motion.div key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-white bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><BookOpen className="h-5 w-5" /></div>
                <div>
                  <p className="font-heading text-sm font-semibold text-royal-900">{c.name}</p>
                  <p className="text-[0.7rem] text-gold-600">{c.tagline}</p>
                  <p className="text-[0.65rem] text-slate-400">{c.eligibility} · {c.duration}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="rounded-lg p-1 text-slate-300 hover:text-royal-600"><span className="font-heading text-[0.65rem]">Edit</span></button>
                <button onClick={() => remove(c.id)} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.skills.slice(0, 4).map((s, i) => (
                <span key={i} className="rounded-full border border-royal-100 bg-royal-50 px-2 py-0.5 font-body text-[0.6rem] text-royal-700">{s}</span>
              ))}
              {c.skills.length > 4 && <span className="rounded-full bg-slate-100 px-2 py-0.5 font-body text-[0.6rem] text-slate-500">+{c.skills.length - 4} more</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
