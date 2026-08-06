import { useState } from "react";
import { KeyRound, Plus, Save, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Card } from "@/admin/components/ui/Card";
import { Input } from "@/admin/components/ui/Input";
import { setPassword, type SiteData } from "@/lib/storage";
import toast from "react-hot-toast";

export default function SettingsPage({ data, update }: { data: SiteData; update: (d: SiteData) => void }) {
  const s = data.settings;
  const [newPass, setNewPass] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Settings2 className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900">Website Settings</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="School Name" value={s.schoolName} onChange={(v) => update({ ...data, settings: { ...s, schoolName: v } })} />
          <Input label="Short Name (Caps)" value={s.schoolNameCaps} onChange={(v) => update({ ...data, settings: { ...s, schoolNameCaps: v } })} />
          <Input label="Place" value={s.schoolPlace} onChange={(v) => update({ ...data, settings: { ...s, schoolPlace: v } })} />
          <Input label="Address" value={s.address} onChange={(v) => update({ ...data, settings: { ...s, address: v } })} textarea />
          <Input label="Phone" value={s.phone} onChange={(v) => update({ ...data, settings: { ...s, phone: v } })} />
          <Input label="Email" value={s.email} onChange={(v) => update({ ...data, settings: { ...s, email: v } })} />
          <Input label="Logo URL" value={s.logoUrl} onChange={(v) => update({ ...data, settings: { ...s, logoUrl: v } })} placeholder="https://..." />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-royal-900">Social Links</h3>
          <Button icon={Plus} variant="secondary" onClick={() => {
            update({ ...data, settings: { ...s, socialLinks: [...s.socialLinks, { platform: "", url: "" }] } });
          }}>Add Link</Button>
        </div>
        <div className="space-y-2">
          {s.socialLinks.map((sl, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input placeholder="Platform" value={sl.platform} onChange={(v) => {
                const next = [...s.socialLinks]; next[i] = { ...next[i], platform: v };
                update({ ...data, settings: { ...s, socialLinks: next } });
              }} className="flex-1" />
              <Input placeholder="URL" value={sl.url} onChange={(v) => {
                const next = [...s.socialLinks]; next[i] = { ...next[i], url: v };
                update({ ...data, settings: { ...s, socialLinks: next } });
              }} className="flex-1" />
              <button onClick={() => update({ ...data, settings: { ...s, socialLinks: s.socialLinks.filter((_, j) => j !== i) } })} className="rounded-lg p-2 text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-heading text-sm font-semibold text-royal-900">Footer</h3>
        <Input label="About Text" value={s.footerAbout} onChange={(v) => update({ ...data, settings: { ...s, footerAbout: v } })} textarea />
        <Input label="Developer Credit" value={s.footerDevCredit} onChange={(v) => update({ ...data, settings: { ...s, footerDevCredit: v } })} className="mt-3" />
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><KeyRound className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900">Admin Settings</h2>
        </div>
        <h3 className="mb-3 font-heading text-sm font-semibold text-royal-900">Change Password</h3>
        <div className="flex flex-wrap items-end gap-3">
          <Input label="New Password" value={newPass} onChange={setNewPass} type="password" className="w-full max-w-xs" />
          <Button icon={Save} onClick={() => {
            if (newPass.trim().length < 4) { toast.error("Min 4 characters"); return; }
            setPassword(newPass.trim());
            setNewPass("");
            toast.success("Password updated");
          }}>Update</Button>
        </div>
      </Card>
    </div>
  );
}
