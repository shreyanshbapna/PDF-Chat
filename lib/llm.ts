import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateContent = async ({
  context,
  question,
}: {
  context: string[];
  question: string;
}) => {

  const apiResponse = await client.chat.completions.create({
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free', // follows instructions properly
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that answers questions about a document.
                Use the context below to answer the question.
                If the answer is in the context, answer it. Be conversational and helpful.
                If it's truly not in the context, say "I don't have that information in the document."
                Context:
                ${context.join("\n\n")}`,
      },
      {
        role: "user",
        content: question,
      },
    ], 
  }
);  

  return apiResponse.choices[0].message.content;
};
