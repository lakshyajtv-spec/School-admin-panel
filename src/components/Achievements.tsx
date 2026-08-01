import { motion } from "framer-motion";
import { Award, HandCoins, Microscope, Trophy, Wrench } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/utils/cn";

/** Icons align 1:1 with `content.achievements.items` */
const icons = [Award, Wrench, Trophy, Microscope, HandCoins];

export default function Achievements() {
  const t = useT();

  return (
    <section className="relative section-pad overflow-hidden bg-gradient-to-b from-white to-royal-50/70">
      <div className="pointer-events-none absolute top-1/4 right-0 h-[24rem] w-[24rem] rounded-full bg-gold-100/60 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          eyebrow={t.achievements.eyebrow}
          title={t.achievements.title}
          highlight={t.achievements.highlight}
          description={t.achievements.desc}
        />

        <div className="relative mt-16">
          <span className="absolute top-0 bottom-0 left-[19px] w-[2px] rounded-full bg-gradient-to-b from-royal-200 via-gold-300 to-royal-200 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8">
            {t.achievements.items.map((a, i) => {
              const Icon = icons[i] ?? Award;
              const right = i % 2 === 1;
              return (
                <Reveal
                  key={a.title}
                  direction={right ? "left" : "right"}
                  delay={0.05}
                >
                  <div
                    className={cn(
                      "relative flex items-start gap-6 pl-14 md:w-1/2 md:pl-0",
                      right
                        ? "md:ml-auto md:flex-row md:pl-12"
                        : "md:mr-auto md:flex-row-reverse md:pr-12 md:text-right",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-6 left-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-royal-700 to-royal-500 text-white shadow-[0_10px_24px_-10px_rgba(15,76,129,1)]",
                        right
                          ? "md:-left-5 md:translate-x-0"
                          : "md:right-0 md:left-auto md:translate-x-1/2",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 22,
                      }}
                      className="group w-full rounded-[1.6rem] border border-white bg-white/85 p-5 shadow-[0_18px_50px_-34px_rgba(15,76,129,.8)] backdrop-blur-xl sm:p-6"
                    >
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-2",
                          !right && "md:justify-end",
                        )}
                      >
                        <span className="rounded-full bg-royal-700 px-3 py-1 font-heading text-[0.68rem] font-bold text-white">
                          {a.period}
                        </span>
                        <span className="rounded-full bg-gold-100 px-3 py-1 font-heading text-[0.68rem] font-semibold tracking-wide text-gold-700 uppercase">
                          {a.tag}
                        </span>
                      </div>
                      <h4 className="mt-4 font-heading text-[1.05rem] font-semibold text-royal-900">
                        {a.title}
                      </h4>
                      <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">
                        {a.body}
                      </p>
                    </motion.div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
