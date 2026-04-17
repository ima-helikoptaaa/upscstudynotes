import { prisma } from "@/lib/prisma";
import { dbPdfToUiPdf } from "@/lib/pdf-transform";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subject = searchParams.get("subject");
  const gsPaper = searchParams.get("gsPaper");
  const contentType = searchParams.get("contentType");
  const collection = searchParams.get("collection");
  const source = searchParams.get("source");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const where: Record<string, unknown> = {};
  if (subject) where.gsPaper = subject;
  if (gsPaper) where.gsPaper = gsPaper;
  if (contentType) where.contentType = contentType;
  if (collection) where.collection = collection;
  if (source) where.source = source;
  if (search) {
    where.OR = [
      { topic: { contains: search } },
      { filename: { contains: search } },
      { subject: { contains: search } },
      { source: { contains: search } },
    ];
  }

  const [pdfs, total] = await Promise.all([
    prisma.pdf.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { flashcards: true } } },
    }),
    prisma.pdf.count({ where }),
  ]);

  const data = pdfs.map((pdf: Record<string, unknown>) => dbPdfToUiPdf(pdf));

  return NextResponse.json({ data, total, page, limit });
}
