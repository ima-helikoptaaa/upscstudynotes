import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pdfId } = await request.json();
  if (!pdfId) {
    return NextResponse.json({ error: "pdfId required" }, { status: 400 });
  }

  const existing = await prisma.savedItem.findUnique({
    where: { userId_pdfId: { userId: user.id, pdfId } },
  });

  if (existing) {
    await prisma.savedItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedItem.create({ data: { userId: user.id, pdfId } });
  return NextResponse.json({ saved: true });
}
