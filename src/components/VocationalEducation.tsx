import { motion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  CircuitBoard,
  GraduationCap,
  Layers,
  Lightbulb,
  MonitorSmartphone,
  Rocket,
  Route,
  Target,
  UserCog,
  Wrench,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useT } from "@/i18n/LanguageContext";

const subjectIcons = [MonitorSmartphone, CircuitBoard];
const teacherIcons = [Wrench, Wrench];
const importanceIcons = [BadgeCheck, Briefcase, Rocket, Route];
const levelIcons = [Layers, GraduationCap];

function BlockTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Target;
  children: React.ReactNode;
}) {
  return (
    <h5 className="flex items-center gap-2 font-heading text-sm font-semibold tracking-wide text-royal-800 uppercase">
      <Icon className="h-4 w-4 text-gold-500" />
      {children}
    </h5>
  );
}

export default function VocationalEducation() {
  const t = useT();

  return (
    <section
      id="vocational"
      className="relative section-pad overflow-hidden bg-gradient-to-b from-white via-gold-50/40 to-white"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="pointer-events-none absolute -top-20 right-0 h-[26rem] w-[26rem] rounded-full bg-royal-100/60 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow={t.vocational.eyebrow}
          title={t.vocational.title}
          highlight={t.vocational.highlight}
          description={t.vocational.desc}
        />

        {/* Start Info Banner */}
        <Reveal>
          <div className="mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700 p-6 sm:p-8">
            <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold-400/25 blur-[100px]" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-gold-300">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-display font-extrabold text-white sm:text-2xl">
                  {t.vocational.startInfo}
                </h3>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Curriculum by Level */}
        <div className="mt-14">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-royal-100 bg-white px-4 py-1.5 font-heading text-xs font-semibold tracking-[0.16em] text-royal-700 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {t.vocational.levelTitle}
              </span>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {t.vocational.levels.map((level, i) => {
              const LvlIcon = levelIcons[i] ?? Layers;
              return (
                <Reveal key={level.range} delay={i * 0.1} direction={i ? "left" : "right"}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="group glass relative h-full overflow-hidden rounded-[1.9rem] p-6 sm:p-8"
                  >
                    <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-royal-200/50 to-gold-200/50 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-300 text-royal-900 shadow-[0_14px_30px_-14px_rgba(212,175,55,1)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6">
                        <LvlIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block rounded-full bg-royal-700 px-3 py-0.5 font-heading text-[0.68rem] font-bold text-white">
                          {level.range}
                        </span>
                        <h4 className="mt-2 font-heading text-lg font-semibold text-royal-900">
                          {level.name}
                        </h4>
                      </div>
                    </div>
                    <p className="relative mt-4 font-body text-sm leading-relaxed text-slate-600">
                      {level.desc}
                    </p>
                    <ul className="relative mt-4 space-y-2">
                      {level.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                          <span className="font-body text-sm leading-relaxed text-slate-600">
                            {p}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Trades */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {t.vocational.subjects.map((s, i) => {
            const Icon = subjectIcons[i] ?? MonitorSmartphone;
            return (
              <Reveal key={s.name} delay={i * 0.1} direction={i ? "left" : "right"}>
                <motion.article
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group glass relative h-full overflow-hidden rounded-[2rem] p-6 sm:p-8"
                >
                  <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-royal-200/50 to-gold-200/50 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-700 to-royal-500 text-white shadow-[0_16px_34px_-16px_rgba(15,76,129,1)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-xl leading-tight text-royal-900 sm:text-2xl">
                        {s.name}
                      </h3>
                      <p className="mt-1 font-body text-sm text-gold-600">
                        {s.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Introduction */}
                  <p className="relative mt-6 font-body text-sm leading-relaxed text-slate-600">
                    {s.intro}
                  </p>

                  {/* Objectives */}
                  <div className="relative mt-6 space-y-3">
                    <BlockTitle icon={Target}>{t.vocational.objectivesLabel}</BlockTitle>
                    <ul className="space-y-2">
                      {s.objectives.map((o) => (
                        <li key={o} className="flex items-start gap-2.5">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                          <span className="font-body text-sm leading-relaxed text-slate-600">
                            {o}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div className="relative mt-6 space-y-3">
                    <BlockTitle icon={Lightbulb}>{t.vocational.skillsLabel}</BlockTitle>
                    <div className="flex flex-wrap gap-2">
                      {s.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-royal-100 bg-white/80 px-3 py-1.5 font-body text-xs text-royal-800 transition-colors duration-300 hover:border-gold-300 hover:bg-gold-50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Careers */}
                  <div className="relative mt-6 space-y-3">
                    <BlockTitle icon={Briefcase}>{t.vocational.careersLabel}</BlockTitle>
                    <ul className="grid gap-2">
                      {s.careers.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2.5 rounded-xl bg-royal-50/70 px-3 py-2"
                        >
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
                          <span className="font-body text-sm leading-relaxed text-slate-700">
                            {c}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        {/* Importance */}
        <Reveal>
          <div className="mt-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700 p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-center">
              <div>
                <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-heading text-[0.68rem] font-semibold tracking-[0.16em] text-gold-200 uppercase">
                  <GraduationCap className="h-3.5 w-3.5" />
                  NSQF
                </span>
                <h3 className="mt-4 text-2xl leading-snug text-white sm:text-3xl">
                  {t.vocational.importanceTitle}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-royal-100/80">
                  {t.vocational.importanceDesc}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {t.vocational.importancePoints.map((p, i) => {
                  const Icon = importanceIcons[i] ?? BadgeCheck;
                  return (
                    <motion.div
                      key={p.title}
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="glass-dark rounded-2xl p-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 text-gold-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="mt-3 font-heading text-sm font-semibold text-white">
                        {p.title}
                      </p>
                      <p className="mt-1.5 font-body text-xs leading-relaxed text-royal-100/75">
                        {p.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Vocational teachers */}
        <div className="mt-16">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-2xl text-royal-900 sm:text-3xl">
                {t.vocational.teachersTitle}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-slate-600">
                {t.vocational.teachersDesc}
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {t.vocational.teachers.map((teacher, i) => {
              const Icon = teacherIcons[i] ?? UserCog;
              return (
                <Reveal key={teacher.role} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="group relative flex h-full items-center gap-5 overflow-hidden rounded-[1.75rem] border border-white bg-white/85 p-6 shadow-[0_18px_50px_-32px_rgba(15,76,129,.7)] backdrop-blur-xl"
                  >
                    <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-royal-600 via-gold-300 to-royal-400" />
                    <div className="relative h-20 w-20 shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-royal-500 via-gold-300 to-royal-400 p-[3px] transition-transform duration-700 group-hover:rotate-180">
                        <div className="h-full w-full rounded-full bg-white" />
                      </div>
                      <div className="absolute inset-[6px] flex items-center justify-center rounded-full bg-gradient-to-br from-royal-50 to-royal-100 text-royal-700">
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading text-[1.05rem] font-semibold text-royal-900">
                        {teacher.role}
                      </h4>
                      <p className="mt-1 font-body text-sm text-gold-600">
                        {teacher.subject}
                      </p>
                      <p className="mt-0.5 font-body text-xs tracking-wide text-slate-500 uppercase">
                        {teacher.designation}
                      </p>
                      <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 font-body text-[0.7rem] text-slate-500">
                        {teacher.note}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
