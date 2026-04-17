import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { query, limit = 20 } = await request.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const pdfs = await prisma.pdf.findMany({
    where: {
      OR: [
        { topic: { contains: query } },
        { filename: { contains: query } },
        { subject: { contains: query } },
        { source: { contains: query } },
        { tags: { contains: query } },
      ],
    },
    take: limit,
    include: { _count: { select: { flashcards: true } } },
  });

  return NextResponse.json({
    data: pdfs.map((pdf) => ({
      ...pdf,
      tags: JSON.parse(pdf.tags),
      flashcardCount: pdf._count.flashcards,
    })),
  });
}
