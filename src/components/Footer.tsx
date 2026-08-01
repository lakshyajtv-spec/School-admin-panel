import {
  ArrowUp,
  BookOpen,
  Globe,
  GraduationCap,
  Heart,
  MessageCircle,
  Wrench,
} from "lucide-react";
import { NAV_LINKS } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { useT } from "@/i18n/LanguageContext";

const socials = [Globe, MessageCircle, GraduationCap, Wrench];

export default function Footer() {
  const t = useT();

  return (
    <footer className="relative overflow-hidden bg-royal-950 text-royal-100/75">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.07]" />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-royal-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-gold-500/12 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12 shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-sm leading-tight font-extrabold text-white">
                  {t.meta.schoolNameCaps}
                </p>
                <p className="font-heading text-[0.62rem] tracking-[0.24em] text-gold-300 uppercase">
                  {t.meta.schoolPlace}
                </p>
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 font-heading text-[0.68rem] font-semibold text-gold-200">
              <GraduationCap className="h-3.5 w-3.5" />
              {t.meta.efaFull}
            </span>
            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed">
              {t.footer.about}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#home"
                  aria-label="School link"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-royal-100/80 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-gold-400/15 hover:text-gold-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">
              {t.footer.quickLinks}
            </h5>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 font-body text-sm transition-colors hover:text-gold-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-gold-400 transition-all duration-300 group-hover:w-3" />
                    {t.nav[l.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h5 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">
              {t.footer.resources}
            </h5>
            <ul className="mt-5 space-y-3">
              {t.footer.resourceItems.map((r, i) => (
                <li key={r}>
                  <a
                    href={i === 0 ? "#vocational" : "#notices"}
                    className="group inline-flex items-center gap-2 font-body text-sm transition-colors hover:text-gold-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-gold-400 transition-all duration-300 group-hover:w-3" />
                    {r}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-body text-xs">
            © {new Date().getFullYear()} {t.meta.schoolName}. {t.footer.rights}
          </p>
          <p className="inline-flex flex-wrap items-center justify-center gap-1.5 font-body text-xs">
            {t.footer.designed}
            <Heart className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
            {t.footer.designedFor}
            <span className="text-gold-300">{t.meta.schoolName}</span>
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 font-heading text-xs font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
          >
            {t.footer.backToTop} <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Developer credit */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-5 py-2 font-heading text-[0.72rem] tracking-wide text-royal-100/60 transition-colors duration-300 hover:border-gold-400/20 hover:text-gold-300/80">
            <BookOpen className="h-3.5 w-3.5 text-gold-400" />
            {t.footer.devCredit}
          </div>
        </div>
      </div>
    </footer>
  );
}
