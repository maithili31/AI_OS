import fs from "fs/promises";

import { Tool }
from "./index.ts";

export class SaveEmailTool
implements Tool {

  name = "save_email";

  description =
    "Save recruiter email locally";

  async execute(input: any) {

    await fs.mkdir(
      "./emails",
      {
        recursive: true
      }
    );

    const filename =
      `./emails/email-${Date.now()}.txt`;

    const content = `

FROM: ${input.from}

SUBJECT: ${input.subject}

BODY:
${input.body}

`;

    await fs.writeFile(
      filename,
      content
    );

    console.log(
      `EMAIL SAVED:${filename}`
    );

    return {
      success: true
    };
  }
}