import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbPdfToUiPdf } from "@/lib/pdf-transform";
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_COLLECTION = "upscnotes-search";
const EMBEDDING_MODEL = "text-embedding-3-large";
const EMBEDDING_DIMENSIONS = 3072;

function getClients() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
  });
  return { openai, qdrant };
}

export async function POST(request: NextRequest) {
  const { query, limit = 20 } = await request.json();

  if (!query || typeof query !== "string" || query.trim().length < 2) {
    return NextResponse.json({ error: "Query required (min 2 chars)" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY || !process.env.QDRANT_URL) {
    return NextResponse.json({ error: "RAG search not configured" }, { status: 503 });
  }

  const { openai, qdrant } = getClients();

  const embeddingResponse = await openai.embeddings.create({
    input: query.trim(),
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  const queryVector = embeddingResponse.data[0].embedding;

  const searchResults = await qdrant.query(QDRANT_COLLECTION, {
    query: queryVector,
    limit: limit * 3,
    with_payload: true,
  });

  const pdfIdScores = new Map<string, { score: number; snippets: string[] }>();

  for (const point of searchResults.points) {
    const payload = point.payload as Record<string, unknown>;
    const pdfId = payload.pdf_id as string;
    const score = point.score ?? 0;
    const text = (payload.text as string) ?? "";

    const existing = pdfIdScores.get(pdfId);
    if (existing) {
      if (score > existing.score) existing.score = score;
      if (existing.snippets.length < 2) existing.snippets.push(text.slice(0, 200));
    } else {
      pdfIdScores.set(pdfId, { score, snippets: [text.slice(0, 200)] });
    }
  }

  const sortedPdfIds = [...pdfIdScores.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit)
    .map(([id]) => id);

  if (sortedPdfIds.length === 0) {
    return NextResponse.json({ data: [], total: 0, snippets: {} });
  }

  const pdfs = await prisma.pdf.findMany({
    where: { id: { in: sortedPdfIds } },
    include: { _count: { select: { flashcards: true } } },
  });

  const pdfMap = new Map(pdfs.map((p: Record<string, unknown>) => [p.id as string, p]));
  const ordered = sortedPdfIds
    .map((id: string) => pdfMap.get(id))
    .filter(Boolean)
    .map((pdf) => dbPdfToUiPdf(pdf as Record<string, unknown>));

  const snippets: Record<string, string[]> = {};
  for (const [id, data] of pdfIdScores) {
    if (sortedPdfIds.includes(id)) {
      snippets[id] = data.snippets;
    }
  }

  return NextResponse.json({ data: ordered, total: ordered.length, snippets });
}
