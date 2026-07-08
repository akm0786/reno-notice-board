import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import type { Notice } from "@prisma/client";
import NoticeCard from "@/components/NoticeCard";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Home() {
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [toDelete, setToDelete] = useState<Notice | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/notices");
    setNotices(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    await fetch(`/api/notices/${toDelete.id}`, { method: "DELETE" });
    setBusy(false);
    setToDelete(null);
    load();
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="Institution notice board" />
      </Head>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
            <p className="text-sm text-gray-500">Urgent notices appear first.</p>
          </div>
          <Link
            href="/notices/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + New notice
          </Link>
        </header>

        {notices === null ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : notices.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-600">No notices yet.</p>
            <Link
              href="/notices/new"
              className="mt-3 inline-block text-sm font-medium text-gray-900 underline"
            >
              Create the first one
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((n) => (
              <NoticeCard key={n.id} notice={n} onDelete={setToDelete} />
            ))}
          </section>
        )}

        <ConfirmDialog
          open={!!toDelete}
          title="Delete notice?"
          message={`"${toDelete?.title}" will be permanently removed.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
          busy={busy}
        />
      </main>
    </>
  );
}
