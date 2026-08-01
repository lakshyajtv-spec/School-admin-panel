import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 38 },
  down: { x: 0, y: -38 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  duration = 0.7,
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  duration?: number;
}) {
  const off = offsets[direction];
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: off.x, y: off.y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  light = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      <Reveal>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-heading text-xs font-semibold tracking-[0.18em] uppercase",
            light
              ? "border-white/25 bg-white/10 text-gold-300"
              : "border-royal-100 bg-white text-royal-700 shadow-[0_6px_20px_-10px_rgba(15,76,129,.5)]",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "mt-5 text-3xl leading-[1.12] sm:text-4xl lg:text-[2.9rem]",
            light ? "text-white" : "text-royal-900",
          )}
        >
          {title}{" "}
          {highlight && (
            <span className={light ? "text-gradient-gold" : "text-gradient-blue"}>
              {highlight}
            </span>
          )}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-[1.05rem]",
              light ? "text-royal-100/80" : "text-slate-600",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
