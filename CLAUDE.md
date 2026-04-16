# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # production build
npm run type-check   # TypeScript check (tsc --noEmit)
```

## Project Overview

**UPSCStudyNotes** is a PDF-first learning platform for UPSC (Union Public Service Commission) exam aspirants. It transforms static PDFs into interactive learning experiences via an AI layer — users can select text in a PDF and trigger actions (Explain, Summarize, Q&A, Flashcards) or chat with the document.

This is a **hackathon project**. The full specification is in `upsc_studynotes_spec.txt`.

## Hackathon MVP Scope

**Build (real):**
- PDF upload with metadata and visibility controls (private/public)
- PDF viewer
- AI action buttons: Explain, Summarize, Q&A, Flashcards
- Save/bookmark AI-generated content

**Mock (fake/stub):**
- Large curated PDF repository
- Advanced OCR for scanned PDFs

## Architecture

### Stack
- **Storage**: AWS S3 (PDF files)
- **Database**: Firestore or PostgreSQL (metadata, saved content)
- **Vector DB**: Pinecone or FAISS (document chunk embeddings)
- **AI**: OpenAI or Claude API

### Data Models

```
Users:         id, name
PDFs:          id, title, subject, source, author, visibility, file_url
Chunks:        chunk_id, pdf_id, content, embedding, page_number
SavedContent:  id, user_id, type, content
```

Subject values: `GS1`, `GS2`, `GS3`, `GS4`, `Optional`, `CA`

### PDF Processing Pipeline

Upload → metadata → visibility → text extraction → OCR (if scanned) → chunking (300–800 tokens) → embedding generation → stored in vector DB

### AI Context Strategy

- If user has text selected in the PDF viewer → use that as context
- Otherwise → vector search over chunks to retrieve relevant content
- Keep context size limited to avoid latency and hallucination

### API Endpoints

```
POST /upload-pdf
GET  /pdfs
GET  /pdf/:id
POST /ai/explain
POST /ai/summarize
POST /ai/generate-qa
POST /ai/flashcards
POST /search
POST /save
GET  /saved
```

## Key Design Decisions

- Chunking strategy: 300–800 tokens per chunk, stored with `page_number` for reference
- OCR: detect scanned PDFs at upload time; process asynchronously
- AI responses should be cached where possible
- Private PDFs are strictly owner-only; public PDFs are visible to all users
