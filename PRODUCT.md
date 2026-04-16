# UPSCStudyNotes — Product Spec

## 1. Overview

UPSCStudyNotes is a PDF-first learning platform designed for UPSC aspirants. It provides a centralized repository of study materials and adds an AI layer that allows users to interact with PDFs directly.

The core idea is to convert static PDFs into interactive learning experiences. Instead of passively reading, users can select content or query the document and generate structured outputs like explanations, summaries, Q&A, and flashcards.

The system supports both text-based PDFs and scanned/image-based PDFs using OCR.

---

## 2. Core Components

### 2.1 PDF Repository

- Central repository of curated PDFs (NCERTs, coaching notes, PYQs, etc.)
- Each PDF has metadata:
  - `subject` — GS1, GS2, GS3, GS4, Optional, CA
  - `source` — NCERT, coaching, etc.
  - `author` / uploader
  - `tags`

### 2.2 User PDFs

- Users can upload their own PDFs
- Visibility options:
  - **Private** — accessible only to the uploader
  - **Public** — visible to all users

### 2.3 PDF Upload Pipeline

1. Upload PDF
2. Add metadata
3. Choose visibility
4. System processes:
   - Text extraction (if available)
   - OCR (if scanned)
   - Chunking
   - Embedding generation

### 2.4 OCR Processing

- Detect if PDF is scanned
- Run OCR via Tesseract / AWS Textract / Google Vision
- Output structured text

### 2.5 Document Indexing

- Split into chunks of **300–800 tokens**
- Each chunk stores:
  - `chunk_id`
  - `pdf_id`
  - `content`
  - `page_number`
- Embeddings stored in vector DB

---

## 3. AI Interaction

### 3.1 Entry Points

- Chat interface
- Action buttons: **Explain**, **Summarize**, **Q&A**, **Flashcards**

### 3.2 Context Handling

- If text is selected → use selected text as context
- Otherwise → retrieve relevant chunks via vector search

### 3.3 AI Actions

| Action | Output |
|--------|--------|
| **Explain** | Simplified explanation of the content |
| **Summarize** | Structured bullet points |
| **Q&A** | UPSC-style questions with answers |
| **Flashcards** | Front / back format cards |

---

## 4. User Flows

### 4.1 Primary Flow

```
Open PDF → Select text or trigger action → Get AI output → Save output
```

### 4.2 Upload Flow

```
Upload → Add metadata → Set visibility → Processing → Available in library
```

---

## 5. Data Models

```
Users
  id, name

PDFs
  id, title, subject, source, author, visibility, file_url

Chunks
  chunk_id, pdf_id, content, embedding, page_number

SavedContent
  id, user_id, type, content
```

---

## 6. Backend Architecture

| Layer | Options |
|-------|---------|
| File Storage | AWS S3 |
| Database | Firestore / PostgreSQL |
| Vector DB | Pinecone / FAISS |
| AI | OpenAI / Claude |

---

## 7. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload-pdf` | Upload a PDF with metadata |
| `GET` | `/pdfs` | List available PDFs |
| `GET` | `/pdf/:id` | Get a specific PDF |
| `POST` | `/ai/explain` | Generate explanation |
| `POST` | `/ai/summarize` | Generate summary |
| `POST` | `/ai/generate-qa` | Generate Q&A |
| `POST` | `/ai/flashcards` | Generate flashcards |
| `POST` | `/search` | Semantic search over chunks |
| `POST` | `/save` | Save AI-generated content |
| `GET` | `/saved` | Retrieve saved content |

---

## 8. Performance

- Async OCR processing (non-blocking upload)
- Precomputed embeddings at upload time
- Cache AI responses where possible
- Limit context window size for latency control

---

## 9. Edge Cases

- Poor OCR quality on low-resolution scans
- Large PDFs (processing time, memory)
- Mixed content (text + images in same PDF)
- Hallucination control via context limiting

---

## 10. Security

- Private PDFs are strictly restricted to the owner
- Public PDFs are accessible to all authenticated users

---

## 11. Hackathon Scope

### Build (real)
- PDF upload
- PDF viewer
- AI actions (Explain, Summarize, Q&A, Flashcards)
- Save/bookmark content

### Mock (stub)
- Large curated PDF repository
- Advanced OCR for scanned PDFs

---

## 12. Future Enhancements

- Chrome extension for web-based content capture
- Spaced repetition system
- Collaborative features
