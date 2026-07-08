import Head from "next/head";
import Link from "next/link";
import NoticeForm from "@/components/NoticeForm";

export default function NewNoticePage() {
  return (
    <>
      <Head><title>New notice</title></Head>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-gray-600 hover:underline">← Back</Link>
        <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">New notice</h1>
        <NoticeForm />
      </main>
    </>
  );
}
