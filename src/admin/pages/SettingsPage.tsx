import { useState } from "react";
import { AdminBtn, AdminCard, AdminInput, SectionTitle } from "@/admin/components/AdminUI";
import { useToast } from "@/admin/components/Toast";
import { KeyRound, Link2, Plus, Save, Settings2, Trash2 } from "lucide-react";
import { setPassword } from "@/admin/store";
import type { AllSiteData } from "@/admin/store";

export default function SettingsPage({ data, update }: { data: AllSiteData; update: (d: AllSiteData) => void }) {
  const toast = useToast();
  const s = data.settings;
  const setS = (patch: Partial<typeof s>) => update({ ...data, settings: { ...s, ...patch } });

  const [newPass, setNewPass] = useState("");
  const changePass = () => {
    if (newPass.trim().length < 4) { toast("Password must be at least 4 characters", "error"); return; }
    setPassword(newPass.trim()); setNewPass("");
    toast("Admin password updated", "success");
  };

  return (
    <div className="space-y-6">
      {/* School Info */}
      <AdminCard>
        <SectionTitle icon={Settings2} title="Website Settings" />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="School Name" value={s.schoolName} onChange={(v) => setS({ schoolName: v })} />
          <AdminInput label="Short Name (Caps)" value={s.schoolNameCaps} onChange={(v) => setS({ schoolNameCaps: v })} />
          <AdminInput label="Place" value={s.schoolPlace} onChange={(v) => setS({ schoolPlace: v })} />
          <AdminInput label="Phone" value={s.phone} onChange={(v) => setS({ phone: v })} placeholder="+91 XXXXXXXXXX" />
          <AdminInput label="Email" value={s.email} onChange={(v) => setS({ email: v })} />
          <AdminInput label="Address" value={s.address} onChange={(v) => setS({ address: v })} textarea className="sm:col-span-2" />
          <AdminInput label="Logo URL" value={s.logoUrl} onChange={(v) => setS({ logoUrl: v })} placeholder="Paste logo image URL" className="sm:col-span-2" />
        </div>
      </AdminCard>

      {/* Social Links */}
      <AdminCard>
        <SectionTitle icon={Link2} title="Social Links">
          <AdminBtn icon={Plus} onClick={() => setS({ socialLinks: [...s.socialLinks, { platform: "", url: "" }] })}>Add Link</AdminBtn>
        </SectionTitle>
        <div className="space-y-2">
          {s.socialLinks.map((sl, i) => (
            <div key={i} className="flex items-center gap-2">
              <AdminInput placeholder="Platform (e.g. Facebook)" value={sl.platform} onChange={(v) => {
                const next = [...s.socialLinks]; next[i] = { ...next[i], platform: v }; setS({ socialLinks: next });
              }} className="flex-1" />
              <AdminInput placeholder="URL" value={sl.url} onChange={(v) => {
                const next = [...s.socialLinks]; next[i] = { ...next[i], url: v }; setS({ socialLinks: next });
              }} className="flex-1" />
              <button onClick={() => setS({ socialLinks: s.socialLinks.filter((_, j) => j !== i) })} className="rounded-lg p-2 text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Footer */}
      <AdminCard>
        <h3 className="mb-4 font-heading text-sm font-semibold text-royal-900">Footer Content</h3>
        <AdminInput label="Footer About Text" value={s.footerAbout} onChange={(v) => setS({ footerAbout: v })} textarea />
        <AdminInput label="Developer Credit" value={s.footerDevCredit} onChange={(v) => setS({ footerDevCredit: v })} className="mt-3" />
      </AdminCard>

      {/* Change Password */}
      <AdminCard>
        <SectionTitle icon={KeyRound} title="Admin Settings" />
        <h3 className="mb-3 font-heading text-sm font-semibold text-royal-900">Change Admin Password</h3>
        <div className="flex flex-wrap items-end gap-3">
          <AdminInput label="New Password" value={newPass} onChange={setNewPass} placeholder="Min 4 characters" type="password" className="max-w-xs" />
          <AdminBtn icon={Save} onClick={changePass} variant="primary">Update Password</AdminBtn>
        </div>
      </AdminCard>
    </div>
  );
}
