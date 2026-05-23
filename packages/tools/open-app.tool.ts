// import { exec }
// from "child_process";

// import fs
// from "fs";

// import path
// from "path";

// import os
// from "os";

// import { Tool }
// from "./index.ts";

// export class OpenAppTool
//   implements Tool {

//   name = "open_app";

//   description =
//     "Open apps, files, or folders";

//   parameters = [

//     {
//       name: "app",

//       type: "string",

//       description:
//         "Application, file, or folder to open",

//       required: true
//     }
//   ];

//   resolvePath(
//     target: string
//   ) {

//     const homeDir =
//       os.homedir();

//     const baseDir =

//       fs.existsSync(

//         path.join(
//           homeDir,
//           "OneDrive"
//         )

//       )

//         ?

//         path.join(
//           homeDir,
//           "OneDrive"
//         )

//         :

//         homeDir;

//     /*
//     =========================================
//     DESKTOP
//     =========================================
//     */

//     if (
//       target
//         .toLowerCase()
//         .includes(
//           "desktop"
//         )
//     ) {

//       return path.join(

//         baseDir,

//         "Desktop",

//         target

//           .replace(
//             /desktop/gi,
//             ""
//           )

//           .replace(
//             /^[/\\]/,
//             ""
//           )
//       );
//     }

//     /*
//     =========================================
//     DOCUMENTS
//     =========================================
//     */

//     if (
//       target
//         .toLowerCase()
//         .includes(
//           "documents"
//         )
//     ) {

//       return path.join(

//         baseDir,

//         "Documents",

//         target

//           .replace(
//             /documents/gi,
//             ""
//           )

//           .replace(
//             /^[/\\]/,
//             ""
//           )
//       );
//     }

//     /*
//     =========================================
//     DOWNLOADS
//     =========================================
//     */

//     if (
//       target
//         .toLowerCase()
//         .includes(
//           "downloads"
//         )
//     ) {

//       return path.join(

//         baseDir,

//         "Downloads",

//         target

//           .replace(
//             /downloads/gi,
//             ""
//           )

//           .replace(
//             /^[/\\]/,
//             ""
//           )
//       );
//     }

//     return target;
//   }

//   async execute(
//     input: any
//   ) {

//     let target =
//       input.app;

//     /*
//     =========================================
//     PARAM EXTRACTION
//     =========================================
//     */

//     if (
//       input.parameters &&
//       Array.isArray(
//         input.parameters
//       )
//     ) {

//       for (
//         const param
//         of input.parameters
//       ) {

//         if (
//           param.name ===
//           "app"
//         ) {

//           target =
//             param.value;
//         }
//       }
//     }

//     if (!target) {

//       throw new Error(
//         "Open target missing"
//       );
//     }

//     console.log(
//       "OPEN TARGET:",
//       target
//     );

//     /*
//     =========================================
//     FILE/FOLDER PATH
//     =========================================
//     */

//     const resolvedPath =
//       this.resolvePath(
//         target
//       );

//     /*
//     =========================================
//     IF PATH EXISTS
//     =========================================
//     */

//     if (
//       fs.existsSync(
//         resolvedPath
//       )
//     ) {

//       console.log(
//         "OPENING FILE/FOLDER:",
//         resolvedPath
//       );

//       exec(
//         `start "" "${resolvedPath}"`
//       );

//       return {

//         success: true,

//         opened:
//           resolvedPath
//       };
//     }

//     /*
//     =========================================
//     APP MAP
//     =========================================
//     */

//     const appMap:
//       Record<string, string> = {

//       chrome:
//         "start chrome",

//       "google chrome":
//         "start chrome",

//       edge:
//         "start msedge",

//       "microsoft edge":
//         "start msedge",

//       vscode:
//         "code",

//       "visual studio code":
//         "code",

//       notepad:
//         "notepad",

//       calculator:
//         "calc",

//       spotify:
//         "start spotify"
//     };

//     const normalized =
//       target.toLowerCase();

//     const command =
//       appMap[
//         normalized
//       ];

//     if (!command) {

//       throw new Error(
//         `Unsupported target:
//          ${target}`
//       );
//     }

//     /*
//     =========================================
//     OPEN APP
//     =========================================
//     */

//     console.log(
//       "OPENING APP:",
//       command
//     );

//     exec(command);

//     return {

//       success: true,

//       opened:
//         target
//     };
//   }
// }

// export const openAppTool =
//   new OpenAppTool();

import { exec }
from "child_process";

import fs
from "fs";

import path
from "path";

import os
from "os";

import { Tool }
from "./index.ts";

export class OpenAppTool
  implements Tool {

  name = "open_app";

  description =
    "Open applications, files, or folders";

  parameters = [

    {
      name: "app",

      type: "string",

      description:
        "Application, file path, or folder path to open",

      required: true
    }
  ];

  /*
  =========================================
  RESOLVE USER PATHS
  =========================================
  */

  resolvePath(
    target: string
  ) {

    /*
    =========================================
    ABSOLUTE PATH
    =========================================
    */

    if (
      path.isAbsolute(
        target
      )
    ) {

      return target;
    }

    const homeDir =
      os.homedir();

    /*
    =========================================
    ONEDRIVE DETECTION
    =========================================
    */

    const baseDir =

      fs.existsSync(

        path.join(
          homeDir,
          "OneDrive"
        )

      )

        ?

        path.join(
          homeDir,
          "OneDrive"
        )

        :

        homeDir;

    /*
    =========================================
    DESKTOP
    =========================================
    */

    if (
      target
        .toLowerCase()
        .includes(
          "desktop"
        )
    ) {

      return path.join(

        baseDir,

        "Desktop",

        target

          .replace(
            /desktop/gi,
            ""
          )

          .replace(
            /^[/\\]/,
            ""
          )
      );
    }

    /*
    =========================================
    DOCUMENTS
    =========================================
    */

    if (
      target
        .toLowerCase()
        .includes(
          "documents"
        )
    ) {

      return path.join(

        baseDir,

        "Documents",

        target

          .replace(
            /documents/gi,
            ""
          )

          .replace(
            /^[/\\]/,
            ""
          )
      );
    }

    /*
    =========================================
    DOWNLOADS
    =========================================
    */

    if (
      target
        .toLowerCase()
        .includes(
          "downloads"
        )
    ) {

      return path.join(

        baseDir,

        "Downloads",

        target

          .replace(
            /downloads/gi,
            ""
          )

          .replace(
            /^[/\\]/,
            ""
          )
      );
    }

    /*
    =========================================
    DEFAULT
    =========================================
    */

    return target;
  }

  /*
  =========================================
  MAIN EXECUTION
  =========================================
  */

  async execute(
    input: any
  ) {

    let target =
      input.app;

    /*
    =========================================
    PARAM EXTRACTION
    =========================================
    */

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

          target =
            param.value;
        }
      }
    }

    /*
    =========================================
    VALIDATION
    =========================================
    */

    if (!target) {

      throw new Error(
        "Open target missing"
      );
    }

    console.log(
      "OPEN TARGET:",
      target
    );

    /*
    =========================================
    RESOLVE PATH
    =========================================
    */

    const resolvedPath =
      this.resolvePath(
        target
      );

    console.log(
      "RESOLVED PATH:",
      resolvedPath
    );

    /*
    =========================================
    OPEN FILE OR FOLDER
    =========================================
    */

    if (
      fs.existsSync(
        resolvedPath
      )
    ) {

      console.log(
        "OPENING FILE/FOLDER:",
        resolvedPath
      );

      exec(
        `start "" "${resolvedPath}"`
      );

      return {

        success: true,

        opened:
          resolvedPath
      };
    }

    /*
    =========================================
    APPLICATION MAP
    =========================================
    */

    const appMap:
      Record<string, string> = {

      chrome:
        "start chrome",

      "google chrome":
        "start chrome",

      edge:
        "start msedge",

      "microsoft edge":
        "start msedge",

      explorer:
        "start explorer",

      "file explorer":
        "start explorer",

      vscode:
        "code",

      "visual studio code":
        "code",

      notepad:
        "notepad",

      calculator:
        "calc",

      spotify:
        "start spotify"
    };

    const normalized =
      target.toLowerCase();

    const command =
      appMap[
        normalized
      ];

    /*
    =========================================
    UNKNOWN APP
    =========================================
    */

    if (!command) {

      throw new Error(
        `Unsupported target:
${target}`
      );
    }

    /*
    =========================================
    OPEN APPLICATION
    =========================================
    */

    console.log(
      "OPENING APP:",
      command
    );

    exec(command);

    return {

      success: true,

      opened:
        target
    };
  }
}

export const openAppTool =
  new OpenAppTool();