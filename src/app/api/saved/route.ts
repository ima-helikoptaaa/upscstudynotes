import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const saved = await prisma.savedItem.findMany({
    where: { userId: user.id },
    include: {
      pdf: {
        include: { _count: { select: { flashcards: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    data: saved.map((s: { pdf: Record<string, unknown> & { tags: string; _count: { flashcards: number } }; createdAt: Date }) => ({
      ...s.pdf,
      tags: JSON.parse(s.pdf.tags),
      flashcardCount: s.pdf._count.flashcards,
      savedAt: s.createdAt,
    })),
  });
}
