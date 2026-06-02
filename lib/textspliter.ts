import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
export const splitter = new RecursiveCharacterTextSplitter({ 
    chunkSize: 100, 
    chunkOverlap: 0 
})
