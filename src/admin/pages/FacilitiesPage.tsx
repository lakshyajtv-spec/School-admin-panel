import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Plus, Trash2, X } from "lucide-react";
import { AdminBtn, AdminCard, AdminInput, SectionTitle } from "@/admin/components/AdminUI";
import { useToast } from "@/admin/components/Toast";
import type { AllSiteData, FacilityEntity } from "@/admin/store";

function empty(): FacilityEntity { return { id: `f${Date.now()}`, icon: "", title: "", desc: "", meta: "" }; }

const iconSuggestions = ["cpu","flask","beaker","leaf","circuit","library","droplets","volleyball","cctv","wifi","book","monitor","shield"];

export default function FacilitiesPage({ data, update }: { data: AllSiteData; update: (d: AllSiteData) => void }) {
  const toast = useToast();
  const [form, setForm] = useState<FacilityEntity>(empty());
  const [editing, setEditing] = useState(false);

  const openNew = () => { setForm(empty()); setEditing(true); };
  const openEdit = (f: FacilityEntity) => { setForm({ ...f }); setEditing(true); };
  const save = () => {
    if (!form.title.trim()) { toast("Title is required", "error"); return; }
    const idx = data.facilities.findIndex((f) => f.id === form.id);
    let next: FacilityEntity[];
    if (idx >= 0) { next = data.facilities.map((f) => (f.id === form.id ? form : f)); toast("Facility updated", "success"); }
    else { next = [...data.facilities, form]; toast("Facility added", "success"); }
    update({ ...data, facilities: next }); setEditing(false);
  };
  const remove = (id: string) => { update({ ...data, facilities: data.facilities.filter((f) => f.id !== id) }); toast("Facility removed", "success"); };

  return (
    <div className="space-y-5">
      <SectionTitle icon={Building2} title="Facilities">
        <AdminBtn icon={Plus} onClick={openNew}>Add Facility</AdminBtn>
      </SectionTitle>

      <AnimatePresence>{editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <AdminCard className="mb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-royal-900">Edit Facility</h3>
              <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Facility name" />
              <AdminInput label="Meta Badge" value={form.meta} onChange={(v) => setForm({ ...form, meta: v })} placeholder="e.g. Vocational Use" />
              <AdminInput label="Description" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} placeholder="Facility description" textarea className="sm:col-span-2" />
              <AdminInput label="Icon" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} placeholder="Icon name" />
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-body text-[0.65rem] text-slate-400">Suggestions:</span>
                {iconSuggestions.map((ic) => (
                  <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })} className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] transition ${form.icon === ic ? "bg-royal-700 text-white" : "bg-slate-100 text-slate-500 hover:bg-royal-100"}`}>{ic}</button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <AdminBtn onClick={save}>Save Facility</AdminBtn>
              <AdminBtn variant="secondary" onClick={() => setEditing(false)}>Cancel</AdminBtn>
            </div>
          </AdminCard>
        </motion.div>
      )}</AnimatePresence>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.facilities.map((f) => (
          <motion.div key={f.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="group rounded-[1.5rem] border border-white bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white text-sm font-bold uppercase">{f.icon.slice(0, 2)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-sm font-semibold text-royal-900">{f.title}</p>
                    <span className="rounded-full bg-gold-100 px-2 py-0.5 font-body text-[0.6rem] font-bold text-gold-700 uppercase">{f.meta}</span>
                  </div>
                  <p className="mt-1 font-body text-[0.72rem] text-slate-500">{f.desc.slice(0, 80)}{f.desc.length > 80 ? "…" : ""}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(f)} className="rounded-lg p-1 text-slate-300 hover:text-royal-600"><span className="font-heading text-[0.65rem]">Edit</span></button>
                <button onClick={() => remove(f.id)} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
