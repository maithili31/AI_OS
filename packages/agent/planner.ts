// import { describeTools } from "../tools/tool-describer.ts";
// import { getRecentMemories } from "../memory/memory.service.ts";
// import { searchMemories } from "../memory/vector-memory.service.ts";

// export async function planTask(
//     command: string
//   ) {
  
//     const toolsDescription = describeTools();
//     const memories = await searchMemories(
//       command,
//       5
//     );

//     const memoryContext = memories.map(
//       (memory: any) =>
//         `
//         PREVIOUS EXECUTION:

//         ${memory.content}

//         IMPORTANT:
//         Reuse the SAME workflow structure
//         if the user refers to a previous task.
//         `
//     ).join("\n\n");

//     const prompt = `
//         You are an autonomous AI desktop assistant.

//         Your job is to:
//         - understand the user request
//         - break it into executable steps
//         - choose the best tools
//         - generate executable JSON

//         AVAILABLE TOOLS:

//         ${toolsDescription}

//         RULES:
//         - Return ONLY valid JSON
//         - Always return a "steps" array
//         - Each step must contain:
//         - intent
//         - required parameters
//         - intent MUST exactly match tool name
//         - If the user refers to a previous task, reuse the previous execution plan instead of inventing new parameters.

//         EXAMPLE:

//         {
//         "steps": [
//             {
//             "intent": "filesystem",
//             "operation": "create_folder",
//             "path": "Desktop/projects"
//             },
//             {
//             "intent": "send_email",
//             "recipient": "test@gmail.com",
//             "subject": "Folder Created",
//             "body": "The folder has been created."
//             }
//         ]
//         }
//         RECENT MEMORIES: ${memoryContext}
//         USER REQUEST: ${command}
//       `;

//     const response =
//       await fetch(
//         "http://localhost:11434/api/generate",
//         {
  
//           method: "POST",
  
//           headers: {
//             "Content-Type":
//               "application/json"
//           },
  
//           body: JSON.stringify({
  
//             model: "llama3:8b",
  
//             prompt,
  
//             stream: false
//           })
//         }
//       );
  
//     const data =
//       await response.json();
  
//     console.log(
//       "RAW MODEL OUTPUT:",
//       data.response
//     );
  
//     console.log(
//         "RAW MODEL OUTPUT:",
//         data.response
//       );
      
//       const jsonMatch =
//         data.response.match(
//           /\{[\s\S]*\}/
//         );
      
//       if (!jsonMatch) {
      
//         throw new Error(
//           "No JSON found in model output"
//         );
//       }
      
//       const cleanedJson =
//         jsonMatch[0];
      
//       console.log(
//         "EXTRACTED JSON:",
//         cleanedJson
//       );
      
//       return JSON.parse(
//         cleanedJson
//       );
//   }

// import { describeTools }
// from "../tools/tool-describer.ts";

// import {
//   searchMemories
// }
// from "../memory/vector-memory.service.ts";

// export async function planTask(
//   command: string
// ) {

//   const toolsDescription =
//     describeTools();

//   const memories =
//     await searchMemories(
//       command,
//       5
//     );

//   const memoryContext =

//     memories

//       .map(

//         (memory: any) =>

//           `
// MEMORY:

// ${memory.content}

// IMPORTANT:
// - Reuse the SAME workflow structure
// - Do NOT invent unrelated parameters
// - Preserve previous paths/emails if relevant
// `
//       )

//       .join("\n\n");

//   const prompt = `

// You are an autonomous AI desktop assistant.

// Your job is to:
// - understand the user request
// - break it into executable steps
// - choose the correct tools
// - generate executable JSON

// AVAILABLE TOOLS:

// ${toolsDescription}

// RULES:
// - Return ONLY raw JSON
// - DO NOT explain anything
// - DO NOT use markdown
// - DO NOT use code fences
// - DO NOT include comments
// - DO NOT include XML tags
// - Always return a "steps" array
// - Each step must contain:
//   - intent
//   - required parameters
// - intent MUST exactly match tool name
// - If the user refers to a previous task,
//   reuse the previous execution structure.

// VALID EXAMPLE:

// {
//   "steps": [
//     {
//       "intent": "filesystem",
//       "operation": "create_folder",
//       "path": "Desktop/projects"
//     },
//     {
//       "intent": "send_email",
//       "recipient": "test@gmail.com",
//       "subject": "Folder Created",
//       "body": "The folder has been created."
//     }
//   ]
// }

// RECENT MEMORIES:

// ${memoryContext}

// USER REQUEST:

// ${command}
// `;

//   console.log(
//     "SENDING REQUEST TO OLLAMA..."
//   );

//   const controller =
//     new AbortController();

//   setTimeout(
//     () => controller.abort(),
//     30000
//   );

//   const response =
//     await fetch(
//       "http://localhost:11434/api/generate",
//       {

//         method: "POST",

//         headers: {
//           "Content-Type":
//             "application/json"
//         },

//         body: JSON.stringify({

//           model:
//             "llama3:8b",

//           prompt,

//           stream: false,

//           options: {

//             temperature: 0.2
//           }
//         }),

//         signal:
//           controller.signal
//       }
//     );

//   console.log(
//     "OLLAMA RESPONSE RECEIVED"
//   );

//   const data =
//     await response.json();

//   console.log(
//     "RAW MODEL OUTPUT:",
//     data.response
//   );

//   const cleanedOutput =

//     data.response

//       .replace(
//         /```json/g,
//         ""
//       )

//       .replace(
//         /```/g,
//         ""
//       )

//       .trim();

//   const jsonMatch =

//     cleanedOutput.match(
//       /\{[\s\S]*\}/
//     );

//   if (!jsonMatch) {

//     throw new Error(
//       "No valid JSON found in model output"
//     );
//   }

//   const cleanedJson =
//     jsonMatch[0];

//   console.log(
//     "EXTRACTED JSON:",
//     cleanedJson
//   );

//   try {

//     return JSON.parse(
//       cleanedJson
//     );

//   } catch (error) {

//     console.error(
//       "JSON PARSE FAILED"
//     );

//     console.error(
//       cleanedJson
//     );

//     throw error;
//   }
// }
import { describeTools }
from "../tools/tool-describer.ts";

import {
  searchMemories
}
from "../memory/vector-memory.service.ts";

/*
=========================================
EMAIL GENERATION
=========================================
*/

async function generateEmail(

  command: string,

  recipient: string
) {

  const prompt = `

Generate a professional email.

User request:
${command}

Recipient:
${recipient}

Return ONLY valid JSON.

Example:

{
  "subject": "Trip to South Korea",
  "body": "Hi, I wanted to let you know..."
}
`;

  const controller =
    new AbortController();

  setTimeout(
    () => controller.abort(),
    50000
  );

  const response =
    await fetch(
      "http://localhost:11434/api/generate",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          model:
            "llama3:8b",

          prompt,

          stream: false,

          options: {

            temperature: 0.4
          }
        }),

        signal:
          controller.signal
      }
    );

  const data =
    await response.json();

  console.log(
    "EMAIL MODEL OUTPUT:",
    data.response
  );

  const cleanedOutput =

    data.response

      .replace(
        /```json/g,
        ""
      )

      .replace(
        /```/g,
        ""
      )

      .trim();

  const match =

    cleanedOutput.match(
      /\{[\s\S]*\}/
    );

  if (!match) {

    return {

      subject:
        "Message from AI-OS",

      body:
        command
    };
  }

  try {

    return JSON.parse(
      match[0]
    );

  } catch {

    return {

      subject:
        "Message from AI-OS",

      body:
        command
    };
  }
}

/*
=========================================
MAIN PLANNER
=========================================
*/

export async function planTask(
  command: string
) {

  const lowerCommand =
    command.toLowerCase();

  /*
  =========================================
  FAST PATH:
  OPEN APP
  =========================================
  */

  if (
    lowerCommand.startsWith(
      "open "
    )
  ) {

    const appName =

      lowerCommand

        .replace(
          "open ",
          ""
        )

        .trim();

    return {

      steps: [

        {
          intent:
            "open_app",

          app:
            appName
        }
      ]
    };
  }

  /*
  =========================================
  FAST PATH:
  EMAIL
  =========================================
  */

  if (

    lowerCommand.includes(
      "mail"
    ) ||
  
    lowerCommand.includes(
      "email"
    )
  ) {
  
    const emails =
  
      command.match(
  
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g
  
      ) || [];
  
    if (
      emails.length > 0
    ) {
  
      console.log(
        "GENERATING EMAIL CONTENT..."
      );
  
      const generatedEmail =
  
        await generateEmail(
          command,
          emails[0]
        );
  
      const steps =
  
        emails.map(
  
          email => ({
  
            intent:
              "send_email",
  
            recipient:
              email,
  
            subject:
              generatedEmail.subject,
  
            body:
              generatedEmail.body
          })
        );
  
      return { steps };
    }
  }

  /*
  =========================================
  MEMORY RETRIEVAL
  =========================================
  */

  const memories =
    await searchMemories(
      command,
      2
    );

  const memoryContext =

    memories

      .map(

        (memory: any) =>

          memory.content
      )

      .join("\n");

  /*
  =========================================
  TOOL DESCRIPTION
  =========================================
  */

  const toolsDescription =
    describeTools();

  /*
  =========================================
  PROMPT
  =========================================
  */

  const prompt = `

You are an AI desktop assistant.

Available tools:

${toolsDescription}

Recent memories:

${memoryContext}

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations
- Use exact tool names
- Always return:

{
  "steps": [...]
}

Example:

{
  "steps": [
    {
      "intent": "filesystem",
      "operation": "create_folder",
      "path": "Desktop/projects"
    }
  ]
}

User request:

${command}
`;

  console.log(
    "SENDING REQUEST TO OLLAMA..."
  );

  /*
  =========================================
  TIMEOUT
  =========================================
  */

  const controller =
    new AbortController();

  setTimeout(
    () => controller.abort(),
    25000
  );

  /*
  =========================================
  OLLAMA REQUEST
  =========================================
  */

  const response =
    await fetch(
      "http://localhost:11434/api/generate",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          model:
            "llama3:8b",

          prompt,

          stream: false,

          options: {

            temperature: 0.2
          }
        }),

        signal:
          controller.signal
      }
    );

  console.log(
    "OLLAMA RESPONSE RECEIVED"
  );

  /*
  =========================================
  RESPONSE
  =========================================
  */

  const data =
    await response.json();

  console.log(
    "RAW MODEL OUTPUT:",
    data.response
  );

  /*
  =========================================
  CLEAN OUTPUT
  =========================================
  */

  const cleanedOutput =

    data.response

      .replace(
        /```json/g,
        ""
      )

      .replace(
        /```/g,
        ""
      )

      .trim();

  /*
  =========================================
  EXTRACT JSON
  =========================================
  */

  const jsonMatch =

    cleanedOutput.match(
      /\{[\s\S]*\}/
    );

  if (!jsonMatch) {

    throw new Error(
      "No valid JSON found in model output"
    );
  }

  const cleanedJson =
    jsonMatch[0];

  console.log(
    "EXTRACTED JSON:",
    cleanedJson
  );

  /*
  =========================================
  PARSE JSON
  =========================================
  */

  try {

    return JSON.parse(
      cleanedJson
    );

  } catch (error) {

    console.error(
      "JSON PARSE FAILED"
    );

    console.error(
      cleanedJson
    );

    throw error;
  }
}