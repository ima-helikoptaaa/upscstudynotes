import { buildCloudFrontUrl } from "./cloudfront";

export function dbPdfToUiPdf(pdf: Record<string, unknown>) {
  const tags: string[] = typeof pdf.tags === "string" ? JSON.parse(pdf.tags as string) : (pdf.tags as string[]) ?? [];
  const path = pdf.path as string;
  const filename = pdf.filename as string;

  return {
    id: pdf.id as string,
    title: (pdf.topic as string) || filename.replace(/\.pdf$/i, ""),
    subject: pdf.gsPaper as string,
    source: pdf.source as string,
    author: pdf.source as string,
    tags,
    summary: "",
    visibility: "public" as const,
    file_url: buildCloudFrontUrl(path),
    pages: (pdf.pageCount as number) ?? 0,
    year: (pdf.year as number) ?? 2024,
    type: pdf.contentType as string,
    downloads: 0,
    saves: 0,
    // extra fields for backend use
    gsPaper: pdf.gsPaper as string,
    contentType: pdf.contentType as string,
    collection: pdf.collection as string | null,
    flashcardCount: (pdf as Record<string, unknown>)._count
      ? ((pdf as Record<string, unknown>)._count as Record<string, number>).flashcards
      : ((pdf as Record<string, unknown>).flashcardCount as number) ?? 0,
  };
}
