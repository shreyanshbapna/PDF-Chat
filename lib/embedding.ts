
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});


export const CreateEmbeddings = async (chunks: string[]) => {
  const vectors = await Promise.all(
        chunks.map(async (chunk) => {
            const response = await client.embeddings.create({
                model: 'text-embedding-3-small',
                input: chunk,
                encoding_format: "float",
            });

            const embedding: string = `[${response.data[0].embedding.join(",")}]`;

            return {
                embedding: embedding,
                text: chunk,
            };
        }),
  );
  return vectors;
};


export const createSingleTextEmbedding = async (text: string): Promise<string> => {
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: "float",
  });
  return `[${response.data[0].embedding.join(",")}]`;
};
