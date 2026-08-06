import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Upload, UserRound, Sparkles, Trophy, X } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import { uploadImage, type SiteData } from "@/lib/storage";
import toast from "react-hot-toast";

function ListInput({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => { if (input.trim()) { onChange([...items, input.trim()]); setInput(""); } };
  return (
    <div className="rounded-xl border border-royal-100 bg-white/40 p-4">
      <span className="mb-2 block font-heading text-xs font-semibold text-slate-600 uppercase">{label}</span>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {items.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-royal-100 bg-royal-50 px-2.5 py-1 font-body text-[0.7rem] text-royal-800">
            {s}<button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add item…" className="flex-1 rounded-lg border border-royal-100 px-3 py-2 font-body text-xs outline-none focus:ring-2 focus:ring-royal-100 bg-white" />
        <Button onClick={add}>Add</Button>
      </div>
    </div>
  );
}

export default function ContentPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const [activeTab, setActiveTab] = useState<"hero" | "principal" | "highlights">("hero");
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "bgImage" | "cardImage" | "aboutAImage" | "aboutBImage" | "photoUrl") => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(field);
    try {
      const url = await uploadImage(file, field === "photoUrl" ? "principal" : "hero");
      if (field === "photoUrl") {
        update({ ...data, principal: { ...data.principal, photoUrl: url } });
      } else {
        update({ ...data, hero: { ...data.hero, [field]: url } });
      }
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Layers className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900 sm:text-2xl">Homepage CMS</h2>
        </div>
        <div className="flex rounded-full border border-royal-100 bg-white p-1 shadow-sm">
          {([
            { id: "hero", label: "Hero & Banner", icon: Sparkles },
            { id: "principal", label: "Principal's Message", icon: UserRound },
            { id: "highlights", label: "Highlights", icon: Trophy }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-heading text-xs font-semibold transition ${activeTab === tab.id ? "bg-royal-700 text-white shadow" : "text-slate-500 hover:text-royal-700"}`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "hero" && (
          <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <Card>
              <h3 className="mb-4 font-heading text-sm font-semibold text-royal-900">Hero Section Text</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Top Badge text" value={data.hero.badge} onChange={(v) => update({ ...data, hero: { ...data.hero, badge: v } })} />
                <Input label="Title (Part 1)" value={data.hero.titleA} onChange={(v) => update({ ...data, hero: { ...data.hero, titleA: v } })} />
                <Input label="Title Highlight" value={data.hero.titleHighlight} onChange={(v) => update({ ...data, hero: { ...data.hero, titleHighlight: v } })} />
                <Input label="Title (Part 2)" value={data.hero.titleB} onChange={(v) => update({ ...data, hero: { ...data.hero, titleB: v } })} />
                <Input label="Subtitle" value={data.hero.subtitle} onChange={(v) => update({ ...data, hero: { ...data.hero, subtitle: v } })} textarea className="sm:col-span-2" />
                <Input label="Explore Button label" value={data.hero.exploreBtn} onChange={(v) => update({ ...data, hero: { ...data.hero, exploreBtn: v } })} />
                <Input label="Side Card Title" value={data.hero.cardTitle} onChange={(v) => update({ ...data, hero: { ...data.hero, cardTitle: v } })} />
                <Input label="Side Card Subtitle" value={data.hero.cardSub} onChange={(v) => update({ ...data, hero: { ...data.hero, cardSub: v } })} />
                <Input label="Floating Card 1 Label" value={data.hero.floatA} onChange={(v) => update({ ...data, hero: { ...data.hero, floatA: v } })} />
                <Input label="Floating Card 2 Label" value={data.hero.floatB} onChange={(v) => update({ ...data, hero: { ...data.hero, floatB: v } })} />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-heading text-sm font-semibold text-royal-900">Hero Section Lists</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <ListInput label="Badges (below buttons)" items={data.hero.badges} onChange={(v) => update({ ...data, hero: { ...data.hero, badges: v } })} />
                <ListInput label="Scrolling Marquee Strip Items" items={data.hero.marquee} onChange={(v) => update({ ...data, hero: { ...data.hero, marquee: v } })} />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-heading text-sm font-semibold text-royal-900">Hero & About Section Images</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { field: "bgImage", label: "Hero Background" },
                  { field: "cardImage", label: "Hero Card Image" },
                  { field: "aboutAImage", label: "About Main Image" },
                  { field: "aboutBImage", label: "About Floating Image" }
                ].map((item) => (
                  <div key={item.field} className="flex flex-col gap-2 rounded-xl border border-royal-100 bg-white/40 p-4">
                    <span className="font-heading text-xs font-semibold text-slate-600 uppercase">{item.label}</span>
                    <Input value={(data.hero as any)[item.field]} onChange={(v) => update({ ...data, hero: { ...data.hero, [item.field]: v } })} placeholder="Paste image URL" />
                    <label className="cursor-pointer mt-1">
                      <Button variant="secondary" icon={Upload} loading={uploading === item.field} className="w-full justify-center">Upload</Button>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, item.field as any)} />
                    </label>
                    {(data.hero as any)[item.field] && (
                      <img src={(data.hero as any)[item.field]} alt="" className="mt-2 h-20 w-full rounded-lg object-cover border border-royal-50" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === "principal" && (
          <motion.div key="principal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <h3 className="mb-4 font-heading text-sm font-semibold text-royal-900">Principal's Message Content</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Principal Name" value={data.principal.name} onChange={(v) => update({ ...data, principal: { ...data.principal, name: v } })} />
                <Input label="Designation" value={data.principal.designation} onChange={(v) => update({ ...data, principal: { ...data.principal, designation: v } })} />
                <Input label="Quote (Part 1)" value={data.principal.quoteA} onChange={(v) => update({ ...data, principal: { ...data.principal, quoteA: v } })} />
                <Input label="Quote (Part 2 / Highlighted)" value={data.principal.quoteB} onChange={(v) => update({ ...data, principal: { ...data.principal, quoteB: v } })} />
                <Input label="Paragraph 1" value={data.principal.p1} onChange={(v) => update({ ...data, principal: { ...data.principal, p1: v } })} textarea className="sm:col-span-2" />
                <Input label="Paragraph 2" value={data.principal.p2} onChange={(v) => update({ ...data, principal: { ...data.principal, p2: v } })} textarea className="sm:col-span-2" />
                <Input label="Principal Photo URL" value={data.principal.photoUrl} onChange={(v) => update({ ...data, principal: { ...data.principal, photoUrl: v } })} className="sm:col-span-2" placeholder="Paste URL or upload" />
              </div>
              <div className="mt-3 flex items-center gap-4">
                <label className="cursor-pointer">
                  <Button variant="secondary" icon={Upload} loading={uploading === "photoUrl"}>Upload Photo</Button>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "photoUrl")} />
                </label>
                {data.principal.photoUrl && (
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-royal-100">
                    <img src={data.principal.photoUrl} alt="Principal" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === "highlights" && (
          <motion.div key="highlights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <h3 className="mb-4 font-heading text-sm font-semibold text-royal-900">Homepage Highlights (The 8 key cards)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {data.highlights.map((h, i) => (
                  <div key={i} className="rounded-xl border border-royal-100 bg-white/40 p-4 space-y-3">
                    <span className="rounded-full bg-royal-700 px-2.5 py-0.5 font-heading text-[0.65rem] font-bold text-white uppercase">Card {i + 1}</span>
                    <Input label="Title" value={h.title} onChange={(v) => {
                      const next = [...data.highlights]; next[i] = { ...next[i], title: v };
                      update({ ...data, highlights: next });
                    }} />
                    <Input label="Description" value={h.desc} onChange={(v) => {
                      const next = [...data.highlights]; next[i] = { ...next[i], desc: v };
                      update({ ...data, highlights: next });
                    }} textarea />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
