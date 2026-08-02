import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCms } from "@/cms/context";
import { useT } from "@/i18n/LanguageContext";

export default function Login() {
  const { login } = useCms();
  const t = useT();
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass) {
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    window.setTimeout(() => {
      const ok = login(pass);
      setLoading(false);
      if (!ok) {
        setError(true);
        toast.error("Incorrect password — please try again");
      } else {
        toast.success("Welcome back, Admin");
      }
    }, 650);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 px-4">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.12]" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-royal-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold-400/20 blur-[130px]" />
      <div className="animate-floaty pointer-events-none absolute top-[16%] left-[10%] h-16 w-16 rounded-2xl border border-white/15 bg-white/5" />

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-dark relative w-full max-w-md rounded-[2.25rem] p-7 shadow-[0_50px_100px_-40px_rgba(0,0,0,.8)] sm:p-9"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gold-300/25 blur-xl" />
            <Logo className="relative h-16 w-16" />
          </div>
          <p className="mt-4 font-display text-base font-extrabold text-white">
            {t.meta.schoolNameCaps}
          </p>
          <p className="font-heading text-[0.65rem] tracking-[0.28em] text-gold-300 uppercase">
            {t.meta.schoolPlace}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3.5 py-1 font-heading text-[0.68rem] font-semibold tracking-wider text-gold-200 uppercase">
            <Sparkles className="h-3 w-3" /> Admin Panel
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block font-heading text-xs font-semibold tracking-wide text-royal-100/80 uppercase">
              Admin Password
            </span>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-royal-100/40" />
              <input
                type={show ? "text" : "password"}
                value={pass}
                autoFocus
                onChange={(e) => {
                  setPass(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pr-12 pl-10 font-body text-sm text-white placeholder-royal-100/40 outline-none transition focus:border-gold-300/60 focus:ring-4 focus:ring-gold-300/20"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-royal-100/50 transition hover:text-gold-300"
              >
                {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-body text-xs text-red-300"
            >
              Incorrect password. Please try again.
            </motion.p>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 px-5 py-3.5 font-heading font-semibold text-royal-900 shadow-[0_18px_45px_-16px_rgba(212,175,55,.85)] transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-royal-900/30 border-t-royal-900" />
                Verifying…
              </>
            ) : (
              <>
                <ShieldCheck className="h-4.5 w-4.5" /> Login to Dashboard
              </>
            )}
          </motion.button>

          <p className="text-center font-body text-[0.7rem] text-royal-100/45">
            Authorized personnel only · Single password access
          </p>
        </div>
      </motion.form>
    </div>
  );
}
