import "dotenv/config";
import pg from "pg";
import { readFileSync } from "fs";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface PdfRow {
  id: string;
  path: string;
  source: string;
  subfolder: string | null;
  filename: string;
  gs_paper: string;
  subject: string;
  topic: string;
  content_type: string;
  collection: string | null;
  year: number | null;
  month: number | null;
  tags: string;
  s3_key: string | null;
  page_count: number | null;
  created_at: string;
}

interface FlashcardRow {
  id: string;
  pdf_id: string;
  source: string;
  gs_paper: string;
  subject: string;
  topic: string;
  content_type: string;
  difficulty: string;
  question: string;
  answer: string;
  tags: string;
  created_at: string;
}

const BATCH = 100;

async function main() {
  const pdfs: PdfRow[] = JSON.parse(readFileSync("/tmp/pdfs_export.json", "utf8"));
  const flashcards: FlashcardRow[] = JSON.parse(readFileSync("/tmp/flashcards_export.json", "utf8"));

  console.log(`Migrating ${pdfs.length} PDFs and ${flashcards.length} flashcards (batched)...`);

  // PDFs — batch insert with ON CONFLICT DO NOTHING
  for (let i = 0; i < pdfs.length; i += BATCH) {
    const batch = pdfs.slice(i, i + BATCH);
    const values: unknown[] = [];
    const placeholders = batch.map((p, idx) => {
      const off = idx * 16;
      values.push(
        p.id, p.path, p.source, p.subfolder, p.filename,
        p.gs_paper, p.subject, p.topic, p.content_type, p.collection,
        p.year, p.month, p.tags || "[]", p.s3_key, p.page_count,
        p.created_at
      );
      return `(${Array.from({ length: 16 }, (_, j) => `$${off + j + 1}`).join(",")})`;
    });

    await pool.query(
      `INSERT INTO pdfs (id, path, source, subfolder, filename, gs_paper, subject, topic, content_type, collection, year, month, tags, s3_key, page_count, created_at)
       VALUES ${placeholders.join(",")}
       ON CONFLICT (id) DO NOTHING`,
      values
    );
    console.log(`  PDFs: ${Math.min(i + BATCH, pdfs.length)}/${pdfs.length}`);
  }

  // Flashcards — batch insert with ON CONFLICT DO NOTHING
  for (let i = 0; i < flashcards.length; i += BATCH) {
    const batch = flashcards.slice(i, i + BATCH);
    const values: unknown[] = [];
    const placeholders = batch.map((f, idx) => {
      const off = idx * 12;
      values.push(
        f.id, f.pdf_id, f.source, f.gs_paper, f.subject, f.topic,
        f.content_type, f.difficulty, f.question, f.answer,
        f.tags || "[]", f.created_at
      );
      return `(${Array.from({ length: 12 }, (_, j) => `$${off + j + 1}`).join(",")})`;
    });

    await pool.query(
      `INSERT INTO flashcards (id, pdf_id, source, gs_paper, subject, topic, content_type, difficulty, question, answer, tags, created_at)
       VALUES ${placeholders.join(",")}
       ON CONFLICT (id) DO NOTHING`,
      values
    );
    console.log(`  Flashcards: ${Math.min(i + BATCH, flashcards.length)}/${flashcards.length}`);
  }

  console.log("Done!");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
