import { Tool } from "./index.ts";

export class AISummaryTool
implements Tool {

  name = "summarize_email";

  description =
    "Generate AI summary for email";

  parameters = [

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

    console.log(
      "AI SUMMARY:"
    );

    console.log(

      input.body
        ?.slice(0, 100)
    );

    return {
      success: true
    };
  }
}