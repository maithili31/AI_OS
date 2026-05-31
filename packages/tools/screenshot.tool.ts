import screenshot from "screenshot-desktop";
import path from "path";
import fs from "fs";
import os from "os";
import { Tool } from "./index.ts";

export class ScreenshotTool implements Tool {
  name = "take_screenshot";
  description = "Capture desktop screenshots with metadata support";

  parameters = [
    {
      name: "monitor",
      type: "number",
      description: "The ID of the monitor to capture. Defaults to main display.",
      required: false
    }
  ];

  /**
   * Resolves the primary root base directory favoring OneDrive if present
   */
  private getBaseDir(): string {
    const homeDir = os.homedir();
    const oneDrivePath = path.join(homeDir, "OneDrive");
    return fs.existsSync(oneDrivePath) ? oneDrivePath : homeDir;
  }

  /**
   * Retrieves the targeted absolute location for storage snapshots
   */
  private getScreenshotsDir(): string {
    return path.join(this.getBaseDir(), "Pictures", "screenshot");
  }

  /**
   * Guarantees target directory presence recursively
   */
  private ensureDirectory(): string {
    const dir = this.getScreenshotsDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Evicts the oldest captures from disk when total count exceeds the specified threshold
   */
  private cleanupOldScreenshots(maxFiles = 50): void {
    try {
      const dir = this.getScreenshotsDir();
      if (!fs.existsSync(dir)) return;

      const files = fs.readdirSync(dir)
        .filter((file) => file.endsWith(".png") && file !== "latest.png")
        .map((file) => {
          const filePath = path.join(dir, file);
          return {
            file,
            filePath,
            time: fs.statSync(filePath).mtime.getTime(),
          };
        })
        .sort((a, b) => b.time - a.time);

      if (files.length <= maxFiles) return;

      const filesToDelete = files.slice(maxFiles);
      for (const fileData of filesToDelete) {
        try {
          fs.unlinkSync(fileData.filePath);
          // Also clear out the associated metadata sidecar if present
          const metaPath = fileData.filePath.replace(".png", ".json");
          if (fs.existsSync(metaPath)) {
            fs.unlinkSync(metaPath);
          }
        } catch (err) {
          console.error(`Failed to delete file entry: ${fileData.file}`, err);
        }
      }
    } catch (err) {
      console.error("Failed executing directory optimization cleanup:", err);
    }
  }

  /**
   * Generates a companion JSON document populated with runtime metadata specs
   */
  private saveMetadata(imagePath: string): void {
    try {
      const metadataPath = imagePath.replace(".png", ".json");
      const metadata = {
        timestamp: new Date().toISOString(),
        platform: os.platform(),
        hostname: os.hostname(),
        resolution: {
          width: process.stdout.columns || 1920, // Fallback safe dimensions if TTY columns are undefined
          height: process.stdout.rows || 1080,
        },
        image: imagePath,
      };

      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    } catch (err) {
      console.error("Failed mapping tool context payload to sidecar path:", err);
    }
  }

  /**
   * Primary invocation gate to capture display context state layers
   */
  async execute(input?: any) {
    const screenshotsDir = this.ensureDirectory();
    this.cleanupOldScreenshots();

    const timestamp = Date.now();
    const screenshotPath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
    const latestPath = path.join(screenshotsDir, "latest.png");
    const monitor = input?.monitor;

    console.log("CAPTURING SCREENSHOT...");

    try {
      await screenshot({
        filename: screenshotPath,
        screen: monitor,
      });

      // Maintain a stable pointer reference for downstream image consumption models
      try {
        fs.copyFileSync(screenshotPath, latestPath);
      } catch (copyErr) {
        console.warn("Could not synchronize 'latest.png' pointer link:", copyErr);
      }

      this.saveMetadata(screenshotPath);
      console.log("SCREENSHOT SAVED:", screenshotPath);

      return {
        success: true,
        path: screenshotPath,
        latest: latestPath,
        monitor: monitor ?? 0,
      };
    } catch (err: any) {
      console.error("Screenshot capture runner failed:", err);
      throw new Error(`Desktop capture execution constraint failed: ${err.message}`);
    }
  }
}

export const screenshotTool = new ScreenshotTool();