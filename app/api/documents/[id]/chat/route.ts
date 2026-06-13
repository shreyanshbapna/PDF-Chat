import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { splitText } from "@/lib/textsplitter";
import { CreateEmbeddings, createSingleTextEmbedding } from "@/lib/embedding";
import { generateContent } from "@/lib/llm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { message } = await request.json();

  const chatMessage = await prisma.chatMessage.create({
    data: {
      role: "user",
      message,
      documentId: id,
    },
  });

  // Generate embeddings for the message chunks
  const questionEmbedding = await createSingleTextEmbedding(message);

  // Fetch the most relevant chunks from the database based on the question embedding and the document ID
  const relevantChunks = await prisma.$queryRaw<{ content: string }[]>`
    SELECT "content" FROM "Chunk"
    WHERE "documentId" = ${id}
    ORDER BY "embedding" <=> ${questionEmbedding}::vector
    LIMIT 5
  `;

  // Generate a response using the relevant chunks as context
  const context = relevantChunks.map(
    (chunk: { content: string }) => chunk.content,
  );
  const response = await generateContent({ context, question: message });
  console.log("Generated response:", response);

  if (!response) {
    throw new Error("Failed to generate response");
  }

  await prisma.chatMessage.create({
    data: {
      role: "assistant",
      message: response,
      documentId: id,
    },
  });


  return NextResponse.json({ message: response });
}

// app/api/documents/[id]/route.ts — get all chat messages for a specific document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const messages = await prisma.chatMessage.findMany({
    where: { documentId: id },
    orderBy: { createdAt: "asc" },
  });
   console.log("Messages from DB:", messages);

  return NextResponse.json({ messages });
}
