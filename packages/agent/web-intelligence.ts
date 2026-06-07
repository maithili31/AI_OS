import {askGemini} from "./gemini";

export async function webIntelligence(query: string){
  const prompt = `
    You are a conversational AI assistant.
    Answer naturally using web knowledge.
    User query:
    ${query}
    IMPORTANT:
    - Speak conversationally
    - Keep answers concise
    - Give useful recommendations
    - Compare products if relevant
    - Mention pricing if relevant
    `;

  return await askGemini(prompt);
}