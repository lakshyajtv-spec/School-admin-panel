import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/**
 * Global React Error Boundary.
 * Any uncaught render error is caught here and shown as a premium
 * fallback page instead of a blank white screen. The real error is
 * logged to the console for debugging.
 */
interface Props {
  children: ReactNode;
  /** Optional label shown in the fallback (e.g. "Admin Panel"). */
  label?: string;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Meaningful log — this is what surfaces in the browser console.
    console.error("[ErrorBoundary] Caught runtime error:", error, info);
  }

  private reset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const { error } = this.state;
    const isAdmin = this.props.label === "Admin Panel";

    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 px-4">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.12]" />
        <div className="pointer-events-none absolute -top-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-royal-500/25 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold-400/20 blur-[130px]" />

        <div
          role="alert"
          className="glass-dark relative w-full max-w-md rounded-[2rem] p-7 text-center shadow-[0_50px_100px_-40px_rgba(0,0,0,.8)] sm:p-9"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500/80 to-red-400/80 text-white shadow-[0_18px_40px_-16px_rgba(220,38,38,.9)]">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <p className="mt-5 font-heading text-[0.68rem] font-semibold tracking-[0.22em] text-gold-300 uppercase">
            {isAdmin ? "Admin Panel Error" : "Something Went Wrong"}
          </p>
          <h1 className="mt-3 font-display text-2xl text-white">
            An unexpected error occurred
          </h1>
          <p className="mt-3 font-body text-sm leading-relaxed text-royal-100/75">
            {error.message || "Unknown error"} — the error has been logged to
            the console. Try reloading the page.
          </p>

          <details className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
            <summary className="flex cursor-pointer items-center gap-2 font-heading text-xs font-semibold text-royal-100/80">
              <AlertTriangle className="h-3.5 w-3.5 text-gold-300" /> Error
              details (for support)
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto font-mono text-[0.65rem] leading-relaxed whitespace-pre-wrap text-royal-100/60">
              {error.stack || error.message}
            </pre>
          </details>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 px-5 py-3 font-heading text-sm font-semibold text-royal-900 transition hover:-translate-y-0.5"
            >
              <RefreshCw className="h-4 w-4" /> Reload Page
            </button>
            <a
              href={isAdmin ? "#/lakshya-admin" : "#/"}
              onClick={this.reset}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 font-heading text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Home className="h-4 w-4" /> Go to {isAdmin ? "Login" : "Home"}
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 opacity-60">
            <Logo className="h-7 w-7" />
            <p className="font-heading text-[0.6rem] tracking-[0.18em] text-royal-100/60 uppercase">
              Govt. Boys H. S. School Cantt, Guna
            </p>
          </div>
        </div>
      </div>
    );
  }
}
