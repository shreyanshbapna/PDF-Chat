import { CreateEmbeddings } from "@/lib/embedding";
import { extractTextFromPDF } from "@/lib/extractText";
import { splitText } from "@/lib/textsplitter";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  // Step 1: Extract text from the PDF file
  const content = await extractTextFromPDF(formData);

  // Step 2: Store the document in the database
  const document = await prisma.document.create({
    data: {
      name: file.name,
      content,
    },
  });

  // Step 3: Split the text into chunks and generate embeddings for each chunk
  const chunks = await splitText(content);

  // Step 4: Create embeddings for each chunk
  const documentVectors = await CreateEmbeddings(chunks);

  // Step 5: Store the chunks and their embeddings in the database
  await Promise.all(
    documentVectors.map(async (vector) => {
      const id = crypto.randomUUID();
      await prisma.$executeRaw`
        INSERT INTO "Chunk" ("id", "content", "embedding", "documentId")
        VALUES (
            ${id},
            ${vector.text},
            ${vector.embedding}::vector,
            ${document.id}
        )`;
    }),
  );

  return NextResponse.json({
    documentId: document.id,
    message: "File uploaded successfully",
  });
}
