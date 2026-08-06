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
import Footer from "@/components/Footer";
import AdminApp from "@/admin/AdminApp";
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
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const hash = useHashRoute();

  return (
    <LanguageProvider>
      {hash.startsWith("#/lakshya-admin") ? <AdminApp /> : <PublicSite />}
    </LanguageProvider>
  );
}
