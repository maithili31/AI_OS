// import { NotificationTool } from "./notification.tool.ts";
// import { FilesystemTool } from "./filesystem.tool.ts";
// import { SaveEmailTool } from "./save-email.tool.ts";
// import { AISummaryTool } from "./ai-summary.tool.ts";

// export const toolRegistry = {
//   notify_user:new NotificationTool(),
//   filesystem:new FilesystemTool(),
//   save_email:new SaveEmailTool(),
//   summarize_email:new AISummaryTool()
// };
import { NotificationTool }
from "./notification.tool.ts";

import { FilesystemTool }
from "./filesystem.tool.ts";

import { SaveEmailTool }
from "./save-email.tool.ts";

import { AISummaryTool }
from "./ai-summary.tool.ts";

import { SendEmailTool }
from "./send-email.tool.ts";

export const toolRegistry = [

  new NotificationTool(),

  new FilesystemTool(),

  new SaveEmailTool(),

  new AISummaryTool(),

  new SendEmailTool()
];