import { Plus, Trash2 } from "lucide-react";
import type { Field } from "@/admin/contentSchema";
import { cn } from "@/utils/cn";

/* ---------- path helpers (immutable-ish) ---------- */

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => {
    if (o && typeof o === "object") return (o as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

export function setPathImmutable<T extends Record<string, unknown>>(
  root: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split(".");
  const clone: Record<string, unknown> = { ...root };
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const prev = cur[keys[i]] as Record<string, unknown> | undefined;
    cur[keys[i]] = { ...(prev ?? {}) };
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return clone as T;
}

/* ---------- styled controls ---------- */

const inputBase =
  "w-full rounded-xl border border-royal-100 bg-white px-3.5 py-2.5 font-body text-sm text-royal-900 shadow-sm outline-none transition focus:border-royal-300 focus:ring-4 focus:ring-royal-100";

const labelBase =
  "mb-1.5 block font-heading text-xs font-semibold tracking-wide text-slate-600";

export function TextControl({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  type?: "text" | "number";
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelBase}>{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputBase, "resize-y")}
        />
      ) : (
        <input
          type={type}
          value={String(value ?? "")}
          onChange={(e) =>
            onChange(type === "number" ? Number(e.target.value) : e.target.value)
          }
          className={inputBase}
        />
      )}
    </label>
  );
}

/* ---------- generic recursive field editor ---------- */

export function FieldEditor({
  field,
  obj,
  onChange,
}: {
  field: Field;
  obj: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  if (field.kind === "scalar") {
    const value = getPath(obj, field.path);
    return (
      <TextControl
        label={field.label}
        value={value}
        textarea={field.type === "textarea"}
        type={field.type === "number" ? "number" : "text"}
        onChange={(v) => onChange(setPathImmutable(obj, field.path, v))}
      />
    );
  }

  if (field.kind === "stringList") {
    const list = (getPath(obj, field.path) as string[]) ?? [];
    const setList = (next: string[]) =>
      onChange(setPathImmutable(obj, field.path, next));
    return (
      <div className="rounded-2xl border border-royal-100/80 bg-royal-50/40 p-4">
        <p className={labelBase}>{field.label}</p>
        <div className="space-y-2">
          {list.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={item}
                onChange={(e) =>
                  setList(list.map((x, i) => (i === idx ? e.target.value : x)))
                }
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => setList(list.filter((_, i) => i !== idx))}
                aria-label="Remove item"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setList([...list, ""])}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-royal-200 bg-white px-4 py-2 font-heading text-xs font-semibold text-royal-700 transition hover:bg-royal-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    );
  }

  // object list
  const list = (getPath(obj, field.path) as Record<string, unknown>[]) ?? [];
  const setList = (next: Record<string, unknown>[]) =>
    onChange(setPathImmutable(obj, field.path, next));
  return (
    <div className="rounded-2xl border border-royal-100/80 bg-royal-50/40 p-4">
      <p className={labelBase}>{field.label}</p>
      <div className="space-y-4">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-royal-700 px-2.5 py-0.5 font-heading text-[0.65rem] font-bold text-white">
                {field.itemLabel} {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => setList(list.filter((_, i) => i !== idx))}
                aria-label={`Remove ${field.itemLabel} ${idx + 1}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {field.fields.map((sub) => (
                <FieldEditor
                  key={sub.path}
                  field={sub}
                  obj={item}
                  onChange={(nextItem) =>
                    setList(list.map((x, i) => (i === idx ? nextItem : x)))
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setList([...list, field.empty()])}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-royal-200 bg-white px-4 py-2 font-heading text-xs font-semibold text-royal-700 transition hover:bg-royal-50"
      >
        <Plus className="h-3.5 w-3.5" /> Add {field.itemLabel}
      </button>
    </div>
  );
}
