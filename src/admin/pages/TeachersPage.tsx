import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, Trash2, Users, X } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import type { SiteData, Teacher } from "@/lib/storage";
import toast from "react-hot-toast";

function empty(): Teacher { return { id: "t" + Date.now(), name: "", photo: "", subject: "", designation: "Subject Teacher", qualification: "", experience: "", order: 0 }; }

export default function TeachersPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Teacher>(empty());
  const [editing, setEditing] = useState(false);

  const teachers = data.teachers.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openNew = () => { setForm(empty()); setEditing(true); };
  const openEdit = (t: Teacher) => { setForm({ ...t }); setEditing(true); };

  const save = () => {
    if (!form.subject.trim()) { toast.error("Subject is required"); return; }
    const list = [...data.teachers];
    const idx = list.findIndex((t) => t.id === form.id);
    if (idx >= 0) { list[idx] = form; toast.success("Teacher updated"); }
    else { list.push(form); toast.success("Teacher added"); }
    update({ ...data, teachers: list.map((t, i) => ({ ...t, order: i })) });
    setEditing(false);
  };

  const remove = (id: string) => {
    update({ ...data, teachers: data.teachers.filter((t) => t.id !== id) });
    toast.success("Teacher removed");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Users className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900 sm:text-2xl">Teachers</h2>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search…" value={search} onChange={setSearch} className="w-40" />
          <Button icon={Plus} onClick={openNew}>Add Teacher</Button>
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="mb-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-royal-900">{form.name || "New Teacher"}</h3>
                <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Input label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
                <Input label="Designation" value={form.designation} onChange={(v) => setForm({ ...form, designation: v })} />
                <Input label="Qualification" value={form.qualification} onChange={(v) => setForm({ ...form, qualification: v })} />
                <Input label="Experience" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} />
                <Input label="Photo URL" value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} />
              </div>
              {form.photo && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-royal-100">
                    <img src={form.photo} alt="" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <span className="font-body text-xs text-slate-400">Photo preview</span>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button icon={Save} onClick={save}>Save</Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teachers.map((t) => (
          <motion.div key={t.id} layout className="group rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-[0_10px_30px_-16px_rgba(15,76,129,.5)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-royal-500 to-gold-400 p-[2px]"><div className="h-full w-full rounded-full bg-white" /></div>
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] rounded-full object-cover" />
                ) : (
                  <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-royal-50 text-royal-400 text-xs font-bold uppercase">{t.subject.slice(0, 2)}</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-semibold text-royal-900">{t.name || t.subject}</p>
                <p className="text-[0.7rem] text-gold-600">{t.subject}</p>
                <p className="text-[0.65rem] text-slate-500">{t.designation}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <button onClick={() => openEdit(t)} className="flex-1 rounded-lg py-1.5 text-center font-heading text-xs font-semibold text-royal-700 hover:bg-royal-50 transition">Edit</button>
              <button onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 transition"><Trash2 className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
