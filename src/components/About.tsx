import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";

const statIcons = [Users, GraduationCap, Building2, Wrench];

function Counter({
  to,
  suffix,
  locale,
}: {
  to: number;
  suffix: string;
  locale: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 55;
    const id = window.setInterval(() => {
      frame++;
      const p = 1 - Math.pow(1 - frame / total, 3);
      setVal(Math.round(to * p));
      if (frame >= total) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString(locale === "hi" ? "hi-IN" : "en-IN")}
      {suffix}
    </span>
  );
}

export default function About() {
  const { t, lang, cms } = useLanguage();

  const aboutAImage = cms.hero?.aboutAImage || "https://images.pexels.com/photos/35550999/pexels-photo-35550999.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=760&w=900";
  const aboutBImage = cms.hero?.aboutBImage || "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800";

  return (
    <section id="about" className="relative section-pad overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-32 h-96 w-96 rounded-full bg-royal-200/40 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gold-200/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          highlight={t.about.highlight}
          description={t.about.desc}
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right">
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-28 w-28 rounded-3xl border-2 border-gold-300/60" />
              <div className="absolute -right-5 -bottom-6 h-32 w-32 rounded-full bg-royal-100/70 blur-xl" />
              <div className="relative overflow-hidden rounded-[2.25rem] shadow-soft">
                <img
                  src={aboutAImage}
                  alt={t.about.imgCaptionTitle}
                  loading="lazy"
                  decoding="async"
                  className="h-[260px] w-full object-cover transition-transform duration-[1.2s] hover:scale-105 sm:h-[420px]"
                />
              </div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="glass absolute -right-3 -bottom-8 w-52 rounded-3xl p-4 sm:-right-8 sm:w-56"
              >
                <img
                  src={aboutBImage}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-24 w-full rounded-2xl object-cover"
                />
                <p className="mt-3 font-heading text-sm font-semibold text-royal-800">
                  {t.about.imgCaptionTitle}
                </p>
                <p className="font-body text-xs text-slate-500">
                  {t.about.imgCaptionSub}
                </p>
              </motion.div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="glass rounded-[2.25rem] p-6 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-royal-50 px-3.5 py-1.5 font-heading text-xs font-semibold tracking-wider text-royal-700 uppercase">
                <Target className="h-3.5 w-3.5 text-gold-500" />
                {t.about.missionTag}
              </span>
              <h3 className="mt-5 font-display text-xl leading-snug text-royal-900 sm:text-[1.7rem]">
                {t.about.missionHeading}
              </h3>
              <p className="mt-4 font-body leading-relaxed text-slate-600">
                {t.about.p1}
              </p>
              <p className="mt-4 font-body leading-relaxed text-slate-600">
                {t.about.p2}
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {t.about.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                    <span className="font-body text-sm leading-relaxed text-slate-700">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Realistic school statistics */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-20 lg:grid-cols-4">
          {t.about.stats.map((s, i) => {
            const Icon = statIcons[i] ?? Users;
            return (
              <Reveal key={s.label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative h-full overflow-hidden rounded-[1.5rem] border border-white bg-white/80 p-5 shadow-[0_18px_50px_-30px_rgba(15,76,129,.55)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-7"
                >
                  <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-royal-100/0 to-transparent transition-all duration-500 group-hover:from-royal-100/70" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-700 to-royal-500 text-white shadow-[0_12px_28px_-14px_rgba(15,76,129,1)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="h-1.5 w-8 rounded-full bg-gold-300/70 transition-all duration-500 group-hover:w-14" />
                  </div>
                  <p className="relative mt-5 font-display text-3xl text-royal-800 sm:text-4xl">
                    <Counter to={s.value} suffix={s.suffix} locale={lang} />
                  </p>
                  <p className="relative mt-1 font-heading text-sm font-semibold text-royal-900 sm:text-[0.95rem]">
                    {s.label}
                  </p>
                  <p className="relative mt-1 font-body text-xs text-slate-500">
                    {s.hint}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
