import fs from "fs";
import path from "path";
import { Tool } from "./index.ts";

export class SaveEmailTool implements Tool {
  name = "save_email";
  description = "Save email contents locally";

  parameters = [
    {
      name: "subject",
      type: "string",
      description: "Email subject",
      required: true
    },
    {
      name: "body",
      type: "string",
      description: "Email body",
      required: true
    }
  ];

  async execute(input: any) {
    let subject = input.subject;
    let body = input.body;

    // Safely parse nested parameters array envelope if present
    if (input.parameters && Array.isArray(input.parameters)) {
      const subjectParam = input.parameters.find((p: any) => p.name === "subject");
      const bodyParam = input.parameters.find((p: any) => p.name === "body");
      
      if (subjectParam) subject = subjectParam.value;
      if (bodyParam) body = bodyParam.value;
    }

    if (!subject) throw new Error("Subject missing");
    if (!body) throw new Error("Body missing");

    const targetDir = path.join(process.cwd(), "emails");
    const filePath = path.join(targetDir, `email-${Date.now()}.txt`);

    try {
      // Ensure the container folder exists explicitly
      fs.mkdirSync(targetDir, { recursive: true });

      const payload = `SUBJECT:\n${subject}\n\nBODY:\n${body}\n`;
      fs.writeFileSync(filePath, payload, "utf-8");

      console.log(`EMAIL SAVED: ${filePath}`);

      return {
        success: true,
        path: filePath,
        fileName: path.basename(filePath)
      };
    } catch (err: any) {
      console.error("Failed to commit email file to disk path allocation:", err);
      throw new Error(`Storage execution constraint failed: ${err.message}`);
    }
  }
}

export const saveEmailTool = new SaveEmailTool();