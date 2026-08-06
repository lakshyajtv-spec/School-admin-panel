import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import type { SiteData, Facility } from "@/lib/storage";
import toast from "react-hot-toast";

function empty(): Facility { return { id: "f" + Date.now(), icon: "", title: "", desc: "", meta: "" }; }

const icons = ["computer","flask","beaker","leaf","circuit","library","droplets","volleyball","cctv","wifi","book","monitor","shield"];

export default function FacilitiesPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const [form, setForm] = useState<Facility>(empty());
  const [editing, setEditing] = useState(false);

  const save = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const list = [...data.facilities];
    const idx = list.findIndex((f) => f.id === form.id);
    if (idx >= 0) { list[idx] = form; toast.success("Updated"); }
    else { list.push(form); toast.success("Added"); }
    update({ ...data, facilities: list });
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Building2 className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900 sm:text-2xl">Facilities</h2>
        </div>
        <Button icon={Plus} onClick={() => { setForm(empty()); setEditing(true); }}>Add Facility</Button>
      </div>

      <AnimatePresence>{editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <Card className="mb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-royal-900">Edit Facility</h3>
              <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <Input label="Meta Badge" value={form.meta} onChange={(v) => setForm({ ...form, meta: v })} />
              <Input label="Description" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} textarea className="sm:col-span-2" />
            </div>
            <div className="mt-3">
              <span className="mb-1.5 block font-heading text-[0.68rem] font-semibold tracking-wide text-slate-600 uppercase">Icon (keyword)</span>
              <div className="flex flex-wrap gap-1.5">
                {icons.map((ic) => (
                  <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[0.65rem] transition ${form.icon === ic ? "bg-royal-700 text-white" : "bg-slate-100 text-slate-500 hover:bg-royal-100"}`}>{ic}</button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2"><Button onClick={save}>Save</Button><Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button></div>
          </Card>
        </motion.div>
      )}</AnimatePresence>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.facilities.map((f) => (
          <motion.div key={f.id} layout className="group rounded-[1.5rem] border border-white bg-white/80 p-4 shadow-sm backdrop-blur hover:-translate-y-1 transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white text-xs font-bold uppercase">{f.icon.slice(0, 2)}</div>
                <div>
                  <div className="flex items-center gap-2"><p className="font-heading text-sm font-semibold text-royal-900">{f.title}</p><span className="rounded-full bg-gold-100 px-2 py-0.5 font-body text-[0.6rem] font-bold text-gold-700 uppercase">{f.meta}</span></div>
                  <p className="mt-1 font-body text-[0.72rem] text-slate-500">{f.desc.slice(0, 80)}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setForm({ ...f }); setEditing(true); }} className="rounded-lg px-2 py-1 font-heading text-[0.65rem] text-slate-400 hover:text-royal-600">Edit</button>
                <button onClick={() => { update({ ...data, facilities: data.facilities.filter((x) => x.id !== f.id) }); toast.success("Removed"); }} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
