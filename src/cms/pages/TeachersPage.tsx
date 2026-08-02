import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Pencil,
  Plus,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherFormSchema, type TeacherFormValues } from "@/cms/lib/schemas";
import { uploadImage } from "@/cms/lib/storage";
import { uid, type TeacherRecord } from "@/cms/lib/types";
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
  ReorderControls,
  SearchBox,
  Skeleton,
} from "@/cms/ui";
import { useCms } from "@/cms/context";

export default function TeachersPage() {
  const { draft, setDraft } = useCms();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<TeacherRecord | null>(null);
  const [deleting, setDeleting] = useState<TeacherRecord | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: { name: "", subject: "", qualification: "", experience: "", designation: "Subject Teacher" },
  });

  if (!draft) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const teachers = draft.teachers;
  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      t.subject.toLowerCase().includes(q.toLowerCase()),
  );

  const move = (from: number, to: number) => {
    if (to < 0 || to >= teachers.length) return;
    const next = [...teachers];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setDraft({ ...draft, teachers: next });
  };

  const openEdit = (t: TeacherRecord | null) => {
    setEditing(t);
    form.reset(
      t
        ? {
            name: t.name,
            subject: t.subject,
            qualification: t.qualification,
            experience: t.experience,
            designation: t.designation,
          }
        : { name: "", subject: "", qualification: "", experience: "", designation: "Subject Teacher" },
    );
  };

  const submit = (values: TeacherFormValues) => {
    if (!editing) return;
    const record: TeacherRecord = {
      id: editing.id || uid(),
      photo: editing.photo,
      ...values,
    };
    const exists = teachers.some((x) => x.id === record.id);
    setDraft({
      ...draft,
      teachers: exists
        ? teachers.map((x) => (x.id === record.id ? record : x))
        : [...teachers, record],
    });
    setEditing(null);
    toast.success(exists ? "Teacher updated" : "Teacher added");
  };

  const pickPhoto = async (file: File | undefined) => {
    if (!file || !editing) return;
    setUploading(true);
    const tId = toast.loading("Uploading photo…");
    try {
      const url = await uploadImage(file, "teachers");
      setEditing({ ...editing, photo: url });
      toast.success("Photo uploaded", { id: tId });
    } catch (err) {
      console.error("[cms] Photo upload failed:", err);
      toast.error("Photo upload failed", { id: tId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teachers Management"
        subtitle="Add, edit, reorder and upload photos — the website updates on publish."
        actions={
          <Button variant="gold" onClick={() => openEdit(null)}>
            <Plus className="h-4 w-4" /> Add Teacher
          </Button>
        }
      />

      <SearchBox value={q} onChange={setQ} placeholder="Search teachers by name or subject…" />

      {teachers.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No teachers yet"
          desc="Click 'Add Teacher' to create your first teacher card."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => {
            const realIdx = teachers.findIndex((x) => x.id === t.id);
            return (
              <Card key={t.id} className="relative p-5">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-royal-500 via-gold-300 to-royal-400 p-[2.5px]">
                      <div className="h-full w-full rounded-full bg-white" />
                    </div>
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.name || t.subject}
                        className="absolute inset-[5px] h-[calc(100%-10px)] w-[calc(100%-10px)] rounded-full object-cover object-top"
                      />
                    ) : (
                      <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-gradient-to-br from-royal-50 to-royal-100 text-royal-600">
                        <UserRound className="h-7 w-7" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-[0.95rem] font-semibold text-royal-900">
                      {t.name || <span className="text-slate-400">Unnamed</span>}
                    </p>
                    <p className="truncate font-body text-xs text-gold-600">{t.subject}</p>
                    <p className="font-body text-[0.68rem] tracking-wide text-slate-400 uppercase">
                      {t.designation}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {t.qualification && <Badge tone="blue">{t.qualification}</Badge>}
                      {t.experience && <Badge tone="gold">{t.experience}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-royal-50 pt-3">
                  <ReorderControls
                    index={realIdx}
                    count={teachers.length}
                    onMove={move}
                    onDragStart={() => setDragIdx(realIdx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIdx !== null && dragIdx !== realIdx) move(dragIdx, realIdx);
                      setDragIdx(null);
                    }}
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(t)}
                      aria-label="Edit teacher"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-700 transition hover:bg-royal-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(t)}
                      aria-label="Delete teacher"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing && teachers.some((x) => x.id === editing.id) ? "Edit Teacher" : "Add Teacher"}
        wide
      >
        {editing && (
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-royal-500 via-gold-300 to-royal-400 p-[3px]">
                  <div className="h-full w-full rounded-full bg-white" />
                </div>
                {editing.photo ? (
                  <img
                    src={editing.photo}
                    alt="Teacher"
                    className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-full object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-[6px] flex items-center justify-center rounded-full bg-royal-50 text-royal-400">
                    <UserRound className="h-9 w-9" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickPhoto(e.target.files?.[0])}
                />
                <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload Photo"}
                </Button>
              </div>
            </div>

            <Field label="Photo URL (optional)">
              <Input
                value={editing.photo}
                onChange={(e) => setEditing({ ...editing, photo: e.target.value })}
                placeholder="https://… or data:image/…"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={form.formState.errors.name?.message}>
                <Input {...form.register("name")} placeholder="e.g. Shri R. K. Sharma" />
              </Field>
              <Field label="Subject" error={form.formState.errors.subject?.message}>
                <Input {...form.register("subject")} placeholder="e.g. Mathematics" />
              </Field>
              <Field label="Qualification">
                <Input {...form.register("qualification")} placeholder="e.g. M.Sc., B.Ed." />
              </Field>
              <Field label="Experience">
                <Input {...form.register("experience")} placeholder="e.g. 15 years" />
              </Field>
            </div>
            <Field label="Designation">
              <Input {...form.register("designation")} placeholder="e.g. Subject Teacher" />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="gold" type="submit">
                <Plus className="h-4 w-4" /> Save Teacher
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
          setDraft({ ...draft, teachers: teachers.filter((x) => x.id !== deleting.id) });
          toast.success("Teacher deleted");
        }}
        title="Delete Teacher"
        message={`Delete ${deleting?.name || "this teacher"}? It will be removed from the website after publishing.`}
      />
    </div>
  );
}
