import fs from "fs";
import os from "os";
import path from "path";

import { Tool }
from "./index.ts";

export class FilesystemTool
  implements Tool {

  name = "filesystem";

  description =
    "Create, move, rename, delete, read, and find files/folders";

  parameters = [

    {
      name: "operation",

      type: "string",

      description:
        "Filesystem operation",

      required: true
    },

    {
      name: "path",

      type: "string",

      description:
        "Target path",

      required: false
    }
  ];

  /*
  =========================================
  RESOLVE USER PATHS
  =========================================
  */

  resolvePath(
    targetPath: string
  ) {

    const homeDir =
      os.homedir();

    /*
    =========================================
    ONEDRIVE
    =========================================
    */

    const oneDriveDir =
      path.join(
        homeDir,
        "OneDrive"
      );

    const baseDir =

      fs.existsSync(
        oneDriveDir
      )

        ?

        oneDriveDir

        :

        homeDir;

    const cleanedPath =

      targetPath

        .replace(
          /^[/\\\\]+/,
          ""
        )

        .trim();

    /*
    =========================================
    DESKTOP
    =========================================
    */

    if (

      cleanedPath
        .toLowerCase()
        .startsWith(
          "desktop"
        )

    ) {

      return path.join(

        baseDir,

        "Desktop",

        cleanedPath

          .replace(
            /desktop/gi,
            ""
          )

          .replace(
            /^[/\\\\]+/,
            ""
          )

          .trim()
      );
    }

    /*
    =========================================
    DOCUMENTS
    =========================================
    */

    if (

      cleanedPath
        .toLowerCase()
        .startsWith(
          "documents"
        )

      ||

      cleanedPath
        .toLowerCase()
        .startsWith(
          "document"
        )
    ) {

      return path.join(

        baseDir,

        "Documents",

        cleanedPath

          .replace(
            /documents?/gi,
            ""
          )

          .replace(
            /^[/\\\\]+/,
            ""
          )

          .trim()
      );
    }

    /*
    =========================================
    DOWNLOADS
    =========================================
    */

    if (

      cleanedPath
        .toLowerCase()
        .startsWith(
          "downloads"
        )

      ||

      cleanedPath
        .toLowerCase()
        .startsWith(
          "download"
        )
    ) {

      return path.join(

        baseDir,

        "Downloads",

        cleanedPath

          .replace(
            /downloads?/gi,
            ""
          )

          .replace(
            /^[/\\\\]+/,
            ""
          )

          .trim()
      );
    }

    /*
    =========================================
    PICTURES
    =========================================
    */

    if (

      cleanedPath
        .toLowerCase()
        .startsWith(
          "pictures"
        )

      ||

      cleanedPath
        .toLowerCase()
        .startsWith(
          "picture"
        )
    ) {

      return path.join(

        baseDir,

        "Pictures",

        cleanedPath

          .replace(
            /pictures?/gi,
            ""
          )

          .replace(
            /^[/\\\\]+/,
            ""
          )

          .trim()
      );
    }

    /*
    =========================================
    ABSOLUTE PATH
    =========================================
    */

    if (
      path.isAbsolute(
        cleanedPath
      )
    ) {

      return cleanedPath;
    }

    return cleanedPath;
  }

  /*
  =========================================
  MAIN EXECUTION
  =========================================
  */

  async execute(
    input: any
  ) {

    let operation =
      input.operation;

    let targetPath =
      input.path;

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

    const normalizedOperation =

      operation

        ?.toLowerCase()

        ?.replace(
          /\s+/g,
          "_"
        );

    console.log(
      "FILESYSTEM OPERATION:",
      normalizedOperation
    );

    /*
    =========================================
    CREATE FOLDER
    =========================================
    */

    if (

      normalizedOperation ===
        "create_folder"

      ||

      normalizedOperation ===
        "mkdir"
    ) {

      const resolvedPath =
        this.resolvePath(
          targetPath
        );

      fs.mkdirSync(
        resolvedPath,
        {
          recursive: true
        }
      );

      console.log(
        "FOLDER CREATED:",
        resolvedPath
      );

      return {

        success: true,

        operation:
          normalizedOperation,

        path:
          resolvedPath
      };
    }

    /*
    =========================================
    CREATE FILE
    =========================================
    */

    if (

      normalizedOperation ===
        "create_file"

      ||

      normalizedOperation ===
        "touch"
    ) {

      const resolvedPath =
        this.resolvePath(
          targetPath
        );

      const parentDir =
        path.dirname(
          resolvedPath
        );

      fs.mkdirSync(
        parentDir,
        {
          recursive: true
        }
      );

      fs.writeFileSync(
        resolvedPath,
        ""
      );

      console.log(
        "FILE CREATED:",
        resolvedPath
      );

      return {

        success: true,

        operation:
          normalizedOperation,

        path:
          resolvedPath
      };
    }

    /*
    =========================================
    MOVE FILE
    =========================================
    */

    if (
      normalizedOperation ===
      "move_file"
    ) {

      const source =
        this.resolvePath(
          input.source
        );

      const destination =
        this.resolvePath(
          input.destination
        );

      fs.renameSync(
        source,
        destination
      );

      console.log(
        "FILE MOVED:",
        destination
      );

      return {

        success: true,

        source,

        destination
      };
    }

    /*
    =========================================
    RENAME FILE
    =========================================
    */

    if (
      normalizedOperation ===
      "rename_file"
    ) {

      const source =
        this.resolvePath(
          input.source
        );

      const newName =
        input.new_name;

      const destination =
        path.join(

          path.dirname(
            source
          ),

          newName
        );

      fs.renameSync(
        source,
        destination
      );

      console.log(
        "FILE RENAMED:",
        destination
      );

      return {

        success: true,

        source,

        destination
      };
    }

    /*
    =========================================
    DELETE FILE/FOLDER
    =========================================
    */

    if (

      normalizedOperation ===
        "delete_file"

      ||

      normalizedOperation ===
        "delete_folder"

      ||

      normalizedOperation ===
        "delete"
    ) {

      const resolvedPath =
        this.resolvePath(
          targetPath
        );

      if (
        !fs.existsSync(
          resolvedPath
        )
      ) {

        throw new Error(
          `Path not found:
${resolvedPath}`
        );
      }

      const stats =
        fs.statSync(
          resolvedPath
        );

      if (
        stats.isDirectory()
      ) {

        fs.rmSync(
          resolvedPath,
          {
            recursive: true,
            force: true
          }
        );

      } else {

        fs.unlinkSync(
          resolvedPath
        );
      }

      console.log(
        "DELETED:",
        resolvedPath
      );

      return {

        success: true,

        deleted:
          resolvedPath
      };
    }

    /*
    =========================================
    READ FILE
    =========================================
    */

    if (
      normalizedOperation ===
      "read_file"
    ) {

      const resolvedPath =
        this.resolvePath(
          targetPath
        );

      const content =
        fs.readFileSync(
          resolvedPath,
          "utf-8"
        );

      console.log(
        "FILE CONTENT:",
        content
      );

      return {

        success: true,

        content
      };
    }

    /*
    =========================================
    FIND FILE
    =========================================
    */

    if (
      normalizedOperation ===
      "find_file"
    ) {

      const query =

        input.query
          ?.toLowerCase();

      const results:
        string[] = [];

      const searchDir =
        fs.existsSync(
          oneDriveDir
        )

          ?

          oneDriveDir

          :

          homeDir;

      function searchDirectory(
        dir: string
      ) {

        let items: string[] =
          [];

        try {

          items =
            fs.readdirSync(
              dir
            );

        } catch {

          return;
        }

        for (
          const item
          of items
        ) {

          const fullPath =
            path.join(
              dir,
              item
            );

          try {

            const stats =
              fs.statSync(
                fullPath
              );

            if (
              stats.isDirectory()
            ) {

              searchDirectory(
                fullPath
              );

            } else {

              if (

                item
                  .toLowerCase()
                  .includes(
                    query
                  )
              ) {

                results.push(
                  fullPath
                );
              }
            }

          } catch {}
        }
      }

      searchDirectory(
        searchDir
      );

      console.log(
        "FILES FOUND:",
        results
      );

      return {

        success: true,

        results
      };
    }

    /*
    =========================================
    UNKNOWN OPERATION
    =========================================
    */

    throw new Error(
      `Unknown filesystem operation:
${operation}`
    );
  }
}

export const filesystemTool =
  new FilesystemTool();