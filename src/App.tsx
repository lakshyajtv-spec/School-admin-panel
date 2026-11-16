import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
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
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AdminApp from "@/admin/AdminApp";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { IMAGES } from "@/data/site";

/**
 * Tiny hash router:
 *   #/admin-lakshya  → Admin panel
 *   anything else (or empty) → public website
 */
function useHashRoute() {
  const [hash, setHash] = useState(() => `${window.location.pathname}${window.location.hash}`);
  useEffect(() => {
    const onHash = () => setHash(`${window.location.pathname}${window.location.hash}`);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("popstate", onHash); };
  }, []);
  return hash;
}

function PublicSite() {
  const { cms } = useLanguage();
  useEffect(() => {
    const title = `${cms.settings.schoolName} | EFA Government School`;
    document.title = title;
    const description = cms.settings.footerAbout || "Government higher secondary school in Guna, Madhya Pradesh.";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.append(meta); }
    meta.content = description;
    const ensureMeta = (property: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.append(tag); }
      tag.content = content;
    };
    ensureMeta("og:title", title);
    ensureMeta("og:description", description);
    ensureMeta("og:type", "website");
    ensureMeta("og:url", window.location.origin + "/");
    ensureMeta("og:image", cms.hero?.bgImage || IMAGES.hero);
    ensureMeta("og:image:alt", cms.settings.schoolName);
    const ensureNameMeta = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.name = name; document.head.append(tag); }
      tag.content = content;
    };
    ensureNameMeta("twitter:card", "summary_large_image");
    ensureNameMeta("twitter:title", title);
    ensureNameMeta("twitter:description", description);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = window.location.origin + "/";
  }, [cms.settings.schoolName, cms.settings.footerAbout]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

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
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const hash = useHashRoute();
  const isAdmin = hash.toLowerCase().startsWith("/lakshya-admin") || hash.startsWith("#/admin-lakshya");
  useEffect(() => {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.append(robots); }
    robots.content = isAdmin ? "noindex, nofollow, noarchive" : "index, follow";
  }, [isAdmin]);

  return (
    <LanguageProvider>
      {hash.toLowerCase().startsWith("/lakshya-admin") || hash.startsWith("#/admin-lakshya") ? <AdminApp /> : <PublicSite />}
    </LanguageProvider>
  );
}
