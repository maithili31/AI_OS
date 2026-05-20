import { NotificationTool } from "./notification.tool.ts";
import { FilesystemTool } from "./filesystem.tool.ts";
import { SaveEmailTool } from "./save-email.tool.ts";
import { AISummaryTool } from "./ai-summary.tool.ts";
import { SendEmailTool } from "./send-email.tool.ts";
import { openAppTool } from "./open-app.tool.ts";

export const toolRegistry = [
  new NotificationTool(),
  new FilesystemTool(),
  new SaveEmailTool(),
  new AISummaryTool(),
  new SendEmailTool(),
  openAppTool
];