import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

export function Button({
  children, onClick, variant = "primary", className, icon: Icon, loading, disabled,
}: {
  children: ReactNode; onClick?: () => void; variant?: Variant; className?: string;
  icon?: LucideIcon; loading?: boolean; disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50",
        variant === "primary" && "bg-gradient-to-r from-royal-700 to-royal-500 text-white shadow-[0_12px_28px_-12px_rgba(15,76,129,.8)]",
        variant === "secondary" && "border border-royal-200 bg-white text-royal-700 hover:bg-royal-50",
        variant === "danger" && "border border-red-200 bg-white text-red-600 hover:bg-red-50",
        variant === "ghost" && "text-royal-700 hover:bg-royal-50",
        className,
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </motion.button>
  );
}
