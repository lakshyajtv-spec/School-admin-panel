import { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { useCms } from "@/cms/context";
import { SECTION_BY_KEY } from "@/cms/lib/sections";
import { FieldEditor } from "@/cms/SchemaEditor";
import { Badge, Button, Card, PageHeader, Skeleton } from "@/cms/ui";
import { cn } from "@/utils/cn";

/** Minimal live preview for the current section. */
function SectionPreview({
  sectionKey,
  obj,
}: {
  sectionKey: string;
  obj: Record<string, unknown>;
}) {
  const section = obj[sectionKey] as Record<string, unknown> | undefined;
  if (!section) return null;

  const text = (k: string) => String(section[k] ?? "");
  const items = (section.items as unknown[] | undefined) ?? [];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-royal-100 bg-gradient-to-b from-royal-50/60 to-white p-4">
        {text("eyebrow") && (
          <span className="inline-flex items-center gap-2 rounded-full border border-royal-100 bg-white px-3 py-1 font-heading text-[0.6rem] font-semibold tracking-[0.16em] text-royal-700 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {text("eyebrow")}
          </span>
        )}
        <p className="mt-3 font-display text-xl leading-tight text-royal-900">
          {text("title")}{" "}
          {text("highlight") && (
            <span className="text-gradient-blue">{text("highlight")}</span>
          )}
        </p>
        {text("desc") && (
          <p className="mt-2 font-body text-xs leading-relaxed text-slate-600">
            {text("desc")}
          </p>
        )}
      </div>

      {items.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.slice(0, 4).map((it, i) => {
            const item = it as Record<string, unknown>;
            return (
              <div key={i} className="rounded-xl border border-white bg-white/80 p-3 shadow-sm">
                <p className="font-heading text-sm font-semibold text-royal-900">
                  {String(item.title ?? "")}
                </p>
                <p className="mt-1 font-body text-[0.7rem] text-slate-500">
                  {String(item.desc ?? "")}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {sectionKey === "hero" && (
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 p-5 text-center">
          <p className="font-display text-lg leading-tight text-white">
            {text("titleA")}{" "}
            <span className="text-gradient-gold">{text("titleHighlight")}</span>{" "}
            {text("titleB")}
          </p>
          <p className="mx-auto mt-2 max-w-sm font-body text-xs text-royal-100/80">
            {text("subtitle")}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SectionEditorPage({ sectionKey }: { sectionKey: string }) {
  const { draft, setDraft } = useCms();
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [preview, setPreview] = useState(true);

  const def = SECTION_BY_KEY.get(sectionKey);

  if (!def) {
    return (
      <PageHeader
        title="Section not found"
        subtitle={`Unknown section: ${sectionKey}`}
      />
    );
  }

  if (!draft) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const tree = draft[lang] as unknown as Record<string, unknown>;
  const setTree = (next: Record<string, unknown>) => {
    setDraft({ ...draft, [lang]: next as typeof draft.en });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Edit — ${def.label}`}
        subtitle={def.description}
        actions={
          <>
            <div className="flex rounded-full border border-royal-100 bg-white p-1">
              {(["en", "hi"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "rounded-full px-4 py-1.5 font-heading text-xs font-semibold transition",
                    lang === l
                      ? "bg-royal-700 text-white shadow"
                      : "text-slate-500 hover:text-royal-700",
                  )}
                >
                  {l === "en" ? "English" : "हिन्दी"}
                </button>
              ))}
            </div>
            <Button
              variant={preview ? "outline" : "blue"}
              onClick={() => setPreview((v) => !v)}
            >
              <Eye className="h-4 w-4" /> {preview ? "Hide Preview" : "Show Preview"}
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <div className="space-y-5">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-royal-900">
              <Pencil className="h-4 w-4 text-gold-500" /> {def.label}
            </h3>
            <div className="space-y-5">
              {def.fields.map((field) => (
                <FieldEditor
                  key={field.path}
                  field={field}
                  obj={tree[def.key] as Record<string, unknown>}
                  onChange={(nextSection) =>
                    setTree({ ...tree, [def.key]: nextSection })
                  }
                />
              ))}
            </div>
          </Card>
        </div>

        {preview && (
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-heading text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <Eye className="h-4 w-4 text-gold-500" /> Live Preview
            </p>
            <div className="rounded-[1.5rem] border border-royal-100/80 bg-gradient-to-b from-royal-50/60 to-white p-4">
              <SectionPreview
                sectionKey={def.key}
                obj={tree[def.key] as Record<string, unknown>}
              />
            </div>
            <div className="rounded-2xl bg-royal-50/70 p-3">
              <p className="font-body text-[0.7rem] leading-relaxed text-slate-500">
                Changes go live on the website after you press{" "}
                <strong>Publish Changes</strong> in the top bar.
              </p>
            </div>
            <Badge tone="gold">Editing: {lang === "en" ? "English" : "हिन्दी"}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}
