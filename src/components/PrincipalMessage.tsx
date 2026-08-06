import { motion } from "framer-motion";
import { Quote, Signature, UserRound } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/i18n/LanguageContext";

export default function PrincipalMessage() {
  const t = useT();

  return (
    <section
      id="principal"
      className="relative section-pad overflow-hidden bg-gradient-to-br from-royal-50 via-white to-gold-50/60"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 lg:p-12">
            <Quote className="pointer-events-none absolute -top-6 -left-4 h-40 w-40 text-royal-100/70" />
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gold-200/40 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[290px_1fr]">
              {/* Photo placeholder — no invented identity */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto w-[220px] sm:w-[250px] lg:w-full"
              >
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-royal-600/20 to-gold-300/30 blur-xl" />
                <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-royal-100 via-white to-royal-50 shadow-soft">
                  <div className="flex h-[260px] items-center justify-center sm:h-[300px]">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-royal-700 to-royal-500 text-white shadow-[0_20px_40px_-18px_rgba(15,76,129,1)]">
                      <UserRound className="h-14 w-14" />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-royal-950/85 to-transparent p-4 pt-10">
                    <p className="font-heading text-sm font-semibold text-white">
                      {t.principal.name}
                    </p>
                    <p className="font-body text-[0.68rem] text-gold-200">
                      {t.principal.designation}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-center font-body text-[0.7rem] text-slate-400">
                  {t.principal.note}
                </p>
              </motion.div>

              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-royal-100 bg-white px-4 py-1.5 font-heading text-xs font-semibold tracking-[0.18em] text-royal-700 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                  {t.principal.eyebrow}
                </span>
                <h2 className="mt-5 text-xl leading-snug text-royal-900 sm:text-2xl lg:text-[2rem]">
                  “{t.principal.quoteA}{" "}
                  <span className="text-gradient-blue">
                    {t.principal.quoteB}
                  </span>
                  ”
                </h2>
                <p className="mt-5 font-body leading-relaxed text-slate-600">
                  {t.principal.p1}
                </p>
                <p className="mt-4 font-body leading-relaxed text-slate-600">
                  {t.principal.p2}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <Signature className="h-9 w-9 shrink-0 text-gold-500" />
                  <div>
                    <p className="font-display text-lg text-royal-800">
                      {t.principal.name}
                    </p>
                    <p className="font-body text-xs text-slate-500">
                      {t.principal.designation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
