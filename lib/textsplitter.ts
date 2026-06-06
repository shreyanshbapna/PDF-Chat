import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitText(text: string): Promise<string[]> {
    const splitter = new RecursiveCharacterTextSplitter({ 
        chunkSize: 100, 
        chunkOverlap: 0 
    })
    const texts: string[] = await splitter.splitText(text);
    return texts;
}

