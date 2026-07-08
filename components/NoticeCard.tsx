import Link from "next/link";
import type { Notice } from "@prisma/client";

const categoryLabel: Record<Notice["category"], string> = {
  EXAM: "Exam",
  EVENT: "Event",
  GENERAL: "General",
};

export default function NoticeCard({
  notice,
  onDelete,
}: {
  notice: Notice;
  onDelete: (n: Notice) => void;
}) {
  const isUrgent = notice.priority === "URGENT";
  return (
    <article
      className={`flex flex-col rounded-lg border bg-white p-5 shadow-sm ${
        isUrgent ? "border-l-4 border-l-red-600 border-gray-200" : "border-gray-200"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          {categoryLabel[notice.category]}
        </span>
        {isUrgent && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            Urgent
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
      <p className="mt-1 text-xs text-gray-500">
        {new Date(notice.publishDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>

      {notice.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.imageUrl}
          alt=""
          className="mt-3 h-40 w-full rounded-md object-cover"
        />
      )}

      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{notice.body}</p>

      <div className="mt-5 flex gap-2 pt-3">
        <Link
          href={`/notices/${notice.id}/edit`}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(notice)}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
