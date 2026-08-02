/**
 * CMS Context — authentication, draft state, publish and activity log.
 *
 * Data engine: TanStack Query loads the live site from the repository;
 * the draft is initialized once and synced only when the fetched data
 * reference changes (no effect loops → no React Error #310).
 * Publish writes to Supabase (or localStorage fallback) and pushes the
 * result into LanguageContext so the public website updates instantly.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/i18n/LanguageContext";
import { ADMIN_PASSWORD } from "@/config/admin";
import {
  fetchSiteData,
  resetAllData,
  safeClone,
} from "@/cms/lib/repository";
import type { SiteData } from "@/cms/lib/types";
import { uid } from "@/cms/lib/types";

/* ------------------------------ auth storage ------------------------------ */

const AUTH_KEY = "lacms-auth";
const PASS_OVERRIDE_KEY = "lacms-pass";

function getPassword(): string {
  try {
    return localStorage.getItem(PASS_OVERRIDE_KEY) || ADMIN_PASSWORD;
  } catch {
    return ADMIN_PASSWORD;
  }
}

export function setPassword(p: string) {
  try {
    localStorage.setItem(PASS_OVERRIDE_KEY, p);
  } catch {
    /* ignore */
  }
}

export function isAuthed(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAuthed(v: boolean) {
  try {
    if (v) localStorage.setItem(AUTH_KEY, "1");
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------ activity ------------------------------ */

const ACTIVITY_KEY = "lacms-activity";

export function getActivity(): { id: string; text: string; time: string }[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function logActivity(text: string) {
  try {
    const list = getActivity();
    list.unshift({
      id: uid(),
      text,
      time: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list.slice(0, 15)));
  } catch {
    /* ignore */
  }
}

/* ------------------------------ context ------------------------------ */

interface CmsCtx {
  authed: boolean;
  login: (pass: string) => boolean;
  logout: () => void;
  /** Fetched live site data (TanStack Query). */
  siteData: SiteData | undefined;
  loading: boolean;
  /** Editable working copy. */
  draft: SiteData | undefined;
  setDraft: React.Dispatch<React.SetStateAction<SiteData | undefined>>;
  dirty: boolean;
  publishing: boolean;
  publish: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Import a backup into the draft (not yet published). */
  applyImport: (d: SiteData) => void;
  /** Reset everything (DB + local) and publish defaults. */
  resetAll: () => Promise<void>;
}

const CmsContext = createContext<CmsCtx | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const { saveSiteData } = useLanguage();
  const queryClient = useQueryClient();

  const [authed, setAuthedState] = useState(isAuthed);
  const [draft, setDraft] = useState<SiteData | undefined>(undefined);
  const [publishing, setPublishing] = useState(false);

  // Live data from Supabase / localStorage fallback (react-query).
  const query = useQuery({
    queryKey: ["cms-site"],
    queryFn: fetchSiteData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  const siteData = query.data;

  // Initialize draft once; sync only when fetched data reference changes.
  const lastRef = useRef<SiteData | undefined>(undefined);
  useEffect(() => {
    if (siteData && lastRef.current !== siteData) {
      lastRef.current = siteData;
      setDraft((prev) => (prev === undefined ? safeClone(siteData) : prev));
    }
  }, [siteData]);

  const dirty = useMemo(() => {
    if (!draft || !siteData) return false;
    try {
      return JSON.stringify(draft) !== JSON.stringify(siteData);
    } catch {
      return false;
    }
  }, [draft, siteData]);

  const login = useCallback((pass: string) => {
    const ok = pass === getPassword();
    if (ok) {
      setAuthed(true);
      setAuthedState(true);
      logActivity("Admin logged in");
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    setAuthedState(false);
    toast.success("Logged out");
  }, []);

  const publish = useCallback(async () => {
    if (!draft) return;
    if (publishing) return;
    setPublishing(true);
    const tId = toast.loading("Publishing changes…");
    try {
      const stamped = { ...safeClone(draft), publishedAt: new Date().toISOString() };
      setDraft(stamped);
      const ok = await saveSiteData(safeClone(stamped));
      if (ok) {
        toast.success("Published — website updated instantly", { id: tId });
        logActivity("Published website content");
        queryClient.invalidateQueries({ queryKey: ["cms-site"] });
      } else {
        toast.error("Publish failed — see console for details", { id: tId });
      }
    } catch (err) {
      console.error("[cms] Publish error:", err);
      toast.error(
        `Publish failed — ${err instanceof Error ? err.message : String(err)}`,
        { id: tId },
      );
    } finally {
      setPublishing(false);
    }
  }, [draft, publishing, saveSiteData, queryClient]);

  const refresh = useCallback(async () => {
    const tId = toast.loading("Refreshing…");
    try {
      await queryClient.refetchQueries({ queryKey: ["cms-site"] });
      toast.success("Content refreshed", { id: tId });
    } catch (err) {
      console.error("[cms] Refresh error:", err);
      toast.error("Refresh failed", { id: tId });
    }
  }, [queryClient]);

  const applyImport = useCallback((d: SiteData) => {
    setDraft(safeClone(d));
    toast.success("Backup loaded into draft — press Publish to apply");
  }, []);

  const resetAll = useCallback(async () => {
    const tId = toast.loading("Resetting content…");
    try {
      const fresh = await resetAllData();
      const stamped = { ...fresh, publishedAt: new Date().toISOString() };
      setDraft(stamped);
      await saveSiteData(safeClone(stamped));
      await queryClient.invalidateQueries({ queryKey: ["cms-site"] });
      toast.success("Content reset to defaults", { id: tId });
      logActivity("Reset all content");
    } catch (err) {
      console.error("[cms] Reset error:", err);
      toast.error("Reset failed", { id: tId });
    }
  }, [saveSiteData, queryClient]);

  const value = useMemo<CmsCtx>(
    () => ({
      authed,
      login,
      logout,
      siteData,
      loading: query.isLoading && !draft,
      draft,
      setDraft,
      dirty,
      publishing,
      publish,
      refresh,
      applyImport,
      resetAll,
    }),
    [authed, login, logout, siteData, query.isLoading, draft, dirty, publishing, publish, refresh, applyImport, resetAll],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsCtx {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
  return ctx;
}

/** Convenience: latest draft (falls back to fetched data). */
export function useDraft(): SiteData {
  const { draft, siteData } = useCms();
  return draft ?? siteData ?? ({} as SiteData);
}
