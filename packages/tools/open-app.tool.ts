import { exec }
from "child_process";

import { Tool }
from "./index.ts";

export class OpenAppTool
  implements Tool {

  
  name = "open_app";

  description =
    "Open desktop applications";

  parameters = [

    {
      name: "app",

      type: "string",

      description:
        "Application name to open",

      required: true
    }
  ];

  private normalizeAppName(
    appName: string
  ) {
  
    const normalized =
  
      appName
  
        .toLowerCase()
  
        .trim();
  
    if (
      normalized.includes(
        "chrome"
      )
    ) {
  
      return "chrome";
    }
  
    if (
      normalized.includes(
        "edge"
      )
    ) {
  
      return "edge";
    }
  
    if (
      normalized.includes(
        "visual studio"
      ) ||
  
      normalized.includes(
        "vs code"
      ) ||
  
      normalized.includes(
        "vscode"
      )
    ) {
  
      return "vscode";
    }
  
    if (
      normalized.includes(
        "notepad"
      )
    ) {
  
      return "notepad";
    }
  
    if (
      normalized.includes(
        "spotify"
      )
    ) {
  
      return "spotify";
    }
  
    if (
      normalized.includes(
        "calculator"
      )
    ) {
  
      return "calculator";
    }
  
    if (
      normalized.includes(
        "paint"
      )
    ) {
  
      return "paint";
    }
  
    return normalized;
  }

  private appMappings:
    Record<string, string> = {

    chrome:
      "start chrome",

    vscode:
      "code",

    notepad:
      "notepad",

    spotify:
      "start spotify",

    calculator:
      "calc",

    paint:
      "mspaint"
  };

  async execute(
    input: any
  ) {

    let appName =
      input.app;

    if (
      input.parameters &&
      Array.isArray(
        input.parameters
      )
    ) {

      for (
        const param
        of input.parameters
      ) {

        if (
          param.name ===
          "app"
        ) {

          appName =
            param.value;
        }
      }
    }

    if (!appName) {

      throw new Error(
        "App name missing"
      );
    }

    const normalizedApp = this.normalizeAppName(appName);
    const command = this.appMappings[normalizedApp];

    if (!command) {

      throw new Error(
        `Unsupported app:
         ${appName}`
      );
    }

    console.log(
      `OPENING APP:
       ${appName}`
    );

    exec(command);

    return {
      success: true,
      app: normalizedApp
    };
  }
}

export const openAppTool =
  new OpenAppTool();