import { motion } from "framer-motion";
import {
  Atom,
  HandCoins,
  Landmark,
  Laptop,
  Library,
  Trees,
  UsersRound,
  Wrench,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useT } from "@/i18n/LanguageContext";

/** Icons align 1:1 with `content.highlights.items` */
const icons = [
  Landmark,
  UsersRound,
  Atom,
  Laptop,
  Library,
  Wrench,
  Trees,
  HandCoins,
];

export default function Highlights() {
  const t = useT();

  return (
    <section className="relative section-pad overflow-hidden bg-gradient-to-b from-white via-royal-50/60 to-white">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow={t.highlights.eyebrow}
          title={t.highlights.title}
          highlight={t.highlights.highlight}
          description={t.highlights.desc}
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {t.highlights.items.map((f, i) => {
            const Icon = icons[i] ?? Landmark;
            return (
              <Reveal key={f.title} delay={(i % 4) * 0.07}>
                <motion.div
                  whileHover={{ y: -12 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="group relative h-full overflow-hidden rounded-[1.6rem] border border-white bg-white/85 p-6 shadow-[0_16px_44px_-30px_rgba(15,76,129,.6)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-7"
                >
                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-royal-100 to-gold-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-50 to-royal-100 p-3 text-royal-700 ring-1 ring-royal-100 transition-all duration-500 group-hover:from-royal-700 group-hover:to-royal-500 group-hover:text-white group-hover:shadow-[0_16px_32px_-16px_rgba(15,76,129,1)]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h4 className="relative mt-5 font-heading text-[1.05rem] leading-snug font-semibold text-royal-900">
                    {f.title}
                  </h4>
                  <p className="relative mt-2.5 font-body text-sm leading-relaxed text-slate-600">
                    {f.desc}
                  </p>
                  <div className="relative mt-6 h-1 w-8 rounded-full bg-gold-300 transition-all duration-500 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-gold-400 group-hover:to-royal-300" />
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
