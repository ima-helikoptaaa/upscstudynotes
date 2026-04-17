import { prisma } from "@/lib/prisma";
import { dbPdfToUiPdf } from "@/lib/pdf-transform";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const pdf = await prisma.pdf.findUnique({
    where: { id },
    include: { _count: { select: { flashcards: true } } },
  });

  if (!pdf) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  return NextResponse.json(dbPdfToUiPdf(pdf as unknown as Record<string, unknown>));
}
