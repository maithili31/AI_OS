import fs from "fs";

import os from "os";

import path from "path";

import { Tool } from "./index.ts";

export class FilesystemTool
  implements Tool {

  name = "filesystem";

  description =
    "Perform filesystem operations like creating folders";

  parameters = [

    {
      name: "operation",

      type: "string",

      description:
        "Filesystem operation to perform",

      required: true
    },

    {
      name: "path",

      type: "string",

      description:
        "Target filesystem path",

      required: true
    }
  ];

  resolvePath(
    targetPath: string
  ) {
  
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
    ) : os.homedir();
  
    const oneDriveDesktop =
      path.join(
        baseDir,
        "OneDrive",
        "Desktop"
      );
  
    const localDesktop =
      path.join(
        baseDir,
        "Desktop"
      );
  
    const desktopBasePath =
  
      fs.existsSync(
        oneDriveDesktop
      )
  
        ? oneDriveDesktop
  
        : localDesktop;
  
    const cleanedPath =
  
      targetPath
  
        .replace(/^[/\\\\]+/, "")
  
        .trim();
  
    if (
  
      cleanedPath
        .toLowerCase()
        .includes("desktop")
  
    ) {
  
      return path.join(
  
        desktopBasePath,
  
        cleanedPath
  
          .replace(
            /desktop/gi,
            ""
          )
  
          .replace(/^[/\\\\]+/, "")
  
          .trim()
      );
    }
  
    if (
  
      cleanedPath
        .toLowerCase()
        .includes("document")
  
    ) {
  
      return path.join(
  
        baseDir,
  
        "Documents",
  
        cleanedPath
  
          .replace(
            /documents?/gi,
            ""
          )
  
          .replace(/^[/\\\\]+/, "")
  
          .trim()
      );
    }
  
    if (
  
      cleanedPath
        .toLowerCase()
        .includes("download")
  
    ) {
  
      return path.join(
  
        baseDir,
  
        "Downloads",
  
        cleanedPath
  
          .replace(
            /downloads?/gi,
            ""
          )
  
          .replace(/^[/\\\\]+/, "")
  
          .trim()
      );
    }
  
    return cleanedPath;
  }

  async execute(
    input: any
  ) {

    let operation =
      input.operation;

    let targetPath =
      input.path;

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
          "operation"
        ) {

          operation =
            param.value;
        }

        if (
          param.name ===
          "path"
        ) {

          targetPath =
            param.value;
        }
      }
    }

    if (!targetPath) {

      throw new Error(
        "Path is required"
      );
    }

    const resolvedPath =
      this.resolvePath(
        targetPath
      );

    const normalizedOperation =

      operation
        ?.toLowerCase()
        ?.replace(/\s+/g, "_");

    if (

      normalizedOperation ===
        "create_folder"

      ||

      normalizedOperation ===
        "create"

      ||

      normalizedOperation ===
        "mkdir"

    ) {

      fs.mkdirSync(
        resolvedPath,
        {
          recursive: true
        }
      );

      console.log(
        `FOLDER CREATED:
         ${resolvedPath}`
      );
    }

    else {

      console.log(
        `UNKNOWN OPERATION:
         ${operation}`
      );
    }

    return {

      success: true,

      operation:
        normalizedOperation,

      path:
        resolvedPath
    };
  }
}