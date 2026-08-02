import { useState } from "react";
import toast from "react-hot-toast";
import { Bell, Pencil, Pin, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeFormSchema, type NoticeFormValues } from "@/cms/lib/schemas";
import { todayISO, uid, type NoticeRecord } from "@/cms/lib/types";
import {
  Badge,
  Button,
  Card,
  Confirm,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  SearchBox,
  Select,
  Skeleton,
  Textarea,
  Toggle,
} from "@/cms/ui";
import { useCms } from "@/cms/context";
import { cn } from "@/utils/cn";

export default function NoticesPage() {
  const { draft, setDraft } = useCms();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "pinned">("all");
  const [editing, setEditing] = useState<NoticeRecord | null>(null);
  const [deleting, setDeleting] = useState<NoticeRecord | null>(null);

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      tag: "Latest Notice",
      title: "",
      body: "",
      date: todayISO(),
      pinned: false,
      important: false,
      status: "published",
      publishDate: "",
      expiryDate: "",
    },
  });

  if (!draft) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const notices = draft.notices;
  const filtered = notices.filter((n) => {
    const matchQ =
      n.title.toLowerCase().includes(q.toLowerCase()) ||
      n.tag.toLowerCase().includes(q.toLowerCase());
    if (!matchQ) return false;
    if (filter === "published") return n.status === "published";
    if (filter === "draft") return n.status === "draft";
    if (filter === "pinned") return n.pinned;
    return true;
  });

  const openEdit = (n: NoticeRecord | null) => {
    setEditing(n);
    form.reset(
      n
        ? {
            tag: n.tag,
            title: n.title,
            body: n.body,
            date: n.date,
            pinned: n.pinned,
            important: n.important,
            status: n.status,
            publishDate: n.publishDate,
            expiryDate: n.expiryDate,
          }
        : {
            tag: "Latest Notice",
            title: "",
            body: "",
            date: todayISO(),
            pinned: false,
            important: false,
            status: "published",
            publishDate: "",
            expiryDate: "",
          },
    );
  };

  const submit = (values: NoticeFormValues) => {
    if (!editing) return;
    const record: NoticeRecord = { id: editing.id || uid(), ...values };
    const exists = notices.some((x) => x.id === record.id);
    setDraft({
      ...draft,
      notices: exists
        ? notices.map((x) => (x.id === record.id ? record : x))
        : [...notices, record],
    });
    setEditing(null);
    toast.success(exists ? "Notice updated" : "Notice created");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notice Board Management"
        subtitle="Pin important notices, schedule publish/expiry dates."
        actions={
          <Button variant="gold" onClick={() => openEdit(null)}>
            <Plus className="h-4 w-4" /> Create Notice
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Search notices…" />
        {(["all", "published", "draft", "pinned"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-heading text-xs font-semibold transition",
              filter === f
                ? "bg-royal-700 text-white"
                : "bg-royal-50 text-royal-700 hover:bg-royal-100",
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {notices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices yet"
          desc="Create your first notice for the school notice board."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card key={n.id} className={cn("p-4 sm:p-5", n.pinned && "ring-1 ring-gold-300")}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={n.important ? "red" : "blue"}>{n.tag}</Badge>
                {n.pinned && (
                  <Badge tone="gold">
                    <Pin className="h-3 w-3" /> Pinned
                  </Badge>
                )}
                <Badge tone={n.status === "published" ? "green" : "slate"}>
                  {n.status}
                </Badge>
                <span className="ml-auto font-body text-xs text-slate-400">{n.date}</span>
              </div>
              <h4 className="mt-2 font-heading text-[1rem] font-semibold text-royal-900">
                {n.title}
              </h4>
              <p className="mt-1 line-clamp-2 font-body text-sm text-slate-600">{n.body}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-royal-50 pt-3">
                <div className="flex items-center gap-4">
                  <Toggle
                    checked={n.pinned}
                    onChange={(v) =>
                      setDraft({
                        ...draft,
                        notices: notices.map((x) => (x.id === n.id ? { ...x, pinned: v } : x)),
                      })
                    }
                    label="Pin"
                  />
                  <Toggle
                    checked={n.important}
                    onChange={(v) =>
                      setDraft({
                        ...draft,
                        notices: notices.map((x) =>
                          x.id === n.id ? { ...x, important: v } : x,
                        ),
                      })
                    }
                    label="Important"
                  />
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(n)}
                    aria-label="Edit notice"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-700 transition hover:bg-royal-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(n)}
                    aria-label="Delete notice"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing && notices.some((x) => x.id === editing.id) ? "Edit Notice" : "Create Notice"}
        wide
      >
        {editing && (
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tag / Category" error={form.formState.errors.tag?.message}>
                <Input {...form.register("tag")} placeholder="e.g. Latest Notice" />
              </Field>
              <Field label="Display Date">
                <Input type="date" {...form.register("date")} />
              </Field>
            </div>
            <Field label="Title" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} placeholder="Notice title" />
            </Field>
            <Field label="Body" error={form.formState.errors.body?.message}>
              <Textarea rows={3} {...form.register("body")} placeholder="Notice body…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Publish From (empty = now)">
                <Input type="date" {...form.register("publishDate")} />
              </Field>
              <Field label="Expiry Date (empty = never)">
                <Input type="date" {...form.register("expiryDate")} />
              </Field>
            </div>
            <Field label="Status">
              <Select {...form.register("status")}>
                <option value="published">Published (visible on website)</option>
                <option value="draft">Draft (hidden)</option>
              </Select>
            </Field>
            <div className="flex flex-wrap gap-5 pt-1">
              <Toggle
                checked={form.watch("pinned")}
                onChange={(v) => form.setValue("pinned", v)}
                label="Pin to top"
              />
              <Toggle
                checked={form.watch("important")}
                onChange={(v) => form.setValue("important", v)}
                label="Important badge"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="gold" type="submit">
                Save Notice
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          setDraft({ ...draft, notices: notices.filter((x) => x.id !== deleting.id) });
          toast.success("Notice deleted");
        }}
        title="Delete Notice"
        message="Remove this notice from the notice board?"
      />
    </div>
  );
}
