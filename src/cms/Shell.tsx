/**
 * CMS Shell — sidebar navigation + topbar with Publish button.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bell,
  Building2,
  DatabaseBackup,
  ExternalLink,
  FileText,
  Home,
  Images,
  Info,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Navigation,
  RefreshCw,
  Send,
  Settings2,
  Star,
  UserRound,
  UsersRound,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCms } from "@/cms/context";
import { SECTIONS } from "@/cms/lib/sections";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/utils/cn";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "section/meta", label: "General / Identity", icon: Settings2, section: "Content" },
  { id: "section/nav", label: "Navigation", icon: Navigation, section: "Content" },
  { id: "section/hero", label: "Home / Hero", icon: Home, section: "Content" },
  { id: "section/about", label: "About School", icon: Info, section: "Content" },
  { id: "section/principal", label: "Principal Message", icon: UserRound, section: "Content" },
  { id: "section/highlights", label: "Highlights", icon: Star, section: "Content" },
  { id: "section/facilities", label: "Facilities", icon: Building2, section: "Content" },
  { id: "section/vocational", label: "Vocational Education", icon: Wrench, section: "Content" },
  { id: "section/achievements", label: "Achievements", icon: Award, section: "Content" },
  { id: "section/gallery", label: "Gallery Headings", icon: Images, section: "Content" },
  { id: "section/notices", label: "Notice Headings", icon: Bell, section: "Content" },
  { id: "section/footer", label: "Footer", icon: FileText, section: "Content" },
  { id: "teachers", label: "Teachers", icon: UsersRound, section: "Manage" },
  { id: "gallery", label: "Gallery", icon: Images, section: "Manage" },
  { id: "notices", label: "Notice Board", icon: Bell, section: "Manage" },
  { id: "settings", label: "Website Settings", icon: Settings2, section: "System" },
  { id: "backup", label: "Backup & Restore", icon: DatabaseBackup, section: "System" },
];

export function SectionLabel({ id }: { id: string }) {
  if (id.startsWith("section/")) {
    const key = id.split("/")[1];
    return SECTIONS.find((s) => s.key === key)?.label ?? id;
  }
  return NAV_ITEMS.find((n) => n.id === id)?.label ?? "Dashboard";
}

export default function Shell({
  route,
  navigate,
  children,
}: {
  route: string;
  navigate: (route: string) => void;
  children: React.ReactNode;
}) {
  const { dirty, publishing, publish, logout, refresh } = useCms();
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const go = (id: string) => {
    navigate(id);
    setMobileOpen(false);
  };

  const sidebar = (
    <aside
      className={cn(
        "flex h-full flex-col bg-royal-950 text-royal-100/80 transition-all duration-300",
        collapsed ? "w-[76px]" : "w-[250px]",
      )}
    >
      <div className={cn("flex items-center gap-3 border-b border-white/10 px-4 py-5", collapsed && "justify-center px-2")}>
        <Logo className="h-10 w-10 shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-[0.78rem] font-extrabold text-white">
              School Admin
            </p>
            <p className="font-heading text-[0.58rem] tracking-[0.2em] text-gold-300 uppercase">
              Content Panel
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item, i) => {
          const prev = NAV_ITEMS[i - 1];
          const showHeader = item.section && item.section !== prev?.section && !collapsed;
          return (
            <div key={item.id}>
              {showHeader && (
                <p className="mt-3 mb-1 px-3 font-heading text-[0.6rem] font-semibold tracking-[0.2em] text-royal-100/40 uppercase">
                  {item.section}
                </p>
              )}
              <button
                type="button"
                onClick={() => go(item.id)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 font-heading text-[0.82rem] font-medium transition",
                  route === item.id
                    ? "bg-gold-400/15 text-gold-200 ring-1 ring-gold-400/30"
                    : "text-royal-100/70 hover:bg-white/5 hover:text-white",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            </div>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <a
          href="#/"
          className={cn(
            "flex items-center gap-3 rounded-xl bg-white/10 px-3.5 py-2.5 font-heading text-[0.78rem] font-semibold text-white transition hover:bg-white/15",
            collapsed && "justify-center px-2",
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && <span>View Website</span>}
        </a>
        <button
          type="button"
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-white/10 px-3.5 py-2.5 font-heading text-[0.78rem] font-semibold text-royal-100/70 transition hover:bg-white/5",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f0f4fa]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className={cn("fixed inset-y-0 left-0 z-[90]", collapsed ? "w-[76px]" : "w-[250px]")}>
          {sidebar}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[80] bg-royal-950/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[90] w-[250px] lg:hidden"
            >
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Topbar */}
      <header
        className={cn(
          "sticky top-0 z-[60] border-b border-white/60 bg-white/80 backdrop-blur-xl transition-all duration-300",
          collapsed ? "lg:ml-[76px]" : "lg:ml-[250px]",
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-royal-100 bg-white text-royal-700 shadow-sm lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-base text-royal-900 sm:text-lg">
              <SectionLabel id={route} />
            </h1>
            <p className="hidden font-body text-[0.68rem] text-slate-400 sm:block">
              {t.meta.schoolName}
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="hidden items-center gap-1.5 rounded-xl border border-royal-100 bg-white px-3.5 py-2 font-heading text-xs font-semibold text-royal-700 transition hover:bg-royal-50 sm:inline-flex"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>

          <a
            href="#/"
            className="hidden items-center gap-1.5 rounded-xl border border-royal-100 bg-white px-3.5 py-2 font-heading text-xs font-semibold text-royal-700 transition hover:bg-royal-50 md:inline-flex"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </a>

          <button
            type="button"
            onClick={publish}
            disabled={publishing || !dirty}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60",
              dirty
                ? "bg-gradient-to-r from-gold-400 to-gold-300 text-royal-900 shadow-[0_14px_34px_-16px_rgba(212,175,55,.9)]"
                : "bg-royal-50 text-royal-400",
            )}
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {publishing ? "Publishing…" : dirty ? "Publish Changes" : "Published"}
            </span>
            <span className="sm:hidden">{publishing ? "…" : "Publish"}</span>
          </button>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-royal-100 bg-white text-royal-700 shadow-sm lg:inline-flex"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main className={cn("px-4 py-6 sm:px-6", collapsed ? "lg:ml-[76px]" : "lg:ml-[250px]")}>
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
