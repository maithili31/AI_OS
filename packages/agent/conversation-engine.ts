import {askGemini} from "./gemini";

export interface ConversationResult {
  intent: string;
  entities:Record<string, any>;
  missing_fields:string[];
  next_question:string | null;
}

const instantResponseIntents = [
  "joke_request",
  "greeting",
  "small_talk",
  "fun_fact",
  "motivation"
];

export async function analyzeConversation(
  userMessage: string,
  currentMemory?:Record<string, any>
): Promise<ConversationResult> {
  const systemPrompt = `
You are an AI conversation analysis engine.
Your job is to:
1. Detect user intent
2. Extract entities
3. Detect missing information
4. Generate next follow-up question
IMPORTANT RULES:
- Always return VALID JSON
- Never explain anything outside JSON
- Never use markdown
- Never use code blocks
- Never generate automation steps
- Never behave like a planner

Response schema:

{
  "intent": "string",
  "entities": {},
  "missing_fields": ["string"],
  "next_question": "string or null"
}

EXAMPLES:

User:
"I want to buy an AC"

Response:
{
  "intent": "buy_product",
  "entities": {
    "product": "AC"
  },
  "missing_fields": [
    "budget",
    "specifications"
  ],
  "next_question":
    "What specifications are you looking for?"
}

User:
"I want to purchase a UPSC course"

Response:
{
  "intent": "buy_course",
  "entities": {
    "course": "UPSC"
  },
  "missing_fields": [
    "budget",
    "language",
    "platform"
  ],
  "next_question":
    "What language do you prefer?"
}

User:
"Tell me a joke"

Response:
{
  "intent": "joke_request",
  "entities": {},
  "missing_fields": [],
  "next_question": null
}

CURRENT MEMORY:${JSON.stringify(currentMemory || {},null,2)}
USER MESSAGE:${userMessage}
`;

  try {
    const rawOutput = await askGemini(systemPrompt);
    console.log("RAW GEMINI OUTPUT:",rawOutput);
    const cleanedOutput = rawOutput
        .replace(
          /```json/gi,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    const parsed = JSON.parse(cleanedOutput);

    if (instantResponseIntents.includes(parsed.intent)){
      parsed.missing_fields = [];
      parsed.next_question = null;
    }

    return {
      intent: parsed.intent || "unknown",
      entities: parsed.entities && typeof parsed.entities === "object" ? parsed.entities : {},
      missing_fields: Array.isArray(parsed.missing_fields) ? parsed.missing_fields : [],
      next_question: parsed.next_question || null
    };

  } catch (error) {
    console.error("Failed to analyze conversation:",error);
    return {
      intent:"unknown",
      entities:{},
      missing_fields:[],
      next_question:"Sorry, I didn't understand that clearly. Could you rephrase?"
    };
  }
}