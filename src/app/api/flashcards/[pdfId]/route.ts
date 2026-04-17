import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pdfId: string }> }
) {
  const { pdfId } = await params;
  const difficulty = request.nextUrl.searchParams.get("difficulty");

  const where: Record<string, unknown> = { pdfId };
  if (difficulty) where.difficulty = difficulty;

  const flashcards = await prisma.flashcard.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    data: flashcards.map((f) => ({ ...f, tags: JSON.parse(f.tags) })),
  });
}
