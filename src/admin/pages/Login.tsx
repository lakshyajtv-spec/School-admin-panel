import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { authLogin } from "@/lib/storage";
import { isSupabaseReady } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCloud = isSupabaseReady;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isCloud) throw new Error("Admin sign-in is unavailable until Supabase is configured.");
      const success = await authLogin(email, pass);
      if (success) {
        toast.success("Welcome back!");
        onSuccess();
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 px-4">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.1]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-[30rem] w-[30rem] rounded-full bg-royal-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[30rem] w-[30rem] rounded-full bg-gold-400/15 blur-[120px]" />

      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={submit}
        className="glass-dark relative w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.8)]"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
            <Logo className="h-14 w-14" />
          </div>
          <p className="font-display text-lg font-extrabold text-white">GOVT. BOYS H. S. SCHOOL</p>
          <p className="font-heading text-xs tracking-[0.2em] text-gold-300 uppercase">Cantt, Guna · Admin Panel</p>
          {isCloud ? (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-400">Supabase authentication enabled</span>
          ) : <p className="mt-3 text-sm text-amber-200">Supabase setup required before administrator sign-in.</p>}
        </div>
        <div className="mt-8 space-y-4">
          {isCloud && (
            <label className="block">
              <span className="mb-1.5 block font-heading text-xs font-semibold tracking-wide text-royal-100/80 uppercase">Administrator Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
                placeholder="admin@school.com"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 font-body text-sm text-white placeholder-royal-100/40 outline-none transition focus:border-gold-300/60 focus:ring-4 focus:ring-gold-300/20"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block font-heading text-xs font-semibold tracking-wide text-royal-100/80 uppercase">Administrator Password</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={pass} autoFocus={!isCloud}
                autoComplete="new-password"
                onChange={(e) => { setPass(e.target.value); setError(false); }}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 pr-12 font-body text-sm text-white placeholder-royal-100/40 outline-none transition focus:border-gold-300/60 focus:ring-4 focus:ring-gold-300/20"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-royal-100/60 hover:text-gold-300">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-xs text-red-300">Incorrect password.</motion.p>}
          <button type="submit" disabled={loading || (isCloud && !email) || !pass} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 px-5 py-3.5 font-heading font-semibold text-royal-900 transition hover:-translate-y-0.5 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? "Verifying…" : "Login to Admin Panel"}
          </button>
        </div>
        <p className="mt-6 text-center font-body text-[0.7rem] text-royal-100/40">Protected area · Authorized personnel only</p>
      </motion.form>
    </div>
  );
}
