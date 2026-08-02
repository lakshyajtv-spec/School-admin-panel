import { useRef } from "react";
import toast from "react-hot-toast";
import { Download, RotateCcw, Trash2, Upload } from "lucide-react";
import {
  downloadSiteData,
  parseSiteData,
  siteDataSizeKB,
} from "@/cms/lib/backup";
import { useCms } from "@/cms/context";
import { Button, Card, Confirm, PageHeader, Skeleton } from "@/cms/ui";
import { useState } from "react";

export default function BackupPage() {
  const { draft, siteData, applyImport, resetAll } = useCms();
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);

  if (!draft || !siteData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const importFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseSiteData(String(reader.result));
      if (parsed) {
        applyImport(parsed);
      } else {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(f);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Backup & Restore"
        subtitle="Export a complete backup of all website content, or restore a backup on any device."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="flex flex-col items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-700 to-royal-500 text-white">
            <Download className="h-6 w-6" />
          </span>
          <h3 className="font-heading text-sm font-semibold text-royal-900">Export Backup</h3>
          <p className="font-body text-xs leading-relaxed text-slate-500">
            Downloads one JSON file containing ALL website data — content,
            teachers, gallery, notices, settings and images.
          </p>
          <p className="rounded-full bg-royal-50 px-3 py-1 font-body text-[0.7rem] text-royal-700">
            {siteDataSizeKB(draft)} KB · {draft.gallery.length} images
          </p>
          <Button variant="blue" onClick={() => downloadSiteData(draft)}>
            <Download className="h-4 w-4" /> Download Backup
          </Button>
        </Card>

        <Card className="flex flex-col items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-300 text-royal-900">
            <Upload className="h-6 w-6" />
          </span>
          <h3 className="font-heading text-sm font-semibold text-royal-900">Import / Restore</h3>
          <p className="font-body text-xs leading-relaxed text-slate-500">
            Restore a previously exported JSON file into the draft, then press
            Publish to apply it to the website.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              importFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Choose Backup File
          </Button>
        </Card>
      </div>

      <Card className="flex flex-col items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-400 text-white">
          <RotateCcw className="h-6 w-6" />
        </span>
        <h3 className="font-heading text-sm font-semibold text-royal-900">Reset to Defaults</h3>
        <p className="font-body text-xs leading-relaxed text-slate-500">
          Restore the original default website content (Supabase + localStorage).
          Export a backup first if you need one.
        </p>
        <Button variant="danger" onClick={() => setResetOpen(true)}>
          <Trash2 className="h-4 w-4" /> Reset All Content
        </Button>
      </Card>

      <Confirm
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={resetAll}
        title="Reset All Content"
        message="All content will be replaced with the original defaults and published immediately. Continue?"
      />
    </div>
  );
}
