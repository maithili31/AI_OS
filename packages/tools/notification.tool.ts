import notifier from "node-notifier";
import fs from "fs";
import path from "path";
import os from "os";
import { Tool } from "./index.ts";

export class NotificationTool implements Tool {
  name = "notify_user";
  description = "Send advanced desktop notifications";

  parameters = [
    {
      name: "title",
      type: "string",
      description: "Notification title",
      required: false
    },
    {
      name: "message",
      type: "string",
      description: "Notification message",
      required: true
    },
    {
      name: "type",
      type: "string",
      description: "success, error, warning, info",
      required: false
    },
    {
      name: "silent",
      type: "boolean",
      description: "Silent notification",
      required: false
    }
  ];

  /**
   * Resolves and ensures the absolute path to the notifications storage directory
   */
  private getNotificationDir(): string {
    const homeDir = os.homedir();
    const oneDrivePath = path.join(homeDir, "OneDrive");
    const baseDir = fs.existsSync(oneDrivePath) ? oneDrivePath : homeDir;
    const notificationDir = path.join(baseDir, "Documents", "AI-OS", "notifications");

    try {
      if (!fs.existsSync(notificationDir)) {
        fs.mkdirSync(notificationDir, { recursive: true });
      }
    } catch (err) {
      console.error("Failed to establish notification log tracking directory:", err);
    }

    return notificationDir;
  }

  /**
   * Commits the notification payload history sidecars to local persistent storage
   */
  private saveNotification(data: any): void {
    try {
      const dir = this.getNotificationDir();
      const jsonPath = path.join(dir, `notification-${data.timestamp}.json`);
      const latestPath = path.join(dir, "latest-notification.json");
      const serializedData = JSON.stringify(data, null, 2);

      fs.writeFileSync(jsonPath, serializedData, "utf-8");
      fs.writeFileSync(latestPath, serializedData, "utf-8");
    } catch (err) {
      console.error("Failed writing notification log tracking sidecars to disk:", err);
    }
  }

  /**
   * Generates a structural semantic title based on the context type fallback
   */
  private getDefaultTitle(type?: string): string {
    switch (type?.toLowerCase()) {
      case "success":
        return "✅ AI-OS";
      case "error":
        return "❌ AI-OS";
      case "warning":
        return "⚠️ AI-OS";
      default:
        return "🤖 AI-OS";
    }
  }

  async execute(input: any) {
    let title = input.title;
    let message = input.message;
    let type = input.type;
    let silent = input.silent;

    // Support standard OS agent parameter array envelope parsing
    if (input.parameters && Array.isArray(input.parameters)) {
      const titleParam = input.parameters.find((p: any) => p.name === "title");
      const messageParam = input.parameters.find((p: any) => p.name === "message");
      const typeParam = input.parameters.find((p: any) => p.name === "type");
      const silentParam = input.parameters.find((p: any) => p.name === "silent");

      if (titleParam) title = titleParam.value;
      if (messageParam) message = messageParam.value;
      if (typeParam) type = typeParam.value;
      if (silentParam) silent = silentParam.value;
    }

    // Assign fallback configurations cleanly
    type = type || "info";
    message = message || "New AI-OS notification";
    title = title || this.getDefaultTitle(type);
    silent = typeof silent === "boolean" ? silent : false;

    const notificationData = {
      timestamp: Date.now(),
      readableDate: new Date().toISOString(),
      title,
      message,
      type,
      silent
    };

    console.log("NOTIFICATION SUBMITTED:", notificationData);

    // Save transaction trace logs to disk asynchronously without blocking runtime triggers
    this.saveNotification(notificationData);

    // Dispatch Native Toast Notification Frame
    notifier.notify({
      title,
      message,
      sound: !silent,
      wait: false,
      timeout: 5
    });

    return {
      success: true,
      notification: notificationData
    };
  }
}

export const notificationTool = new NotificationTool();