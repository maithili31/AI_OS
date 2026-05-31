import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { Tool } from "./index.ts";

export class OpenAppTool implements Tool {
  name = "open_app";
  description = "Open applications, websites, files, or folders";

  parameters = [
    {
      name: "app",
      type: "string",
      description: "App, website, file, or folder to open",
      required: true
    }
  ];

  private websiteMap: Record<string, string> = {
    github: "https://github.com",
    youtube: "https://youtube.com",
    gmail: "https://mail.google.com",
    google: "https://google.com",
    chatgpt: "https://chat.openai.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    x: "https://twitter.com",
    whatsapp: "https://web.whatsapp.com"
  };

  private appMap: Record<string, string> = {
    chrome: "start chrome",
    "google chrome": "start chrome",
    edge: "start msedge",
    "microsoft edge": "start msedge",
    explorer: "start explorer",
    "file explorer": "start explorer",
    vscode: "code",
    "visual studio code": "code",
    "vs code": "code",
    notepad: "notepad",
    calculator: "calc",
    spotify: "start spotify",
    terminal: "start cmd",
    cmd: "start cmd",
    powershell: "start powershell"
  };

  normalizeTarget(target: string): string {
    return target.trim().toLowerCase();
  }

  /**
   * Resolves target paths against local home or OneDrive directories dynamically
   */
  resolvePath(target: string): string {
    if (path.isAbsolute(target)) {
      return target;
    }

    const homeDir = os.homedir();
    const oneDrivePath = path.join(homeDir, "OneDrive");
    const baseDir = fs.existsSync(oneDrivePath) ? oneDrivePath : homeDir;

    const normalized = target.toLowerCase();
    const targetFolders = ["desktop", "documents", "downloads", "pictures"] as const;

    for (const folder of targetFolders) {
      if (normalized.includes(folder)) {
        const folderOnDisk = folder.charAt(0).toUpperCase() + folder.slice(1);
        const cleanedSuffix = target
          .replace(new RegExp(`${folder}s?`, "gi"), "") // Matches folder or plural (e.g. picture/pictures)
          .replace(/^[/\\]/, "");

        return path.join(baseDir, folderOnDisk, cleanedSuffix);
      }
    }

    return target;
  }

  isUrl(target: string): boolean {
    return (
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      [".com", ".org", ".net"].some((tld) => target.includes(tld))
    );
  }

  async execute(input: any) {
    let target = input.app;

    if (input.parameters && Array.isArray(input.parameters)) {
      const appParam = input.parameters.find((param: any) => param.name === "app");
      if (appParam) {
        target = appParam.value;
      }
    }

    if (!target) {
      throw new Error("Open target missing");
    }

    console.log("OPEN TARGET:", target);
    const normalized = this.normalizeTarget(target);

    // Context A: Pre-defined Website Shortcut Lookup
    if (this.websiteMap[normalized]) {
      const website = this.websiteMap[normalized];
      console.log("OPENING WEBSITE:", website);
      exec(`start "" "${website}"`);
      return { success: true, opened: website };
    }

    // Context B: Explicit or Discovered Raw URL Strings
    if (this.isUrl(normalized)) {
      const finalUrl = normalized.startsWith("http") ? normalized : `https://${normalized}`;
      console.log("OPENING URL:", finalUrl);
      exec(`start "" "${finalUrl}"`);
      return { success: true, opened: finalUrl };
    }

    // Context C: Local File System Mapping Verification
    const resolvedPath = this.resolvePath(target);
    console.log("RESOLVED PATH:", resolvedPath);

    if (fs.existsSync(resolvedPath)) {
      console.log("OPENING FILE/FOLDER:", resolvedPath);
      exec(`start "" "${resolvedPath}"`);
      return { success: true, opened: resolvedPath };
    }

    // Context D: Local Application Command Execution
    const command = this.appMap[normalized];
    if (!command) {
      throw new Error(`Unsupported target: ${target}`);
    }

    console.log("OPENING APP:", command);
    exec(command);

    return { success: true, opened: target };
  }
}

export const openAppTool = new OpenAppTool();