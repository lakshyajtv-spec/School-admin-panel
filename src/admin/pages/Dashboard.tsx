import { motion } from "framer-motion";
import { Bell, BookOpen, Building2, GraduationCap, Image, Layers, PenTool, Settings2, Trophy, Users, Wrench } from "lucide-react";
import { Card, StatCard } from "@/admin/components/ui/Card";
import type { SiteData } from "@/lib/storage";

export default function Dashboard({ data }: { data: SiteData }) {
  const stats = [
    { icon: Users, value: data.teachers.length, label: "Teachers" },
    { icon: Image, value: data.gallery.length, label: "Gallery Images" },
    { icon: Building2, value: data.facilities.length, label: "Facilities" },
    { icon: Trophy, value: data.achievements.length, label: "Achievements" },
    { icon: Bell, value: data.notices.filter((n) => n.published).length, label: "Active Notices" },
    { icon: Wrench, value: data.vocational.courses.length, label: "Vocational Courses" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.5rem] bg-gradient-to-br from-royal-900 to-royal-800 p-6 text-white shadow-[0_20px_50px_-20px_rgba(8,43,73,.8)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <div className="glass-dark inline-flex items-center gap-2 rounded-full px-3 py-1 font-heading text-[0.68rem] text-gold-200">
              <GraduationCap className="h-3.5 w-3.5" /> Welcome back, Administrator
            </div>
            <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">{data.settings.schoolName}</h1>
            <p className="mt-1 font-body text-sm text-royal-100/70">All changes save automatically.</p>
          </div>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.hash = ""; }}
            className="glass-dark inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-sm font-semibold text-white hover:bg-white/20">
            Visit Website
          </a>
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <StatCard icon={s.icon} value={s.value} label={s.label} />
          </motion.div>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><Layers className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: Users, label: "Add Teacher", page: "teachers" },
            { icon: Image, label: "Upload Image", page: "gallery" },
            { icon: Bell, label: "New Notice", page: "notices" },
            { icon: PenTool, label: "Edit Facilities", page: "facilities" },
            { icon: Trophy, label: "Add Achievement", page: "achievements" },
            { icon: Settings2, label: "Settings", page: "settings" },
          ].map((a) => (
            <button key={a.label} type="button"
              onClick={() => { const el = document.querySelector(`[data-page="${a.page}"]`) as HTMLElement | null; el?.click(); }}
              className="flex flex-col items-center gap-2 rounded-xl border border-royal-100 bg-white/70 p-4 text-center hover:-translate-y-1 hover:bg-royal-50 hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><a.icon className="h-5 w-5" /></div>
              <span className="font-heading text-[0.7rem] font-semibold text-royal-800">{a.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-500 text-white"><BookOpen className="h-5 w-5" /></div>
          <h2 className="font-display text-xl text-royal-900">Recent Notices</h2>
        </div>
        <div className="space-y-2">
          {data.notices.slice(0, 4).map((n) => (
            <div key={n.id} className="flex items-start gap-3 rounded-xl border border-white/60 bg-white/50 p-3">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.pinned ? "bg-gold-500" : "bg-royal-300"}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-royal-100 px-2 py-0.5 font-body text-[0.6rem] font-bold text-royal-700 uppercase">{n.tag}</span>
                  {n.pinned && <span className="rounded-full bg-gold-100 px-2 py-0.5 font-body text-[0.6rem] font-bold text-gold-700">PINNED</span>}
                </div>
                <p className="mt-1 font-heading text-sm font-semibold text-royal-900">{n.title}</p>
                <p className="mt-0.5 font-body text-xs text-slate-500">{n.body.slice(0, 100)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
