import { NotificationTool } from "./notification.tool.ts";
import { FilesystemTool } from "./filesystem.tool.ts";
import { SaveEmailTool } from "./save-email.tool.ts";
import { AISummaryTool } from "./ai-summary.tool.ts";
import { SendEmailTool } from "./send-email.tool.ts";
import { openAppTool } from "./open-app.tool.ts";
import { typeTextTool } from "./type-text.tool.ts";
import { pressKeysTool } from "./press-keys.tool.ts";
import { screenshotTool } from "./screenshot.tool.ts";
import { mouseClickTool } from "./mouse-click.tool.ts";

export const toolRegistry = [
  new NotificationTool(),
  new FilesystemTool(),
  new SaveEmailTool(),
  new AISummaryTool(),
  new SendEmailTool(),
  openAppTool,
  typeTextTool,
  pressKeysTool,
  screenshotTool,
  mouseClickTool
];