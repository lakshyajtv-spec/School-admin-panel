import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Beaker,
  CircuitBoard,
  Cpu,
  Droplets,
  FlaskConical,
  Leaf,
  Library,
  Volleyball,
  Cctv,
  Wifi,
  Book,
  Monitor,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useT } from "@/i18n/LanguageContext";

/** Resolves the correct Lucide icon dynamically from the string keyword stored in the database */
const iconMap: Record<string, LucideIcon> = {
  cpu: Cpu,
  computer: Cpu,
  flask: FlaskConical,
  beaker: Beaker,
  leaf: Leaf,
  circuit: CircuitBoard,
  library: Library,
  droplets: Droplets,
  volleyball: Volleyball,
  cctv: Cctv,
  wifi: Wifi,
  book: Book,
  monitor: Monitor,
  shield: Shield,
};

interface CustomFacilityItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  meta: string;
}

export default function Facilities() {
  const t = useT();

  return (
    <section id="facilities" className="relative section-pad overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-royal-100/60 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow={t.facilities.eyebrow}
          title={t.facilities.title}
          highlight={t.facilities.highlight}
          description={t.facilities.desc}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {t.facilities.items.map((rawF, i) => {
            const f = rawF as unknown as CustomFacilityItem;
            const Icon = iconMap[f.icon.toLowerCase()] ?? Library;
            return (
              <Reveal
                key={f.id || f.title || i}
                delay={(i % 2) * 0.08}
                direction={i % 2 ? "left" : "right"}
              >
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group relative flex h-full items-start gap-4 overflow-hidden rounded-[1.6rem] border border-white bg-white/80 p-5 shadow-[0_16px_44px_-32px_rgba(15,76,129,.7)] backdrop-blur-xl sm:gap-5 sm:p-6"
                >
                  <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gold-300 to-royal-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-700 to-royal-500 p-3 text-white shadow-[0_14px_30px_-16px_rgba(15,76,129,1)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h4 className="font-heading text-[1.05rem] font-semibold text-royal-900">
                        {f.title}
                      </h4>
                      <span className="rounded-full bg-gold-100 px-2.5 py-0.5 font-heading text-[0.66rem] font-semibold tracking-wide text-gold-700 uppercase">
                        {f.meta}
                      </span>
                    </div>
                    <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">
                      {f.desc}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 hidden h-5 w-5 shrink-0 text-royal-300 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold-500 sm:block" />
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
