import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
  });

  const withCounts = await Promise.all(
    collections.map(async (c: { id: string; name: string; description: string | null; createdAt: Date }) => ({
      ...c,
      pdfCount: await prisma.pdf.count({ where: { collection: c.name } }),
    }))
  );

  return NextResponse.json({ data: withCounts });
}
