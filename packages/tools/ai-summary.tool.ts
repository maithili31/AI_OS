import "dotenv/config";
import OpenAI from "openai";
import { Tool } from "./index.ts";
import { RetryableError, RateLimitError, PermanentError } from "../shared/errors";

const openai = 
  new OpenAI({
    apiKey:
      process.env.OPENAI_API_KEY
  });

export class AISummaryTool implements Tool {
    name = "summarize_email";
    description = "Summarize recruiter emails";
    async execute(input: any) {
        try {     
          const completion =
            await openai.chat.completions.create({
              model: "gpt-4.1-mini",
              messages: [
                {
                  role: "system",
                  content:`Summarize this email briefly.`
                },
                {
                  role: "user",
                  content:
                    `
                    FROM:
                    ${input.from}
                    
                    SUBJECT:
                    ${input.subject}
                    
                    BODY:
                    ${input.body}
                    `
                }
              ]
            });
      
          const summary = completion.choices[0].message.content;
          console.log("\nAI SUMMARY:");
          console.log(summary);
          return {
            success: true,
            summary
          };
        } catch (error: any) {
            console.error("AI TOOL ERROR:", error);
            if (error?.status === 429) {
              throw new RateLimitError();
            }
            if (error?.status >= 500) {
              throw new RetryableError(
                "OpenAI temporary failure",
                "OPENAI_SERVER_ERROR"
              );
            }
            throw new PermanentError(
              "AI summarization failed",
              "OPENAI_FAILURE"
            );
          }
    }
}