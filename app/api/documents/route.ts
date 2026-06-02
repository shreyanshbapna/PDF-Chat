import { prisma } from "@/lib/prisma";

export async function GET(requrest: Request) {
    const response = await prisma.document.findMany(
        {
            orderBy: {
                createdAt: 'desc',
            },
        }
    );
    return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
    });
}