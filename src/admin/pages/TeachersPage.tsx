import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, GripVertical, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { AdminBtn, AdminCard, AdminInput, SectionTitle } from "@/admin/components/AdminUI";
import { useToast } from "@/admin/components/Toast";
import type { AllSiteData, TeacherEntity } from "@/admin/store";

function emptyTeacher(): TeacherEntity {
  return { id: "", name: "", photo: "", subject: "", designation: "", qualification: "", experience: "" };
}

export default function TeachersPage({ data, update }: { data: AllSiteData; update: (d: AllSiteData) => void }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TeacherEntity>(emptyTeacher());
  const [editing, setEditing] = useState(false);

  const teachers = data.teachers.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm({ ...emptyTeacher(), id: `t${Date.now()}` });
    setEditId(null);
    setEditing(true);
  };
  const openEdit = (t: TeacherEntity) => {
    setForm({ ...t });
    setEditId(t.id);
    setEditing(true);
  };
  const closeForm = () => setEditing(false);

  const save = () => {
    if (!form.subject.trim()) { toast("Subject is required", "error"); return; }
    let next: TeacherEntity[];
    if (editId) {
      next = teachers.map((t) => (t.id === editId ? form : t));
      toast("Teacher updated", "success");
    } else {
      next = [...teachers, form];
      toast("Teacher added", "success");
    }
    update({ ...data, teachers: next });
    closeForm();
  };

  const remove = (id: string) => {
    update({ ...data, teachers: teachers.filter((t) => t.id !== id) });
    toast("Teacher removed", "success");
  };

  const move = (idx: number, dir: number) => {
    const list = [...teachers];
    const swap = idx + dir;
    if (swap < 0 || swap >= list.length) return;
    [list[idx], list[swap]] = [list[swap], list[idx]];
    update({ ...data, teachers: list });
  };

  return (
    <div className="space-y-5">
      <SectionTitle icon={ArrowUpDown} title="Teachers Management">
        <div className="flex items-center gap-2">
          <AdminInput placeholder="Search teachers…" value={search} onChange={setSearch} className="w-44" />
          <AdminBtn icon={Plus} onClick={openNew}>Add Teacher</AdminBtn>
        </div>
      </SectionTitle>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <AdminCard className="mb-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-royal-900">{editId ? "Edit Teacher" : "New Teacher"}</h3>
                <button onClick={closeForm} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Teacher name" />
                <AdminInput label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} placeholder="e.g. Mathematics" />
                <AdminInput label="Designation" value={form.designation} onChange={(v) => setForm({ ...form, designation: v })} placeholder="e.g. Subject Teacher" />
                <AdminInput label="Qualification" value={form.qualification} onChange={(v) => setForm({ ...form, qualification: v })} placeholder="e.g. M.Sc., B.Ed." />
                <AdminInput label="Experience" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} placeholder="e.g. 12 years" />
                <AdminInput label="Photo URL" value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} placeholder="Paste image URL" />
              </div>
              {form.photo && (
                <div className="mt-3 h-20 w-20 overflow-hidden rounded-full border-2 border-royal-100">
                  <img src={form.photo} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; }} />
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <AdminBtn icon={Save} onClick={save}>{editId ? "Update Teacher" : "Add Teacher"}</AdminBtn>
                <AdminBtn variant="secondary" onClick={closeForm}>Cancel</AdminBtn>
              </div>
            </AdminCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teacher grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teachers.map((t, i) => (
          <motion.div
            key={t.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="group rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-[0_10px_30px_-16px_rgba(15,76,129,.5)] backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-royal-500 to-gold-400 p-[2px]">
                  <div className="h-full w-full rounded-full bg-white" />
                </div>
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] rounded-full object-cover" />
                ) : (
                  <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-royal-50 text-royal-400">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-semibold text-royal-900">{t.name || t.subject}</p>
                <p className="text-[0.7rem] text-gold-600">{t.subject}</p>
                <p className="text-[0.65rem] text-slate-500">{t.designation}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <button onClick={() => move(i, -1)} className="rounded-lg p-1.5 text-slate-300 transition hover:bg-royal-50 hover:text-royal-600" title="Move up"><GripVertical className="h-4 w-4" /></button>
              <button onClick={() => openEdit(t)} className="flex-1 rounded-lg py-1.5 text-center font-heading text-xs font-semibold text-royal-700 transition hover:bg-royal-50">Edit</button>
              <button onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
