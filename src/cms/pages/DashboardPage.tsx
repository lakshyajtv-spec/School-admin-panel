import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Award,
  Bell,
  Building2,
  CheckCircle2,
  Database,
  Download,
  Images,
  Rocket,
  Send,
  UsersRound,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CountUp,
  Skeleton,
} from "@/cms/ui";
import { useCms, getActivity } from "@/cms/context";
import { isSupabaseConfigured } from "@/config/env";
import { cn } from "@/utils/cn";

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  delay,
}: {
  icon: typeof UsersRound;
  label: string;
  value: number;
  tone: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-[0_16px_44px_-32px_rgba(15,76,129,.6)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-[0_12px_28px_-14px_rgba(15,76,129,1)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
            tone,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="h-1.5 w-10 rounded-full bg-gold-300/70 transition-all duration-500 group-hover:w-14" />
      </div>
      <p className="mt-4 font-display text-3xl text-royal-800">
        <CountUp to={value} />
      </p>
      <p className="mt-1 font-heading text-sm font-semibold text-royal-900">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { siteData, dirty, publishing, publish } = useCms();

  if (!siteData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const en = siteData.en;
  const facilities = en.facilities?.items ?? [];
  const achievements = en.achievements?.items ?? [];
  const vocational = en.vocational?.subjects ?? [];
  const stats = [
    { icon: UsersRound, label: "Total Teachers", value: siteData.teachers.length, tone: "bg-gradient-to-br from-royal-700 to-royal-500" },
    { icon: Images, label: "Gallery Images", value: siteData.gallery.length, tone: "bg-gradient-to-br from-gold-400 to-gold-300" },
    { icon: Building2, label: "Facilities", value: facilities.length, tone: "bg-gradient-to-br from-royal-500 to-royal-400" },
    { icon: Award, label: "Achievements", value: achievements.length, tone: "bg-gradient-to-br from-gold-500 to-gold-400" },
    { icon: Bell, label: "Notices", value: siteData.notices.length, tone: "bg-gradient-to-br from-royal-600 to-royal-400" },
    { icon: CheckCircle2, label: "Pinned Notices", value: siteData.notices.filter((n) => n.pinned).length, tone: "bg-gradient-to-br from-emerald-500 to-emerald-400" },
  ];

  const chartItems = [
    { label: "Teachers", count: siteData.teachers.length },
    { label: "Gallery", count: siteData.gallery.length },
    { label: "Facilities", count: facilities.length },
    { label: "Achievements", count: achievements.length },
    { label: "Notices", count: siteData.notices.length },
    { label: "Vocational Trades", count: vocational.length },
  ];
  const maxCount = Math.max(1, ...chartItems.map((c) => c.count));

  const activity = getActivity();

  const lastPublished = (() => {
    const v = siteData.publishedAt;
    if (!v) return null;
    const dt = new Date(v);
    return isNaN(dt.getTime()) ? null : dt.toLocaleString("en-IN");
  })();

  const storageKB = (() => {
    try {
      return Math.round(JSON.stringify(siteData).length / 1024);
    } catch {
      return 0;
    }
  })();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.1]" />
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-gold-400/25 blur-[90px]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-heading text-[0.65rem] font-semibold tracking-[0.18em] text-gold-200 uppercase">
              <Rocket className="h-3.5 w-3.5" /> Admin Dashboard
            </span>
            <h1 className="mt-4 text-2xl text-white sm:text-3xl">
              Welcome back, <span className="text-gradient-gold">Admin</span>
            </h1>
            <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-royal-100/80">
              Manage every piece of website content from here. Everything you
              publish updates the website instantly.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <Button
              variant="gold"
              onClick={publish}
              disabled={publishing || !dirty}
              className="w-full sm:w-auto"
            >
              {publishing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-royal-900/30 border-t-royal-900" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {publishing ? "Publishing…" : dirty ? "Publish Changes" : "Published"}
            </Button>
            <p className="font-body text-[0.7rem] text-royal-100/60">
              {lastPublished ? `Last published: ${lastPublished}` : "Not published yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Connection status */}
      {isSupabaseConfigured ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3">
          <Database className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <p className="font-body text-xs text-emerald-800">
            <strong>Connected to Supabase.</strong> Publish writes to your
            database and images to storage — the website fetches fresh data
            automatically.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-gold-300/60 bg-gold-50/80 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-600" />
          <p className="font-body text-xs leading-relaxed text-gold-800">
            <strong>Supabase is not configured.</strong> Add{" "}
            <code className="rounded bg-white px-1 py-0.5 font-mono">VITE_SUPABASE_URL</code>{" "}
            and{" "}
            <code className="rounded bg-white px-1 py-0.5 font-mono">VITE_SUPABASE_ANON_KEY</code>{" "}
            to <code className="rounded bg-white px-1 py-0.5 font-mono">.env</code> and run{" "}
            <code className="rounded bg-white px-1 py-0.5 font-mono">supabase/schema.sql</code>.
            Until then, content is stored in this browser (localStorage) —
            everything keeps working.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Distribution */}
        <Card>
          <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-royal-900">
            <Activity className="h-4 w-4 text-gold-500" /> Content Distribution
          </h3>
          <div className="mt-5 space-y-3.5">
            {chartItems.map((c, i) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between font-body text-xs text-slate-500">
                  <span>{c.label}</span>
                  <span className="font-heading font-semibold text-royal-800">{c.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-royal-50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "h-full rounded-full",
                      i % 2 === 0
                        ? "bg-gradient-to-r from-royal-600 to-royal-400"
                        : "bg-gradient-to-r from-gold-400 to-gold-300",
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-royal-50/70 px-4 py-3">
            <span className="font-body text-xs text-slate-500">Storage usage</span>
            <Badge tone="blue">{storageKB} KB (JSON)</Badge>
          </div>
        </Card>

        {/* Quick actions */}
        <Card>
          <h3 className="font-heading text-sm font-semibold text-royal-900">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Add Teacher", icon: UsersRound, to: "teachers" },
              { label: "Add Notice", icon: Bell, to: "notices" },
              { label: "Upload Gallery", icon: Images, to: "gallery" },
              { label: "Export Backup", icon: Download, to: "backup" },
            ].map((qa) => (
              <a
                key={qa.label}
                href={`#/lakshya-admin/${qa.to}`}
                className="group flex flex-col items-start gap-2 rounded-2xl border border-royal-100 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_16px_36px_-24px_rgba(212,175,55,.9)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-50 to-royal-100 text-royal-700 transition group-hover:from-royal-700 group-hover:to-royal-500 group-hover:text-white">
                  <qa.icon className="h-5 w-5" />
                </span>
                <span className="font-heading text-[0.8rem] font-semibold text-royal-900">
                  {qa.label}
                </span>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-royal-900">
          <Activity className="h-4 w-4 text-gold-500" /> Recent Activity
        </h3>
        {activity.length === 0 ? (
          <p className="mt-4 font-body text-sm text-slate-500">
            No activity yet — publish some changes to see activity here.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {activity.slice(0, 8).map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-royal-50/60 px-4 py-2.5"
              >
                <span className="font-body text-sm text-slate-700">{a.text}</span>
                <span className="shrink-0 font-body text-[0.7rem] text-slate-400">{a.time}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
