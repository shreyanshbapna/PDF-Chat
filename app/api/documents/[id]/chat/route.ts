import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { splitText } from "@/lib/textsplitter";
import { CreateEmbeddings } from "@/lib/embedding";

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

  // Split the message into chunks for embedding generation
  const messageChunck: string[] = await splitText(message);

  // Generate embeddings for the message chunks
  const embeddings = await CreateEmbeddings(messageChunck);

  // Store the chunks and their embeddings in the database
  await Promise.all(
    embeddings.map(async (embedding) => {
    
      const chunkId = crypto.randomUUID();
       
        await prisma.$executeRaw`
            INSERT INTO "Chunk" ("id", "content", "embedding", "documentId")
            VALUES (${chunkId}, ${embedding.text}, ${embedding.embedding}::vector, ${id})
        `;
    }),
  );


  return NextResponse.json({ id, message });
}
