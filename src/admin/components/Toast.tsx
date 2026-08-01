import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "loading";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastCtx = createContext<{ toast: (msg: string, type?: ToastType) => void }>({ toast: () => {} });

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastId;
    setToasts((p) => [...p, { id, message, type }]);
    const timeout = type === "loading" ? 4000 : 2600;
    window.setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), timeout);
  }, []);

  const icon = (t: ToastType) => {
    if (t === "success") return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />;
    if (t === "error") return <X className="h-4 w-4 shrink-0 text-red-400" />;
    if (t === "warning") return <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />;
    return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-400" />;
  };

  return (
    <ToastCtx.Provider value={{ toast: add }}>
      {children}
      <AnimatePresence>
        <div className="fixed bottom-5 right-5 z-[200] flex flex-col-reverse gap-2">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="flex items-center gap-2.5 rounded-full border border-white/20 bg-royal-900/90 px-4 py-2.5 font-body text-xs text-white shadow-2xl backdrop-blur-lg"
            >
              {icon(t.type)}{t.message}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx).toast;
}
