import { Tool }
from "./index.ts";

export class NotificationTool
implements Tool {

  name = "notify_user";

  description =
    "Send a desktop notification to the user";

  parameters = [

    {
      name: "message",

      type: "string",

      description:
        "Notification message",

      required: true
    }
  ];

  async execute(
    input: any
  ) {

    console.log(

      "NOTIFICATION:",

      input.message ||
      "New notification"
    );

    return {
      success: true
    };
  }
}