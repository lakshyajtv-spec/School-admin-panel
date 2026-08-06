import { motion } from "framer-motion";
import { ArrowRight, BellRing, CalendarDays, FileText } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/utils/cn";

const accents = ["gold", "blue", "blue", "gold"] as const;

export default function NoticeBoard() {
  const t = useT();

  return (
    <section id="notices" className="relative section-pad overflow-hidden">
      <div className="pointer-events-none absolute bottom-10 -left-32 h-[26rem] w-[26rem] rounded-full bg-royal-100/70 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow={t.notices.eyebrow}
          title={t.notices.title}
          highlight={t.notices.highlight}
          description={t.notices.desc}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {t.notices.items.map((n, i) => {
            const accent = accents[i] ?? "blue";
            return (
              <Reveal key={n.title} delay={(i % 4) * 0.07}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white bg-white/85 p-5 shadow-[0_18px_50px_-32px_rgba(15,76,129,.7)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-6"
                >
                  <span
                    className={cn(
                      "absolute inset-x-0 top-0 h-1.5",
                      accent === "gold"
                        ? "bg-gradient-to-r from-gold-400 to-gold-200"
                        : "bg-gradient-to-r from-royal-600 to-royal-300",
                    )}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-heading text-[0.66rem] font-semibold tracking-wider uppercase",
                        accent === "gold"
                          ? "bg-gold-100 text-gold-700"
                          : "bg-royal-50 text-royal-700",
                      )}
                    >
                      <BellRing className="h-3 w-3" />
                      {n.tag}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors duration-500 group-hover:bg-royal-700 group-hover:text-white">
                      <FileText className="h-4 w-4" />
                    </span>
                  </div>

                  <h4 className="mt-5 font-heading text-[1rem] leading-snug font-semibold text-royal-900">
                    {n.title}
                  </h4>
                  <p className="mt-2.5 flex-1 font-body text-sm leading-relaxed text-slate-600">
                    {n.body}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5 text-gold-500" />
                      {n.date}
                    </span>
                    <span className="inline-flex items-center gap-1 font-heading text-xs font-semibold text-royal-700">
                      {t.notices.read}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
