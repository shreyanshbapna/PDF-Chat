import { prisma } from "@/lib/prisma";

export async function Post(request: Request) {
    const {message, documentId} = await request.json();

    const response = await prisma.chatMessage.create({
        data: {
            message,
            documentId,
        },
    });

    

    if (!response.ok) {
        throw new Error('Failed to fetch response from the server');
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    }); 




}