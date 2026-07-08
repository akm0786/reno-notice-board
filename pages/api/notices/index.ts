import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { noticeInputSchema } from "@/lib/validation";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
    });
    return res.status(200).json(notices);
  }

  if (req.method === "POST") {
    const parsed = noticeInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", issues: parsed.error.flatten() });
    }
    const created = await prisma.notice.create({
      data: { ...parsed.data, publishDate: new Date(parsed.data.publishDate) },
    });
    return res.status(201).json(created);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
