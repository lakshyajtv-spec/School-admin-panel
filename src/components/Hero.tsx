import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Compass,
  HeartHandshake,
  Landmark,
  Sparkles,
  Users,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { IMAGES } from "@/data/site";

const badgeIcons = [HeartHandshake, Landmark, BookOpenCheck];

export default function Hero() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950/95 via-royal-900/90 to-royal-800/82" />
        <div className="absolute inset-0 grid-lines opacity-[0.16]" />
        <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-royal-500/25 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-gold-400/20 blur-[130px]" />
      </div>

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-floaty absolute top-[18%] left-[6%] h-24 w-24 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm" />
        <div
          className="animate-floaty absolute top-[62%] left-[14%] h-14 w-14 rounded-full border border-gold-300/30 bg-gold-300/10"
          style={{ animationDelay: "1.6s" }}
        />
        <div
          className="animate-floaty absolute top-[12%] right-[10%] h-20 w-20 rotate-12 rounded-2xl border border-white/15 bg-white/5"
          style={{ animationDelay: "2.8s" }}
        />
        <div
          className="animate-floaty absolute right-[24%] bottom-[16%] h-10 w-10 rounded-full bg-gold-400/30"
          style={{ animationDelay: "0.9s" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-14 pb-20 sm:gap-14 sm:px-6 lg:min-h-[calc(100vh-4.5rem)] lg:grid-cols-[1.05fr_.95fr] lg:gap-10 lg:pt-20 lg:pb-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-gold-300" />
            <span className="font-heading text-[0.68rem] font-semibold tracking-[0.14em] text-gold-200 uppercase sm:text-xs">
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[1.7rem] leading-[1.12] text-white sm:text-5xl lg:text-[3.4rem]"
          >
            {t.hero.titleA}{" "}
            <span className="text-gradient-gold">{t.hero.titleHighlight}</span>{" "}
            {t.hero.titleB}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl font-body text-[0.95rem] leading-relaxed text-royal-100/85 sm:text-lg"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <a
              href="#gallery"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 px-7 py-3.5 font-heading font-semibold text-royal-900 shadow-[0_18px_45px_-16px_rgba(212,175,55,.85)] transition-all duration-300 hover:-translate-y-1"
            >
              <Compass className="h-5 w-5" />
              {t.hero.exploreBtn}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {t.hero.badges.map((label, i) => {
              const Icon = badgeIcons[i] ?? BookOpenCheck;
              return (
                <div
                  key={label}
                  className="glass-dark inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-royal-50"
                >
                  <Icon className="h-4 w-4 shrink-0 text-gold-300" />
                  <span className="font-heading font-medium">{label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Illustration card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-gold-400/20 via-transparent to-royal-300/20 blur-2xl" />
          <motion.div
            animate={
              reduced ? undefined : { y: [0, -14, 0] }
            }
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="glass-dark relative overflow-hidden rounded-[2.5rem] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)]"
          >
            <img
              src={IMAGES.heroCard}
              alt={t.hero.cardTitle}
              className="h-[220px] w-full rounded-[2rem] object-cover sm:h-[380px] lg:h-[440px]"
            />
            <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-t from-royal-950/75 via-transparent to-transparent" />
            <div className="absolute right-7 bottom-7 left-7">
              <p className="font-display text-lg text-white">
                {t.hero.cardTitle}
              </p>
              <p className="mt-1 font-body text-sm text-royal-100/80">
                {t.hero.cardSub}
              </p>
            </div>
          </motion.div>

          <motion.div
            animate={reduced ? undefined : { y: [0, 16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -bottom-8 -left-3 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_25px_60px_-25px_rgba(8,43,73,.7)] backdrop-blur-xl sm:-left-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-700 to-royal-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl text-royal-800">700+</p>
                <p className="font-heading text-[0.68rem] tracking-wide text-slate-500 uppercase">
                  {t.hero.floatA}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={reduced ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute -top-6 -right-2 rounded-3xl border border-white/60 bg-white/90 px-5 py-4 shadow-[0_25px_60px_-25px_rgba(8,43,73,.7)] backdrop-blur-xl sm:-right-6"
          >
            <p className="font-display text-2xl text-gold-500">02</p>
            <p className="font-heading text-[0.68rem] tracking-wide text-slate-500 uppercase">
              {t.hero.floatB}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee strip */}
      <div className="relative border-t border-white/10 bg-royal-950/60 py-3 backdrop-blur-sm">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...t.hero.marquee, ...t.hero.marquee].map((m, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 font-heading text-sm font-medium text-royal-100/70"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
