/**
 * Reusable CMS UI kit — same premium design language as the website
 * (royal blue / gold / white, glassmorphism, soft shadows, rounded-2xl).
 */
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Inbox,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

/* ------------------------------ Button ------------------------------ */

const btnVariants = {
  gold: "bg-gradient-to-r from-gold-400 to-gold-300 text-royal-900 shadow-[0_14px_34px_-16px_rgba(212,175,55,.9)] hover:-translate-y-0.5",
  blue: "bg-gradient-to-r from-royal-700 to-royal-500 text-white shadow-[0_14px_34px_-18px_rgba(15,76,129,1)] hover:-translate-y-0.5",
  outline: "border border-royal-200 bg-white text-royal-700 hover:bg-royal-50",
  ghost: "text-royal-700 hover:bg-royal-50",
  danger: "bg-gradient-to-r from-red-500 to-red-400 text-white hover:-translate-y-0.5",
  dark: "bg-royal-900 text-white hover:bg-royal-800",
} as const;

export function Button({
  variant = "blue",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof btnVariants;
}) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-heading text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
        btnVariants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton({
  label,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-700 transition hover:bg-royal-100 disabled:opacity-30",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Card ------------------------------ */

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-[0_16px_44px_-32px_rgba(15,76,129,.6)] backdrop-blur-xl sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-xl text-royal-900 sm:text-2xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 font-body text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </Card>
  );
}

/* ------------------------------ Form primitives ------------------------------ */

export const inputCls =
  "w-full rounded-xl border border-royal-100 bg-white px-3.5 py-2.5 font-body text-sm text-royal-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-royal-300 focus:ring-4 focus:ring-royal-100";

export function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block font-heading text-xs font-semibold tracking-wide text-slate-600">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block font-body text-xs text-red-500">{error}</span>
      )}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(inputCls, "resize-y", props.className)}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, props.className)} />;
}

/* ------------------------------ Toggle ------------------------------ */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-300",
          checked ? "bg-royal-600" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
            checked && "translate-x-5",
          )}
        />
      </span>
      {label && <span className="font-body text-sm text-slate-700">{label}</span>}
    </button>
  );
}

/* ------------------------------ Badge ------------------------------ */

const badgeTones = {
  blue: "bg-royal-50 text-royal-700 ring-royal-100",
  gold: "bg-gold-100 text-gold-700 ring-gold-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-red-50 text-red-600 ring-red-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
} as const;

export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-heading text-[0.68rem] font-semibold ring-1",
        badgeTones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------ Modal ------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[150] flex items-end justify-center bg-royal-950/60 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_40px_90px_-30px_rgba(8,43,73,.7)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6",
              wide ? "sm:max-w-3xl" : "sm:max-w-lg",
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg text-royal-900">{title}</h3>
              <IconButton label="Close" onClick={onClose}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Confirm({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <p className="font-body text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------ Misc ------------------------------ */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-royal-100/70 via-royal-50 to-royal-100/70",
        className,
      )}
    />
  );
}

export function EmptyState({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-royal-200 bg-royal-50/40 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-royal-400 shadow-sm">
        <Icon className="h-7 w-7" />
      </span>
      <p className="mt-4 font-heading text-sm font-semibold text-royal-900">{title}</p>
      <p className="mt-1 max-w-xs font-body text-xs text-slate-500">{desc}</p>
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        className={cn(inputCls, "pl-10")}
      />
    </div>
  );
}

/* ------------------------------ CountUp ------------------------------ */

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame = 0;
    const total = 40;
    const id = window.setInterval(() => {
      frame++;
      const p = 1 - Math.pow(1 - frame / total, 3);
      setVal(Math.round(to * p));
      if (frame >= total) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [to]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

/* ------------------------------ Reorder ------------------------------ */

export function ReorderControls({
  index,
  count,
  onMove,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="cursor-grab rounded-lg p-1.5 text-slate-400 transition hover:bg-royal-50 hover:text-royal-600 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </span>
      <button
        type="button"
        onClick={() => onMove(index, index - 1)}
        disabled={index === 0}
        aria-label="Move up"
        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-royal-50 hover:text-royal-700 disabled:opacity-30"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, index + 1)}
        disabled={index === count - 1}
        aria-label="Move down"
        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-royal-50 hover:text-royal-700 disabled:opacity-30"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

export function InboxIcon() {
  return <Inbox className="h-7 w-7" />;
}
