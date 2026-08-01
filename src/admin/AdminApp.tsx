import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, Building2, ChevronLeft, Download, ExternalLink,
  Home, Image, LogOut, RotateCcw, Save, Settings2, Trophy,
  Upload, Users, Wrench,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/utils/cn";
import { ToastProvider, useToast } from "@/admin/components/Toast";
import {
  authIsLoggedIn, authLogout, exportJSON, loadData,
  parseImportJSON, publishChanges, resetAllData, saveData,
  type AllSiteData,
} from "@/admin/store";
import Login from "@/admin/pages/Login";
import Dashboard from "@/admin/pages/Dashboard";
import TeachersPage from "@/admin/pages/TeachersPage";
import GalleryPage from "@/admin/pages/GalleryPage";
import NoticesPage from "@/admin/pages/NoticesPage";
import FacilitiesPage from "@/admin/pages/FacilitiesPage";
import AchievementsPage from "@/admin/pages/AchievementsPage";
import VocationalPage from "@/admin/pages/VocationalPage";
import SettingsPage from "@/admin/pages/SettingsPage";

/* ============ Sidebar ============ */

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const NAV: NavItem[] = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "teachers", icon: Users, label: "Teachers" },
  { id: "gallery", icon: Image, label: "Gallery" },
  { id: "notices", icon: Bell, label: "Notice Board" },
  { id: "facilities", icon: Building2, label: "Facilities" },
  { id: "achievements", icon: Trophy, label: "Achievements" },
  { id: "vocational", icon: Wrench, label: "Vocational" },
  { id: "settings", icon: Settings2, label: "Settings" },
];

/* ============ Main Admin Shell ============ */

function AdminPage() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState<AllSiteData | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const toast = useToast();

  // Async initial load
  useEffect(() => {
    loadData().then(setData);
  }, []);

  const update = (d: AllSiteData) => {
    setData(d);
    saveData(d);
  };

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-royal-200 border-t-royal-700" />
          <p className="font-body text-sm text-slate-500">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  const handlePublish = () => {
    publishChanges(data).then(() => {
      toast("Website updated successfully! Refresh the public site to see changes.", "success");
    });
  };

  const handleExport = () => { exportJSON(data); toast("Full backup downloaded", "success"); };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const parsed = parseImportJSON(String(reader.result));
        if (parsed) { update(parsed); toast("Content imported successfully", "success"); }
        else toast("Invalid backup file", "error");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm("Reset ALL content to defaults? This cannot be undone.")) {
      const fresh = resetAllData();
      update(fresh);
      toast("All content reset to defaults", "success");
    }
  };

  const handleLogout = () => { authLogout(); window.location.hash = "/lakshya-admin"; window.location.reload(); };

  const PageComponent = useMemo(() => {
    const map: Record<string, React.FC<{ data: AllSiteData; update: (d: AllSiteData) => void }>> = {
      dashboard: Dashboard,
      teachers: TeachersPage,
      gallery: GalleryPage,
      notices: NoticesPage,
      facilities: FacilitiesPage,
      achievements: AchievementsPage,
      vocational: VocationalPage,
      settings: SettingsPage,
    };
    return map[page] ?? Dashboard;
  }, [page]);

  return (
    <div className="flex min-h-screen bg-[#f0f4fa]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/60 bg-royal-950 text-royal-100/80 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[230px]",
      )}>
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <button onClick={() => setCollapsed(!collapsed)} className="shrink-0 rounded-xl p-1 transition hover:bg-white/10">
            <ChevronLeft className={cn("h-5 w-5 text-gold-400 transition-transform", collapsed && "rotate-180")} />
          </button>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-[0.75rem] font-extrabold text-white">School Admin</p>
              <p className="truncate font-heading text-[0.58rem] tracking-[0.14em] text-gold-300 uppercase">CMS Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              data-page={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-[0.8rem] font-medium transition",
                page === item.id
                  ? "bg-gold-400/15 text-gold-200 ring-1 ring-gold-400/30"
                  : "text-royal-100/70 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="space-y-1.5 border-t border-white/10 p-2">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.location.hash = ""; }}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-heading text-[0.75rem] font-semibold text-white transition hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4 text-gold-400" />
            {!collapsed && "View Website"}
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 font-heading text-[0.75rem] font-semibold text-royal-100/70 transition hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-[68px]" : "ml-[230px]")}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8" />
              <div>
                <p className="font-display text-sm font-extrabold text-royal-800">{data.settings.schoolNameCaps}</p>
                <p className="font-heading text-[0.6rem] tracking-wider text-slate-400 uppercase">Content Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleImport} className="flex items-center gap-1.5 rounded-full border border-royal-200 bg-white px-3.5 py-2 font-heading text-[0.7rem] font-semibold text-royal-700 transition hover:bg-royal-50">
                <Upload className="h-3.5 w-3.5" /> Import
              </button>
              <button onClick={handleExport} className="flex items-center gap-1.5 rounded-full border border-royal-200 bg-white px-3.5 py-2 font-heading text-[0.7rem] font-semibold text-royal-700 transition hover:bg-royal-50">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button onClick={handleReset} className="flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3.5 py-2 font-heading text-[0.7rem] font-semibold text-red-500 transition hover:bg-red-50">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button onClick={handlePublish} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-royal-700 to-royal-500 px-4 py-2 font-heading text-[0.7rem] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,76,129,.8)] transition hover:-translate-y-0.5">
                <Save className="h-3.5 w-3.5" /> Publish
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PageComponent data={data} update={update} />
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="pb-6 text-center font-body text-[0.68rem] text-slate-400">
          Govt. Boys H. S. School Cantt, Guna — Admin Panel · Changes auto-save to the public website
        </p>
      </main>
    </div>
  );
}

/* ============ Entry ============ */

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(authIsLoggedIn());
  return (
    <ToastProvider>
      {loggedIn ? (
        <AdminPage />
      ) : (
        <Login onSuccess={() => setLoggedIn(true)} />
      )}
    </ToastProvider>
  );
}
