import { Tool } from "./index.ts";

export class NotificationTool
implements Tool {

  name = "notify_user";

  description =
    "Send desktop notification";

    async execute(input: any) {

      console.log(
    
        `NOTIFICATION: New email from ${input.from}`
    
      );
    
      return {
        success: true
      };
    }
}