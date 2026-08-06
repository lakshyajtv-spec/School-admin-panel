import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-[0_12px_36px_-20px_rgba(15,76,129,.35)] backdrop-blur-xl sm:p-6", className)}>
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: number | string; label: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-[0_8px_24px_-12px_rgba(15,76,129,.3)] backdrop-blur transition hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-2xl text-royal-800">{value}</p>
          <p className="font-body text-[0.7rem] text-slate-500 uppercase">{label}</p>
        </div>
      </div>
    </div>
  );
}
