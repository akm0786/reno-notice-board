import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import type { Notice } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import NoticeForm from "@/components/NoticeForm";

type Props = { notice: Notice };

export default function EditNoticePage({ notice }: Props) {
  return (
    <>
      <Head><title>Edit notice</title></Head>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-gray-600 hover:underline">← Back</Link>
        <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">Edit notice</h1>
        <NoticeForm initial={notice} />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };
  // Serialize Date fields
  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)) as Notice,
    },
  };
};
