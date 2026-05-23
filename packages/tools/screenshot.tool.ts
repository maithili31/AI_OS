import screenshot
from "screenshot-desktop";

import path
from "path";

import fs
from "fs";

import os
from "os";

import { Tool }
from "./index.ts";

export class ScreenshotTool
  implements Tool {

  name = "take_screenshot";

  description =
    "Capture desktop screenshot";

  async execute() {

    /*
    =========================================
    DETECT ONEDRIVE
    =========================================
    */

    const baseDir =

      fs.existsSync(

        path.join(
          os.homedir(),
          "OneDrive"
        )

      )

        ?

        path.join(
          os.homedir(),
          "OneDrive"
        )

        :

        os.homedir();

    /*
    =========================================
    SCREENSHOT DIRECTORY
    =========================================
    */

    const screenshotsDir =
      path.join(

        baseDir,

        "Pictures",

        "screenshot"
      );

    /*
    =========================================
    CREATE DIRECTORY
    =========================================
    */

    if (
      !fs.existsSync(
        screenshotsDir
      )
    ) {

      fs.mkdirSync(
        screenshotsDir,
        {
          recursive: true
        }
      );
    }

    /*
    =========================================
    FILE PATH
    =========================================
    */

    const filePath =
      path.join(

        screenshotsDir,

        `screenshot-${Date.now()}.png`
      );

    /*
    =========================================
    TAKE SCREENSHOT
    =========================================
    */

    await screenshot({

      filename:
        filePath
    });

    console.log(
      "SCREENSHOT SAVED:",
      filePath
    );

    return {

      success: true,

      path:
        filePath
    };
  }
}

export const screenshotTool =
  new ScreenshotTool();