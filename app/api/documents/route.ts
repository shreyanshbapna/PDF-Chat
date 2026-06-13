import { prisma } from "@/lib/prisma";


// app/api/documents/route.ts — list all documents
export async function GET() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });
   return Response.json({ documents });

}