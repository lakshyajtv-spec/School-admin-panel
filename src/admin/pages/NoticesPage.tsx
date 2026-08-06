import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Pin, Plus, Star, Trash2, X } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import type { SiteData, Notice } from "@/lib/storage";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";

function empty(): Notice { return { id: "n" + Date.now(), tag: "", date: "", title: "", body: "", pinned: false, important: false, published: true }; }

export default function NoticesPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const [form, setForm] = useState<Notice>(empty());
  const [editing, setEditing] = useState(false);

  const save = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const list = [...data.notices];
    const idx = list.findIndex((n) => n.id === form.id);
    if (idx >= 0) { list[idx] = form; toast.success("Notice updated"); }
    else { list.push(form); toast.success("Notice added"); }
    update({ ...data, notices: list });
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Bell className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900 sm:text-2xl">Notice Board</h2>
        </div>
        <Button icon={Plus} onClick={() => { setForm(empty()); setEditing(true); }}>New Notice</Button>
      </div>

      <AnimatePresence>{editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <Card className="mb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-royal-900">Edit Notice</h3>
              <button onClick={() => setEditing(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Tag" value={form.tag} onChange={(v) => setForm({ ...form, tag: v })} placeholder="e.g. Latest" />
              <Input label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} className="sm:col-span-2" />
              <Input label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea className="sm:col-span-2" />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.pinned} onChange={() => setForm({ ...form, pinned: !form.pinned })} className="accent-royal-600" /><span className="font-body text-xs text-slate-600">Pinned</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.important} onChange={() => setForm({ ...form, important: !form.important })} className="accent-gold-500" /><span className="font-body text-xs text-slate-600">Important</span></label>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </Card>
        </motion.div>
      )}</AnimatePresence>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.notices.map((n) => (
          <motion.div key={n.id} layout className={cn("rounded-[1.5rem] border bg-white/85 p-5 shadow-sm backdrop-blur hover:-translate-y-1 transition", n.pinned ? "border-gold-300 bg-gold-50/60" : "border-white")}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-royal-100 px-2.5 py-0.5 font-body text-[0.65rem] font-bold text-royal-700 uppercase">{n.tag}</span>
                {n.pinned && <Pin className="h-3.5 w-3.5 text-gold-500" />}
                {n.important && <Star className="h-3.5 w-3.5 text-gold-400" />}
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setForm({ ...n }); setEditing(true); }} className="rounded-lg px-2 py-1 font-heading text-[0.65rem] text-slate-400 hover:text-royal-600 hover:bg-royal-50">Edit</button>
                <button onClick={() => { update({ ...data, notices: data.notices.filter((x) => x.id !== n.id) }); toast.success("Removed"); }} className="rounded-lg p-1 text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <p className="mt-2 font-heading text-sm font-semibold text-royal-900">{n.title}</p>
            <p className="mt-1 font-body text-[0.75rem] text-slate-500">{n.body.slice(0, 100)}</p>
            <span className="mt-2 inline-block font-body text-[0.65rem] text-slate-400">{n.date}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
