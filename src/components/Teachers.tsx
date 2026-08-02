import { motion } from "framer-motion";
import {
  Atom,
  Beaker,
  BookA,
  Calculator,
  Globe2,
  Languages,
  Leaf,
  Laptop,
  UserRound,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";

/** Subject icons align 1:1 with `content.teachers.list` fallback */
const icons = [Calculator, Atom, Beaker, Leaf, BookA, Languages, Globe2, Laptop];

export default function Teachers() {
  const { t, siteData } = useLanguage();

  // Admin-managed records take priority; otherwise fall back to content defaults
  const fallback = t.teachers.list.map((x, i) => ({
    id: `fb-${i}`,
    name: "",
    subject: x.subject,
    qualification: "",
    experience: "",
    designation: x.designation,
    photo: "",
  }));
  const teachers =
    siteData.teachers.length > 0 ? siteData.teachers : fallback;

  return (
    <section id="teachers" className="relative section-pad overflow-hidden">
      <div className="pointer-events-none absolute top-20 right-0 h-[26rem] w-[26rem] rounded-full bg-gold-100/70 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow={t.teachers.eyebrow}
          title={t.teachers.title}
          highlight={t.teachers.highlight}
          description={t.teachers.desc}
        />

        {/* 2 cards per row on mobile (Android), 3 on tablet, 4 on desktop */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {teachers.map((teacher, i) => {
            const Icon = icons[i] ?? BookA;
            return (
              <Reveal key={teacher.id ?? teacher.subject} delay={(i % 4) * 0.06}>
                <motion.article
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="group relative flex h-full flex-col items-center overflow-hidden rounded-[1.4rem] border border-white bg-white/85 p-4 text-center shadow-[0_18px_50px_-32px_rgba(15,76,129,.7)] backdrop-blur-xl sm:rounded-[1.9rem] sm:p-7"
                >
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-royal-50 to-transparent transition-colors duration-500 group-hover:from-royal-100" />

                  <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-royal-500 via-gold-300 to-royal-400 p-[3px] transition-transform duration-700 group-hover:rotate-180">
                      <div className="h-full w-full rounded-full bg-white" />
                    </div>
                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name || teacher.subject}
                        loading="lazy"
                        className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-full object-cover object-top"
                      />
                    ) : (
                      <div className="absolute inset-[6px] flex items-center justify-center rounded-full bg-gradient-to-br from-royal-50 to-royal-100 text-royal-700 transition-colors duration-500 group-hover:from-royal-700 group-hover:to-royal-500 group-hover:text-white">
                        {teacher.name ? (
                          <UserRound className="h-8 w-8 sm:h-9 sm:w-9" />
                        ) : (
                          <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
                        )}
                      </div>
                    )}
                  </div>

                  <h4 className="relative mt-4 font-heading text-[0.95rem] leading-snug font-semibold text-royal-900 sm:text-lg">
                    {teacher.name || teacher.subject}
                  </h4>
                  <p className="relative mt-1 font-body text-xs text-gold-600 sm:text-sm">
                    {teacher.name ? teacher.subject : teacher.designation}
                  </p>
                  <p className="relative mt-1 font-body text-[0.65rem] tracking-wide text-slate-400 uppercase sm:text-[0.7rem]">
                    {teacher.name ? teacher.designation : t.teachers.facultyLabel}
                  </p>
                  {(teacher.qualification || teacher.experience) && (
                    <div className="relative mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
                      {teacher.qualification && (
                        <span className="rounded-full bg-royal-50 px-2.5 py-0.5 font-body text-[0.62rem] text-royal-700">
                          {teacher.qualification}
                        </span>
                      )}
                      {teacher.experience && (
                        <span className="rounded-full bg-gold-100 px-2.5 py-0.5 font-body text-[0.62rem] text-gold-700">
                          {teacher.experience}
                        </span>
                      )}
                    </div>
                  )}

                  <span className="relative mt-4 h-1 w-8 rounded-full bg-gold-300 transition-all duration-500 group-hover:w-16" />
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center font-body text-xs text-slate-500 sm:text-sm">
            {t.teachers.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
