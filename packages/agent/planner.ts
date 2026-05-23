import { describeTools } from "../tools/tool-describer.ts";

async function generateEmail(
  command: string,
  recipient: string
){
  const prompt = `

Generate a professional email.

User request:
${command}

Recipient:
${recipient}

Return ONLY valid JSON.

Example:

{
  "subject": "Trip Update",
  "body": "Hi, I wanted to let you know..."
}
`;

  const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          model: "llama3:8b",
          prompt,
          stream: false,
          options: {
            temperature: 0,
            num_predict: 200
          }
        })
      }
    );

  const data = await response.json();
  const cleanedOutput = data.response
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim();

  const match = cleanedOutput.match(/\{[\s\S]*\}/);
  if(!match){
    return {
      subject:"Message from AI-OS",
      body:command
    };
  }
  try{
    return JSON.parse(match[0]);
  } catch {
    return {
      subject:"Message from AI-OS",
      body:command
    };
  }
}

export async function planTask(command: string){
  const lowerCommand = command.toLowerCase();

  // simple open app only
  if (lowerCommand.startsWith("open ")&& !lowerCommand.includes(" and ")){
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
          intent:"open_app",
          app:appName
        }
      ]
    };
  }
  // fast path - typing of text
  if (lowerCommand.startsWith("type ")){
    const text =command
        .replace(
          /type/i,
          ""
        )
        .trim();
    return {
      steps: [
        {
          intent:"type_text",
          text
        }
      ]
    };
  }
  // fast path - keyboard control ( press keys )
  if (lowerCommand.startsWith("press ")){
    const keyString =lowerCommand
        .replace(
          "press ",
          ""
        )
        .trim();
    return {
      steps: [
        {
          intent:"press_keys",
          keys:keyString
        }
      ]
    };
  }

  // fast path - screenshot
  if (lowerCommand.includes("screenshot") || lowerCommand.includes("capture screen")){
    return {
      steps: [
        {
          intent:"take_screenshot"
        }
      ]
    };
  }

  // fast path - mouse click
  if (lowerCommand === "click"){
    return {
      steps: [
        {
          intent:"mouse_click",
          x: 500,
          y: 500
        }
      ]
    };
  }

  // fast path - email
  if (lowerCommand.includes("mail") || lowerCommand.includes("email")){
    const emails = command.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) || [];
    if (emails.length > 0 ) {
      console.log("GENERATING EMAIL CONTENT...");
      const generatedEmail = await generateEmail(command,emails[0]);
      const steps = emails.map( email => ({
        intent:"send_email",
        recipient: email,
        subject: generatedEmail.subject,
        body:generatedEmail.body
      }));
      return { steps };
    }
  }

 
  const toolsDescription = describeTools();

  // llama prompt
  const prompt = `

You are an AI desktop automation planner.

Convert the user request into executable JSON workflows.

AVAILABLE TOOLS:
${toolsDescription}

RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- Do not combine apps and URLs
- Open applications separately
- Type URLs using separate type_text steps
- Always return:
{
  "steps": []
}
- Each step must contain:
  - intent
  - required parameters
- intent must exactly match tool names
- Use minimal steps
- If a later step refers to something created earlier,
  use context variables.

CONTEXT VARIABLE EXAMPLE:

{
  "steps": [
    {
      "intent": "filesystem",
      "operation": "create_folder",
      "path": "Desktop/projects"
    },
    {
      "intent": "open_app",
      "app": "{{filesystem.path}}"
    }
  ]
}

USER REQUEST:
${command}

`;

  console.log(
    "SENDING REQUEST TO OLLAMA..."
  );

 // llama request
  const response = await fetch( "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3:8b",
          prompt,
          stream: false,
          options: {
            temperature: 0,
            num_predict: 300
          }
        })
      }
    );

  console.log("OLLAMA RESPONSE RECEIVED");

  // response
  const data = await response.json();
  console.log("RAW MODEL OUTPUT:",data.response);

 // clean o/p
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

  //extract json
  const jsonMatch = cleanedOutput.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No valid JSON found in model output");
  }
  const cleanedJson = jsonMatch[0];
  console.log("EXTRACTED JSON:",cleanedJson);

  // clean json
  try {
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("JSON PARSE FAILED");
    console.error(cleanedJson);
    throw error;
  }
}