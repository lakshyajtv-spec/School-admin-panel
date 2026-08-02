/**
 * CMS App entry — hash routing, providers, auth gate and page mount.
 *
 * Routes (lightweight hash routing, no React Router):
 *   #/lakshya-admin               → Dashboard
 *   #/lakshya-admin/teachers      → Teachers
 *   #/lakshya-admin/gallery       → Gallery
 *   #/lakshya-admin/notices       → Notices
 *   #/lakshya-admin/settings      → Website Settings
 *   #/lakshya-admin/backup        → Backup & Restore
 *   #/lakshya-admin/section/<key> → Section editor
 */
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { CmsProvider, useCms } from "@/cms/context";
import Login from "@/cms/Login";
import Shell from "@/cms/Shell";
import DashboardPage from "@/cms/pages/DashboardPage";
import SectionEditorPage from "@/cms/pages/SectionEditorPage";
import TeachersPage from "@/cms/pages/TeachersPage";
import GalleryPage from "@/cms/pages/GalleryPage";
import NoticesPage from "@/cms/pages/NoticesPage";
import SettingsPage from "@/cms/pages/SettingsPage";
import BackupPage from "@/cms/pages/BackupPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function parseRoute(): string {
  const hash = window.location.hash.replace(/^#\/lakshya-admin/, "");
  return hash.replace(/^\//, ""); // '', 'teachers', 'section/hero', ...
}

function useCmsRoute() {
  const [route, setRoute] = useState(parseRoute);
  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

function navigate(route: string) {
  window.location.hash = `#/lakshya-admin${route ? `/${route}` : ""}`;
}

function PageView({ route }: { route: string }) {
  if (route === "teachers") return <TeachersPage />;
  if (route === "gallery") return <GalleryPage />;
  if (route === "notices") return <NoticesPage />;
  if (route === "settings") return <SettingsPage />;
  if (route === "backup") return <BackupPage />;
  if (route.startsWith("section/")) {
    return <SectionEditorPage sectionKey={route.split("/")[1]} />;
  }
  return <DashboardPage />;
}

function CmsRoot() {
  const { authed, loading } = useCms();
  const route = useCmsRoute();

  if (!authed) return <Login />;

  return (
    <Shell route={route} navigate={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={route}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {loading ? (
            <div className="space-y-4">
              <div className="h-9 w-56 animate-pulse rounded-xl bg-gradient-to-r from-royal-100/70 via-royal-50 to-royal-100/70" />
              <div className="h-72 animate-pulse rounded-[1.5rem] bg-gradient-to-r from-royal-100/70 via-royal-50 to-royal-100/70" />
            </div>
          ) : (
            <PageView route={route} />
          )}
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

export default function CmsApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <CmsProvider>
        <CmsRoot />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "1rem",
              background: "rgba(255,255,255,0.95)",
              color: "#0b2137",
              boxShadow: "0 20px 50px -20px rgba(8,43,73,.5)",
              fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
              fontSize: "0.85rem",
            },
          }}
        />
      </CmsProvider>
    </QueryClientProvider>
  );
}
