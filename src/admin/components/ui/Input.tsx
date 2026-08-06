import { cn } from "@/utils/cn";

export function Input({
  label, value, onChange, placeholder, type = "text", textarea, rows = 3, className,
}: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; textarea?: boolean; rows?: number; className?: string;
}) {
  const cls = "w-full rounded-xl border border-royal-100 bg-white px-3.5 py-2.5 font-body text-sm text-royal-900 shadow-sm outline-none transition focus:border-royal-300 focus:ring-4 focus:ring-royal-100 placeholder-slate-400";
  return (
    <label className={cn("block", className)}>
      {label && <span className="mb-1.5 block font-heading text-[0.68rem] font-semibold tracking-wide text-slate-600 uppercase">{label}</span>}
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cn(cls, "resize-y")} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </label>
  );
}
