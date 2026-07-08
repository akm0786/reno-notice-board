import { useRouter } from "next/router";
import { useState } from "react";
import type { Notice } from "@prisma/client";

type FormState = {
  title: string;
  body: string;
  category: "EXAM" | "EVENT" | "GENERAL";
  priority: "NORMAL" | "URGENT";
  publishDate: string;
  imageUrl: string;
};

function toDateInput(d: Date | string) {
  const dt = new Date(d);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

export default function NoticeForm({ initial }: { initial?: Notice }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    body: initial?.body ?? "",
    category: initial?.category ?? "GENERAL",
    priority: initial?.priority ?? "NORMAL",
    publishDate: initial ? toDateInput(initial.publishDate) : toDateInput(new Date()),
    imageUrl: initial?.imageUrl ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    const url = initial ? `/api/notices/${initial.id}` : "/api/notices";
    const method = initial ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl: form.imageUrl || undefined }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrors(data?.issues?.fieldErrors ?? { _form: ["Something went wrong"] });
      setSubmitting(false);
      return;
    }
    router.push("/");
  }

  const err = (k: string) => errors[k]?.[0];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Title" error={err("title")}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="input"
          required
        />
      </Field>

      <Field label="Body" error={err("body")}>
        <textarea
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          rows={5}
          className="input"
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Category" error={err("category")}>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as FormState["category"])}
            className="input"
          >
            <option value="EXAM">Exam</option>
            <option value="EVENT">Event</option>
            <option value="GENERAL">General</option>
          </select>
        </Field>

        <Field label="Publish date" error={err("publishDate")}>
          <input
            type="date"
            value={form.publishDate}
            onChange={(e) => set("publishDate", e.target.value)}
            className="input"
            required
          />
        </Field>
      </div>

      <Field label="Priority" error={err("priority")}>
        <div className="flex gap-4 pt-1">
          {(["NORMAL", "URGENT"] as const).map((p) => (
            <label key={p} className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="priority"
                value={p}
                checked={form.priority === p}
                onChange={() => set("priority", p)}
              />
              {p === "NORMAL" ? "Normal" : "Urgent"}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Image URL (optional)" error={err("imageUrl")}>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://…"
          className="input"
        />
      </Field>

      {errors._form && <p className="text-sm text-red-600">{errors._form[0]}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
