import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Globe, KeyRound, Mail, MapPin, Palette, Phone, ShieldCheck, Trash2, Upload, UserRound } from "lucide-react";
import { settingsFormSchema } from "@/cms/lib/schemas";
import { uploadImage } from "@/cms/lib/storage";
import { useCms, setPassword } from "@/cms/context";
import { Button, Card, Field, Input, PageHeader, Skeleton } from "@/cms/ui";
import { cn } from "@/utils/cn";

const THEME_PRESETS = [
  { name: "Royal Blue", color: "#0F4C81" },
  { name: "Deep Navy", color: "#1E3A5F" },
  { name: "Teal", color: "#0F6D6B" },
  { name: "Maroon", color: "#7A1E2B" },
];

function ImagePicker({
  label,
  value,
  onChange,
  round = false,
  folder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  round?: boolean;
  folder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    const tId = toast.loading("Uploading…");
    try {
      onChange(await uploadImage(f, folder));
      toast.success("Uploaded", { id: tId });
    } catch (err) {
      console.error("[cms] Upload failed:", err);
      toast.error("Upload failed", { id: tId });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="mb-1.5 font-heading text-xs font-semibold tracking-wide text-slate-600">
        {label}
      </p>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt={label}
            className={cn(
              "h-14 w-14 shrink-0 border border-royal-100 bg-white object-cover shadow-sm",
              round ? "rounded-full" : "rounded-xl",
            )}
          />
        ) : (
          <span
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center border border-dashed border-royal-200 bg-royal-50/50 text-slate-400",
              round ? "rounded-full" : "rounded-xl",
            )}
          >
            <UserRound className="h-6 w-6" />
          </span>
        )}
        <div className="space-y-1.5">
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <Button variant="outline" onClick={() => ref.current?.click()} disabled={busy}>
            <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload"}
          </Button>
          {value && (
            <Button variant="ghost" onClick={() => onChange("")} className="text-red-500">
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { draft, setDraft } = useCms();
  const [nextPass, setNextPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  if (!draft) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const s = draft.settings;
  const set = (patch: Partial<typeof s>) =>
    setDraft({ ...draft, settings: { ...s, ...patch } });

  const updateEnMeta = (patch: Record<string, string>) =>
    setDraft({
      ...draft,
      en: {
        ...draft.en,
        meta: { ...(draft.en.meta as unknown as Record<string, string>), ...patch },
      } as typeof draft.en,
    });

  const saveValidation = () => {
    const res = settingsFormSchema.safeParse({
      logo: s.logo,
      favicon: s.favicon,
      themeColor: s.themeColor,
      principalPhoto: s.principalPhoto,
      address: s.address,
      phone: s.phone,
      email: s.email,
    });
    if (!res.success) {
      toast.error(res.error.issues[0]?.message ?? "Validation failed");
      return false;
    }
    return true;
  };

  const changePassword = () => {
    if (nextPass.length < 4) {
      toast.error("New password must be at least 4 characters");
      return;
    }
    if (nextPass !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }
    setPassword(nextPass);
    setNextPass("");
    setConfirmPass("");
    toast.success("Admin password updated");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Website Settings"
        subtitle="Identity, branding and contact details. These update the whole website when published."
        actions={
          <Button
            variant="gold"
            onClick={() => {
              if (saveValidation()) toast.success("Settings valid — press Publish to apply");
            }}
          >
            Validate
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-5">
          <h3 className="font-heading text-sm font-semibold text-royal-900">School Identity</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImagePicker label="School Logo" value={s.logo} onChange={(v) => set({ logo: v })} round folder="branding" />
            <ImagePicker label="Principal Photo" value={s.principalPhoto} onChange={(v) => set({ principalPhoto: v })} round folder="principal" />
            <ImagePicker label="Favicon" value={s.favicon} onChange={(v) => set({ favicon: v })} round folder="branding" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="School Name (English)">
              <Input value={draft.en.meta.schoolName} onChange={(e) => updateEnMeta({ schoolName: e.target.value })} />
            </Field>
            <Field label="School Name (Short / Caps)">
              <Input value={draft.en.meta.schoolNameCaps} onChange={(e) => updateEnMeta({ schoolNameCaps: e.target.value })} />
            </Field>
            <Field label="Place">
              <Input value={draft.en.meta.schoolPlace} onChange={(e) => updateEnMeta({ schoolPlace: e.target.value })} />
            </Field>
            <Field label="EFA Full Name">
              <Input value={draft.en.meta.efaFull} onChange={(e) => updateEnMeta({ efaFull: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card className="space-y-5">
          <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-royal-900">
            <Globe className="h-4 w-4 text-gold-500" /> Contact Information
          </h3>
          <Field label="Address">
            <div className="relative">
              <MapPin className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
              <Input value={s.address} onChange={(e) => set({ address: e.target.value })} className="pl-10" />
            </div>
          </Field>
          <Field label="Phone">
            <div className="relative">
              <Phone className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
              <Input value={s.phone} onChange={(e) => set({ phone: e.target.value })} className="pl-10" />
            </div>
          </Field>
          <Field label="Email">
            <div className="relative">
              <Mail className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
              <Input value={s.email} onChange={(e) => set({ email: e.target.value })} className="pl-10" />
            </div>
          </Field>
          <div>
            <p className="mb-1.5 font-heading text-xs font-semibold tracking-wide text-slate-600">
              Social Links
            </p>
            <div className="space-y-2">
              {s.socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={link.label}
                    onChange={(e) =>
                      set({
                        socialLinks: s.socialLinks.map((x, j) =>
                          j === i ? { ...x, label: e.target.value } : x,
                        ),
                      })
                    }
                    placeholder="Label"
                    className="w-32"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      set({
                        socialLinks: s.socialLinks.map((x, j) =>
                          j === i ? { ...x, url: e.target.value } : x,
                        ),
                      })
                    }
                    placeholder="https://…"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-royal-900">
            <Palette className="h-4 w-4 text-gold-500" /> Theme & Branding
          </h3>
          <div>
            <p className="mb-2 font-heading text-xs font-semibold tracking-wide text-slate-600">
              Theme Accent Color
            </p>
            <div className="flex flex-wrap gap-3">
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  onClick={() => set({ themeColor: p.color })}
                  className={cn(
                    "flex items-center gap-2 rounded-full border-2 px-4 py-2 font-heading text-xs font-semibold transition",
                    s.themeColor === p.color
                      ? "border-royal-700 bg-royal-50 text-royal-900"
                      : "border-slate-200 bg-white text-slate-500 hover:border-royal-200",
                  )}
                >
                  <span className="h-4 w-4 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-royal-900">
            <KeyRound className="h-4 w-4 text-gold-500" /> Change Admin Password
          </h3>
          <Field label="New Password (min 4 characters)">
            <Input type="password" value={nextPass} onChange={(e) => setNextPass(e.target.value)} />
          </Field>
          <Field label="Confirm New Password">
            <Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
          </Field>
          <Button variant="gold" onClick={changePassword}>
            <ShieldCheck className="h-4 w-4" /> Update Password
          </Button>
          <p className="font-body text-[0.7rem] text-slate-400">
            Logged in as Admin · session persists in this browser until logout.
          </p>
        </Card>
      </div>
    </div>
  );
}
