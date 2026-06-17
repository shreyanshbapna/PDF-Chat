# PDF Chat — RAG-powered Document Q&A

A full-stack application that lets you upload PDF documents and chat with them using AI. Built with Next.js, PostgreSQL + pgvector, and OpenRouter.

---

## How It Works

```
PDF Upload → Text Extraction → Chunking → Embeddings → PostgreSQL (pgvector)
                                                              ↓
User Question → Embed Question → Cosine Similarity Search → Relevant Chunks → LLM → Answer
```

1. **Upload** — PDF is uploaded and text is extracted
2. **Chunk** — Text is split into overlapping chunks (800 chars, 100 overlap)
3. **Embed** — Each chunk is embedded using `text-embedding-3-small` via OpenRouter
4. **Store** — Embeddings stored as vectors in PostgreSQL using pgvector
5. **Query** — User question is embedded and compared against stored vectors
6. **Generate** — Top 5 most relevant chunks are passed to an LLM as context
7. **Answer** — LLM generates a grounded answer based only on the document

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| Vector Search | pgvector |
| ORM | Prisma |
| Embeddings | `text-embedding-3-small` via OpenRouter |
| LLM | `meta-llama/llama-3.3-70b-instruct` via OpenRouter |
| PDF Parsing | pdf-parse |
| Text Splitting | LangChain RecursiveCharacterTextSplitter |
| Styling | Tailwind CSS + shadcn/ui |
| HTTP Client | Axios |

---

## Project Structure

```
├── app/
│   ├── page.tsx                          # Dashboard
│   ├── documents/
│   │   └── [id]/
│   │       └── page.tsx                  # Chat page
│   └── api/
│       └── documents/
│           ├── route.ts                  # GET /api/documents
│           ├── upload/
│           │   └── route.ts              # POST /api/documents/upload
│           └── [id]/
│               ├── route.ts              # GET, DELETE /api/documents/:id
│               └── chat/
│                   └── route.ts          # GET, POST /api/documents/:id/chat
│
├── components/
│   ├── chat/
│   │   └── ChatZone.tsx                  # Chat UI with markdown rendering
│   ├── dashboard/
│   │   └── dashboard.tsx                 # Sidebar + main layout
│   ├── document/
│   │   ├── DocumentList.tsx              # Sidebar document list
│   │   └── UploadZone.tsx                # Drag & drop PDF upload
│   └── ui/                               # shadcn components
│
├── lib/
│   ├── prisma.ts                         # Prisma client
│   ├── embedding.ts                      # OpenRouter embedding calls
│   ├── llm.ts                            # OpenRouter LLM calls
│   ├── textsplitter.ts                   # LangChain text splitter
│   ├── extractText.ts                    # PDF text extraction
│   └── hooks/
│       ├── useChat.ts                    # Chat state + API calls
│       └── useDocuments.ts               # Document list + upload + delete
│
└── prisma/
    └── schema.prisma                     # Database schema
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database with pgvector extension (recommended: [Neon](https://neon.tech))
- OpenRouter API key ([openrouter.ai](https://openrouter.ai))

### 1. Clone the repository

```bash
https://github.com/shreyanshbapna/PDF-Chat.git
cd PDF-Chat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://..."
OPENROUTER_API_KEY="sk-or-..."
```

### 4. Set up the database

```bash
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

```prisma
model Document {
  id        String        @id @default(uuid())
  name      String
  content   String
  createdAt DateTime      @default(now())
  chunks    Chunk[]
  messages  ChatMessage[]
}

model Chunk {
  id         String                     @id @default(uuid())
  content    String
  embedding  Unsupported("vector(1536)")
  documentId String
  document   Document @relation(fields: [documentId], references: [id])
}

model ChatMessage {
  id         String   @id @default(uuid())
  message    String
  role       Role
  documentId String?
  createdAt  DateTime @default(now())
  document   Document? @relation(fields: [documentId], references: [id])
}

enum Role {
  user
  assistant
}
```

---

## API Reference

### Documents

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents` | List all documents |
| `POST` | `/api/documents/upload` | Upload a PDF |
| `GET` | `/api/documents/:id` | Get a document by ID |
| `DELETE` | `/api/documents/:id` | Delete a document and its chunks |

### Chat

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents/:id/chat` | Get chat history for a document |
| `POST` | `/api/documents/:id/chat` | Send a message and get AI response |

---

## Key Implementation Details

### Chunking Strategy
```typescript
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 100,
  separators: ["\n\n", "\n", ".", "!", "?", " ", ""],
});
```

### Vector Similarity Search
```sql
SELECT "content" FROM "Chunk"
WHERE "documentId" = $1
ORDER BY "embedding" <=> $2::vector  -- cosine similarity
LIMIT 5
```

### Embedding Model
- Model: `text-embedding-3-small` (OpenAI via OpenRouter)
- Dimensions: `1536`

### LLM
- Model: `nvidia/nemotron-3-ultra-550b-a55b:free` (via OpenRouter)
- Context: Top 5 most relevant chunks passed as system prompt

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENROUTER_API_KEY` | OpenRouter API key |

---

## License

MIT