import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Images, Pencil, Trash2, Upload } from "lucide-react";
import { uploadImage } from "@/cms/lib/storage";
import { uid, type GalleryRecord } from "@/cms/lib/types";
import {
  Button,
  Card,
  Confirm,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  ReorderControls,
  SearchBox,
  Skeleton,
  Textarea,
} from "@/cms/ui";
import { useCms } from "@/cms/context";

const emptyRecord = (): GalleryRecord => ({
  id: uid(),
  src: "",
  title: "",
  caption: "",
  category: "",
});

export default function GalleryPage() {
  const { draft, setDraft } = useCms();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState<GalleryRecord | null>(null);
  const [deleting, setDeleting] = useState<GalleryRecord | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const multiRef = useRef<HTMLInputElement>(null);

  if (!draft) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const items = draft.gallery;
  const categories = Array.from(new Set(items.map((g) => g.category).filter(Boolean)));
  const filtered = items.filter(
    (g) =>
      (cat === "all" || g.category === cat) &&
      (g.title.toLowerCase().includes(q.toLowerCase()) ||
        g.category.toLowerCase().includes(q.toLowerCase())),
  );

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setDraft({ ...draft, gallery: next });
  };

  const addMany = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const tId = toast.loading(`Uploading ${files.length} image(s)…`);
    const records: GalleryRecord[] = [];
    for (const file of Array.from(files).slice(0, 8)) {
      try {
        const url = await uploadImage(file, "gallery");
        records.push({
          ...emptyRecord(),
          src: url,
          title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        });
      } catch (err) {
        console.error(`[cms] Upload failed for ${file.name}:`, err);
        toast.error(`Skipped ${file.name}`);
      }
    }
    if (records.length) {
      setDraft({ ...draft, gallery: [...items, ...records] });
      toast.success(`${records.length} image(s) uploaded`, { id: tId });
    } else {
      toast.error("No images could be uploaded", { id: tId });
    }
    setUploading(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gallery Management"
        subtitle="Upload multiple images, edit captions, organize by category."
        actions={
          <>
            <input
              ref={multiRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addMany(e.target.files)}
            />
            <Button variant="gold" onClick={() => multiRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload Images"}
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Search gallery…" />
        <button
          type="button"
          onClick={() => setCat("all")}
          className={
            cat === "all"
              ? "rounded-full bg-royal-700 px-3.5 py-1.5 font-heading text-xs font-semibold text-white"
              : "rounded-full bg-royal-50 px-3.5 py-1.5 font-heading text-xs font-semibold text-royal-700 hover:bg-royal-100"
          }
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={
              cat === c
                ? "rounded-full bg-royal-700 px-3.5 py-1.5 font-heading text-xs font-semibold text-white"
                : "rounded-full bg-royal-50 px-3.5 py-1.5 font-heading text-xs font-semibold text-royal-700 hover:bg-royal-100"
            }
          >
            {c}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No gallery images"
          desc="Upload images — they will appear in the campus gallery."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((g) => (
              <div
                key={g.id}
                className="group relative overflow-hidden rounded-[1.4rem] border border-white bg-white/90 shadow-[0_16px_44px_-32px_rgba(15,76,129,.6)]"
              >
                <img
                  src={g.src}
                  alt={g.title}
                  className="h-36 w-full object-cover sm:h-44"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute right-2 bottom-2 left-2 flex translate-y-2 items-center justify-between gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="min-w-0">
                    <p className="truncate font-heading text-xs font-semibold text-white">
                      {g.title || "Untitled"}
                    </p>
                    {g.category && (
                      <p className="font-body text-[0.65rem] text-gold-200">{g.category}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...g })}
                      aria-label="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(g)}
                      aria-label="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/80 text-white backdrop-blur transition hover:bg-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      )}

      {/* Reorder strip for the visible items */}
      {filtered.length > 1 && (
        <Card>
          <p className="mb-3 font-heading text-xs font-semibold tracking-wide text-slate-600 uppercase">
            Display Order (drag or use arrows)
          </p>
          <div className="space-y-2">
            {filtered.map((g) => {
              const realIdx = items.findIndex((x) => x.id === g.id);
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-3 rounded-xl bg-royal-50/60 px-3 py-2"
                >
                  <ReorderControls
                    index={realIdx}
                    count={items.length}
                    onMove={move}
                    onDragStart={() => setDragIdx(realIdx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIdx !== null && dragIdx !== realIdx) move(dragIdx, realIdx);
                      setDragIdx(null);
                    }}
                  />
                  <img src={g.src} alt="" className="h-10 w-14 rounded-lg object-cover" />
                  <span className="truncate font-body text-sm text-slate-700">
                    {g.title || "Untitled"}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Gallery Image"
      >
        {editing && (
          <div className="space-y-4">
            <img src={editing.src} alt="Preview" className="h-44 w-full rounded-2xl object-cover" />
            <Field label="Image URL">
              <Input
                value={editing.src}
                onChange={(e) => setEditing({ ...editing, src: e.target.value })}
              />
            </Field>
            <Field label="Title">
              <Input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Caption">
              <Textarea
                rows={2}
                value={editing.caption}
                onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <Input
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                placeholder="e.g. Campus, Labs, Sports"
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button
                variant="gold"
                onClick={() => {
                  setDraft({
                    ...draft,
                    gallery: items.map((x) => (x.id === editing.id ? editing : x)),
                  });
                  setEditing(null);
                  toast.success("Gallery image updated");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          setDraft({ ...draft, gallery: items.filter((x) => x.id !== deleting.id) });
          toast.success("Image removed");
        }}
        title="Delete Image"
        message="Remove this image from the gallery?"
      />
    </div>
  );
}
