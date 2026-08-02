import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Highlights from "@/components/Highlights";
import Facilities from "@/components/Facilities";
import PrincipalMessage from "@/components/PrincipalMessage";
import Teachers from "@/components/Teachers";
import VocationalEducation from "@/components/VocationalEducation";
import CampusGallery from "@/components/CampusGallery";
import Achievements from "@/components/Achievements";
import NoticeBoard from "@/components/NoticeBoard";
import Footer from "@/components/Footer";
import CmsApp from "@/cms/App";
import { LanguageProvider } from "@/i18n/LanguageContext";

/**
 * Tiny hash router:
 *   #/lakshya-admin  → Admin panel
 *   anything else (or empty) → public website
 */
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

function PublicSite() {
  const { siteData } = useLanguage();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  // Apply admin branding (theme color + favicon) to the live website
  useEffect(() => {
    const root = document.documentElement;
    const base = siteData.settings.themeColor || "#0F4C81";
    const shade = (hex: string, f: number) => {
      const n = parseInt(hex.slice(1), 16);
      const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
      const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
      const b = Math.min(255, Math.round((n & 255) * f));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    };
    root.style.setProperty("--color-royal-700", base);
    root.style.setProperty("--color-royal-800", shade(base, 0.82));
    root.style.setProperty("--color-royal-900", shade(base, 0.68));
    root.style.setProperty("--color-royal-950", shade(base, 0.5));
  }, [siteData.settings.themeColor]);

  useEffect(() => {
    if (siteData.settings.favicon) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = siteData.settings.favicon;
    }
  }, [siteData.settings.favicon]);

  return (
    <div className="relative min-h-screen bg-[#f6f9fd]">
      <motion.div
        style={{ scaleX: progress }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-royal-700 via-gold-400 to-royal-500"
      />

      <Navbar />
      <main>
        <Hero />
        <About />
        <Highlights />
        <Facilities />
        <PrincipalMessage />
        <Teachers />
        <VocationalEducation />
        <CampusGallery />
        <Achievements />
        <NoticeBoard />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const hash = useHashRoute();

  return (
    <LanguageProvider>
      {/* Error boundary: runtime errors show a useful page, never a white screen */}
      <ErrorBoundary label={hash.startsWith("#/lakshya-admin") ? "Admin Panel" : "Website"}>
        {hash.startsWith("#/lakshya-admin") ? <CmsApp /> : <PublicSite />}
      </ErrorBoundary>
    </LanguageProvider>
  );
}
