import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

/* ======== Card ======== */
export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-[0_12px_36px_-20px_rgba(15,76,129,.35)] backdrop-blur-xl sm:p-6", className)}>
      {children}
    </div>
  );
}

/* ======== Input ======== */
export function AdminInput({
  label, value, onChange, placeholder, type = "text", textarea = false, rows = 3, className,
}: {
  label?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; textarea?: boolean; rows?: number; className?: string;
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

/* ======== Button variants ======== */
export function AdminBtn({
  children, onClick, variant = "primary", className, icon: Icon,
}: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string; icon?: React.ElementType;
}) {
  return (
    <motion.button
      type="button" whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5",
        variant === "primary" && "bg-gradient-to-r from-royal-700 to-royal-500 text-white shadow-[0_12px_28px_-12px_rgba(15,76,129,.8)]",
        variant === "secondary" && "border border-royal-200 bg-white text-royal-700 hover:bg-royal-50",
        variant === "danger" && "border border-red-200 bg-white text-red-600 hover:bg-red-50",
        variant === "ghost" && "text-royal-700 hover:bg-royal-50",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}{children}
    </motion.button>
  );
}

/* ======== Section Title ======== */
export function SectionTitle({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white shadow-md">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl text-royal-900 sm:text-2xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ======== Empty State ======== */
export function EmptyState({ icon: Icon, title, desc, action }: { icon: React.ElementType; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-royal-50 text-royal-300">
        <Icon className="h-8 w-8" />
      </div>
      <p className="font-heading text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 font-body text-xs text-slate-400">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ======== Stat Card ======== */
export function StatCard({ icon: Icon, value, label, className }: { icon: React.ElementType; value: string | number; label: string; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn("rounded-2xl border border-white bg-white/80 p-4 shadow-[0_8px_24px_-12px_rgba(15,76,129,.3)] backdrop-blur", className)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-2xl text-royal-800">{value}</p>
          <p className="font-body text-[0.7rem] text-slate-500 uppercase">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
