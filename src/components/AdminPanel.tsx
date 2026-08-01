import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Plus,
  Save,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type AdminData = Record<string, unknown>;

type SectionKey = keyof ReturnType<typeof useT>;

const TABS: { key: SectionKey; labelEn: string; labelHi: string }[] = [
  { key: "meta", labelEn: "Meta", labelHi: "मेटा" },
  { key: "hero", labelEn: "Hero", labelHi: "हीरो" },
  { key: "about", labelEn: "About", labelHi: "परिचय" },
  { key: "highlights", labelEn: "Highlights", labelHi: "विशेषताएँ" },
  { key: "facilities", labelEn: "Facilities", labelHi: "सुविधाएँ" },
  { key: "vocational", labelEn: "Vocational", labelHi: "व्यावसायिक" },
  { key: "gallery", labelEn: "Gallery", labelHi: "गैलरी" },
  { key: "principal", labelEn: "Principal", labelHi: "प्राचार्य" },
  { key: "teachers", labelEn: "Teachers", labelHi: "शिक्षक" },
  { key: "achievements", labelEn: "Activities", labelHi: "गतिविधियाँ" },
  { key: "notices", labelEn: "Notices", labelHi: "सूचनाएँ" },
  { key: "footer", labelEn: "Footer", labelHi: "फ़ुटर" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** Minimal inline editor that renders string/number/array fields */
function FieldEditor({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
}) {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        <span className="block font-heading text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {label}
        </span>
        {(value as unknown[]).map((item, i) => (
          <div key={i} className="flex gap-2">
            {typeof item === "object" && item !== null ? (
              <ObjectEditorMini
                obj={item as Record<string, unknown>}
                onChange={(newObj) => {
                  const next = [...(value as unknown[])];
                  next[i] = newObj;
                  onChange(next);
                }}
              />
            ) : (
              <>
                <input
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 font-body text-sm text-slate-800 focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
                  value={String(item ?? "")}
                  onChange={(e) => {
                    const next = [...(value as unknown[])];
                    next[i] = e.target.value;
                    onChange(next);
                  }}
                />
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => {
                    const next = (value as unknown[]).filter((_, j) => j !== i);
                    onChange(next);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const next = [...(value as unknown[]), ""];
            onChange(next);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-royal-200 bg-royal-50 px-3 py-1.5 font-heading text-xs font-semibold text-royal-700 hover:bg-royal-100"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
        {error && <p className="font-body text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-2">
        <span className="block font-heading text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {label}
        </span>
        <ObjectEditorMini
          obj={value as Record<string, unknown>}
          onChange={(newObj) => onChange(newObj)}
        />
        {error && <p className="font-body text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block font-heading text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {label}
      </label>
      {typeof value === "number" ? (
        <input
          type="number"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-body text-sm text-slate-800 focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : (
        <input
          type="text"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-body text-sm text-slate-800 focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && <p className="font-body text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ObjectEditorMini({
  obj,
  onChange,
}: {
  obj: Record<string, unknown>;
  onChange: (o: Record<string, unknown>) => void;
}) {
  const keys = Object.keys(obj);
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
      {keys.map((k) => (
        <FieldEditor
          key={k}
          label={k}
          value={(obj as Record<string, unknown>)[k]}
          onChange={(v) => onChange({ ...obj, [k]: v })}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section Editor                                                     */
/* ------------------------------------------------------------------ */

function SectionEditor({
  sectionKey,
  data,
  onChange,
}: {
  sectionKey: string;
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const [activeLocale, setActiveLocale] = useState<"en" | "hi">("en");
  const localeData = (data[activeLocale] as Record<string, unknown>) ?? {};
  const sectionData = (localeData[sectionKey] as Record<string, unknown>) ?? {};

  const handleSectionChange = (newSection: Record<string, unknown>) => {
    const next = deepClone(data);
    ((next[activeLocale] as Record<string, unknown>)[sectionKey] as unknown) = newSection;
    onChange(next);
  };

  // Show top-level keys as expandable cards
  const topKeys = Object.keys(sectionData as object);

  return (
    <div className="space-y-6">
      {/* Locale toggle */}
      <div className="flex items-center gap-3">
        <span className="font-heading text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Language
        </span>
        {(["en", "hi"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setActiveLocale(l)}
            className={cn(
              "rounded-full px-4 py-1.5 font-heading text-sm font-semibold transition",
              activeLocale === l
                ? "bg-royal-700 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
          >
            {l === "en" ? "English" : "हिन्दी"}
          </button>
        ))}
      </div>

      {/* Field editors */}
      {topKeys.length === 0 ? (
        <p className="font-body text-sm text-slate-400">No editable fields in this section.</p>
      ) : (
        <div className="grid gap-4">
          {topKeys.map((key) => (
            <FieldEditor
              key={key}
              label={key}
              value={(sectionData as Record<string, unknown>)[key]}
              onChange={(v) => {
                const next = { ...(sectionData as Record<string, unknown>), [key]: v };
                handleSectionChange(next);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Admin Panel                                                   */
/* ------------------------------------------------------------------ */

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const t = useT();
  const [data, setData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("meta");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navLang, setNavLang] = useState<"en" | "hi">("en");

  // Load site-data.json
  useEffect(() => {
    fetch("/site-data.json", { cache: "no-cache" })
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        // Fallback — use builtin via the existing language system
        setData({ en: { ...t }, hi: { ...t } } as unknown as AdminData);
        setLoading(false);
      });
  }, [t]);

  const currentTab = TABS.find((tab) => tab.key === activeTab);

  const handleSave = useCallback(() => {
    if (!data) return;
    // In a real deployment this would POST to a server endpoint.
    // For now, trigger a download of the edited JSON.
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [data]);

  const handleExport = useCallback(() => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-royal-200 border-t-royal-700" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#f6f9fd] font-body text-slate-800">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Back to website"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-lg text-royal-800 sm:text-xl">
              Admin Panel
            </h1>
            <p className="font-body text-xs text-slate-500">
              {t.meta.schoolName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-heading text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 font-heading text-xs font-semibold transition sm:text-sm",
              saved
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-royal-700 to-royal-500 text-white shadow-[0_12px_24px_-12px_rgba(15,76,129,.6)] hover:-translate-y-0.5",
            )}
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-3 sm:block">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="font-heading text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Sections
            </span>
            <div className="flex gap-1">
              {(["en", "hi"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setNavLang(l)}
                  className={cn(
                    "rounded-md px-2 py-1 font-heading text-[0.65rem] font-semibold",
                    navLang === l ? "bg-royal-100 text-royal-800" : "text-slate-400",
                  )}
                >
                  {l === "en" ? "EN" : "HI"}
                </button>
              ))}
            </div>
          </div>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left font-heading text-sm font-medium transition",
                activeTab === tab.key
                  ? "bg-royal-50 text-royal-800 ring-1 ring-royal-100"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span>{navLang === "hi" ? tab.labelHi : tab.labelEn}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            </button>
          ))}
        </aside>

        {/* Mobile tab bar */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 sm:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 font-heading text-xs font-semibold whitespace-nowrap transition",
                activeTab === tab.key
                  ? "bg-royal-700 text-white"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {navLang === "hi" ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Main editor area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <Settings className="h-5 w-5 text-gold-500" />
              <h2 className="font-display text-xl text-royal-800">
                {currentTab
                  ? navLang === "hi"
                    ? currentTab.labelHi
                    : currentTab.labelEn
                  : "Editor"}
              </h2>
            </div>

            {data && (
              <div className="glass rounded-[1.5rem] p-5 sm:p-7">
                <SectionEditor
                  sectionKey={activeTab}
                  data={data}
                  onChange={(newData) => setData(newData)}
                />
              </div>
            )}

            {/* Info */}
            <div className="mt-8 rounded-2xl border border-royal-100 bg-royal-50/60 p-5">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                <div>
                  <p className="font-heading text-sm font-semibold text-royal-800">
                    How to use this admin panel
                  </p>
                  <ol className="mt-2 list-inside list-decimal space-y-1 font-body text-sm text-slate-600">
                    <li>Select a section from the sidebar.</li>
                    <li>Switch between English and Hindi using the language toggle.</li>
                    <li>Edit any field — text, numbers, lists.</li>
                    <li>Click <strong>Save</strong> to download the updated <code className="rounded bg-royal-100 px-1 text-xs">site-data.json</code> file.</li>
                    <li>Place the downloaded file in the <code className="rounded bg-royal-100 px-1 text-xs">public/</code> folder of the website to apply changes.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
