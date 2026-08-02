import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props { children: ReactNode; fallback?: React.ReactNode }
interface State { error: Error | null }

export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[AdminPanel Crash]", error.message, info.componentStack);
    try {
      const log = {
        error: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
        time: new Date().toISOString(),
        url: window.location.href,
      };
      const existing = localStorage.getItem("gbhss-error-log") || "[]";
      const logs = JSON.parse(existing);
      logs.push(log);
      localStorage.setItem("gbhss-error-log", JSON.stringify(logs.slice(-10)));
    } catch { /* ignore */ }
  }

  render() {
    if (this.state.error) {
      return this.props.fallback || (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-royal-950 to-royal-900 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <AlertTriangle className="h-10 w-10 text-gold-400" />
          </div>
          <div>
            <h1 className="font-display text-xl text-white">Something went wrong</h1>
            <p className="mt-2 max-w-md font-body text-sm text-royal-100/70">
              The admin panel encountered an unexpected error. This is not your fault.
            </p>
            <details className="mt-3 font-mono text-xs text-royal-100/50">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="mt-2 max-w-md overflow-auto text-left">{this.state.error.message}</pre>
            </details>
          </div>
          <button
            type="button"
            onClick={() => {
              this.setState({ error: null });
              window.location.hash = "/lakshya-admin";
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 px-6 py-3 font-heading text-sm font-semibold text-royal-900 transition hover:-translate-y-0.5"
          >
            <RefreshCcw className="h-4 w-4" /> Reload Admin Panel
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
