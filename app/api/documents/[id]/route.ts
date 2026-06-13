// app/api/documents/[id]/route.ts
import { prisma } from "@/lib/prisma";

// app/api/documents/[id]/route.ts — get a specific document by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 
  const document = await prisma.document.findUnique({
    where: { id },
    select: { id: true, name: true, createdAt: true },
  });
  return Response.json({ document: document });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.chunk.deleteMany({ where: { documentId: id } });
  await prisma.chatMessage.deleteMany({ where: { documentId: id } });
  await prisma.document.delete({ where: { id } });
  return Response.json({ success: true });
}