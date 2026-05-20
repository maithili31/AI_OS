import fs from "fs";

import path from "path";

import { Tool }
from "./index.ts";

export class SaveEmailTool
implements Tool {

  name = "save_email";

  description =
    "Save email contents locally";

  parameters = [

    {
      name: "subject",

      type: "string",

      description:
        "Email subject",

      required: true
    },

    {
      name: "body",

      type: "string",

      description:
        "Email body",

      required: true
    }
  ];

  async execute(
    input: any
  ) {

    const filePath =
      path.join(

        process.cwd(),

        "emails",

        `email-${Date.now()}.txt`
      );

    fs.mkdirSync(
      path.dirname(filePath),
      { recursive: true }
    );

    fs.writeFileSync(

      filePath,

      `
SUBJECT:
${input.subject}

BODY:
${input.body}
`
    );

    console.log(
      `EMAIL SAVED:
       ${filePath}`
    );

    return {
      success: true
    };
  }
}