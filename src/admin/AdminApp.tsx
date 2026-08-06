import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, Building2, ChevronLeft, Download, ExternalLink,
  Home, Image, LogOut, RotateCcw, Save, Settings2, Trophy,
  Upload, Users, Wrench, Layers, type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/utils/cn";
import { Button } from "@/admin/components/ui/Button";
import { Toaster } from "react-hot-toast";
import {
  authIsLoggedIn, authLogout, exportJSON, importJSON,
  loadSiteData, resetSiteData, saveSiteData, publishToSupabase,
  type SiteData,
} from "@/lib/storage";
import Login from "@/admin/pages/Login";
import Dashboard from "@/admin/pages/Dashboard";
import ContentPage from "@/admin/pages/ContentPage";
import TeachersPage from "@/admin/pages/TeachersPage";
import GalleryPage from "@/admin/pages/GalleryPage";
import NoticesPage from "@/admin/pages/NoticesPage";
import FacilitiesPage from "@/admin/pages/FacilitiesPage";
import AchievementsPage from "@/admin/pages/AchievementsPage";
import VocationalPage from "@/admin/pages/VocationalPage";
import SettingsPage from "@/admin/pages/SettingsPage";
import toast from "react-hot-toast";

/* ============ NAV ============ */
interface NavItem { id: string; icon: LucideIcon; label: string; }
const NAV: NavItem[] = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "content", icon: Layers, label: "Homepage CMS" },
  { id: "teachers", icon: Users, label: "Teachers" },
  { id: "gallery", icon: Image, label: "Gallery" },
  { id: "notices", icon: Bell, label: "Notice Board" },
  { id: "facilities", icon: Building2, label: "Facilities" },
  { id: "achievements", icon: Trophy, label: "Achievements" },
  { id: "vocational", icon: Wrench, label: "Vocational" },
  { id: "settings", icon: Settings2, label: "Settings" },
];

/* ============ SHELL ============ */
function AdminPage() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState<SiteData>(loadSiteData);
  const [collapsed, setCollapsed] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const update = (d: SiteData) => {
    setData(d);
    saveSiteData(d);
  };

  const handleExport = () => { exportJSON(data); toast.success("Backup downloaded"); };
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = () => {
      const file = input.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const parsed = importJSON(String(reader.result));
        if (parsed) { update(parsed); toast.success("Imported"); }
        else toast.error("Invalid file");
      };
      reader.readAsText(file);
    };
    input.click();
  };
  const handleReset = () => {
    if (confirm("Reset all content to defaults?")) { update(resetSiteData()); toast.success("Reset"); }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const publishPromise = publishToSupabase(data);
    
    toast.promise(publishPromise, {
      loading: "Publishing changes to Supabase...",
      success: "Website published and updated successfully!",
      error: (err) => `Publish failed: ${err.message || err}`,
    });

    try {
      await publishPromise;
    } catch (error) {
      console.error("[CMS Admin] Failed publishing changes:", error);
    } finally {
      setPublishing(false);
    }
  };

  const Page = useMemo(() => {
    const map: Record<string, React.FC<{ data: SiteData; update: (d: SiteData) => void }>> = {
      dashboard: Dashboard, content: ContentPage, teachers: TeachersPage, gallery: GalleryPage,
      notices: NoticesPage, facilities: FacilitiesPage,
      achievements: AchievementsPage, vocational: VocationalPage, settings: SettingsPage,
    };
    return map[page] ?? Dashboard;
  }, [page]);

  return (
    <div className="flex min-h-screen bg-[#f0f4fa]">
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/60 bg-royal-950 text-royal-100/80 transition-all duration-300", collapsed ? "w-[68px]" : "w-[230px]")}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <button onClick={() => setCollapsed(!collapsed)} className="shrink-0 rounded-xl p-1 hover:bg-white/10"><ChevronLeft className={cn("h-5 w-5 text-gold-400 transition-transform", collapsed && "rotate-180")} /></button>
          {!collapsed && <div className="min-w-0"><p className="truncate font-display text-[0.75rem] font-extrabold text-white">School Admin</p><p className="truncate font-heading text-[0.58rem] tracking-[0.14em] text-gold-300 uppercase">CMS Panel</p></div>}
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {NAV.map((item) => (
            <button key={item.id} type="button" data-page={item.id} onClick={() => setPage(item.id)}
              className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-[0.8rem] font-medium transition",
                page === item.id ? "bg-gold-400/15 text-gold-200 ring-1 ring-gold-400/30" : "text-royal-100/70 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-2")}>
              <item.icon className="h-[18px] w-[18px] shrink-0" />{!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="space-y-1.5 border-t border-white/10 p-2">
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.hash = ""; }}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-heading text-[0.75rem] font-semibold text-white hover:bg-white/10"><ExternalLink className="h-4 w-4 text-gold-400" />{!collapsed && "View Website"}</a>
          <button onClick={() => { authLogout(); window.location.hash = "/lakshya-admin"; window.location.reload(); }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 font-heading text-[0.75rem] font-semibold text-royal-100/70 hover:bg-white/5"><LogOut className="h-4 w-4" />{!collapsed && "Logout"}</button>
        </div>
      </aside>

      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-[68px]" : "ml-[230px]")}>
        <div className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8" /><div><p className="font-display text-sm font-extrabold text-royal-800">{data.settings.schoolNameCaps}</p><p className="font-heading text-[0.6rem] tracking-wider text-slate-400 uppercase">Content Management</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" icon={Upload} onClick={handleImport}>Import</Button>
              <Button variant="ghost" icon={Download} onClick={handleExport}>Export</Button>
              <Button variant="secondary" icon={RotateCcw} onClick={handleReset}>Reset</Button>
              <Button icon={Save} onClick={handlePublish} loading={publishing}>Publish</Button>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Page data={data} update={update} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="pb-6 text-center font-body text-[0.68rem] text-slate-400">Govt. Boys H. S. School Cantt, Guna — Admin Panel</p>
      </main>
    </div>
  );
}

/* ============ ENTRY ============ */
export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(() => {
    try { return authIsLoggedIn(); } catch { return false; }
  });

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ style: { fontSize: "0.8rem", fontFamily: "Inter, sans-serif" } }} />
      {loggedIn ? <AdminPage /> : <Login onSuccess={() => setLoggedIn(true)} />}
    </>
  );
}
