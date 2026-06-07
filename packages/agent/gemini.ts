import { GoogleGenerativeAI } from "@google/generative-ai";
  
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY );
const model = genAI.getGenerativeModel({model:"gemini-2.5-flash"});
  
export async function askGemini(prompt: string){
    try {
      const result = await model.generateContent(prompt);
  
      return result
        .response
        .text();
    } catch (error) {
      console.error("GEMINI ERROR:",error);
      return `Sorry, I'm having trouble accessing conversational intelligence right now.`;
    }
}