import fs from "fs/promises";
import { Tool } from "./index.ts";
import { ValidationError } from "../shared/errors";

export class FilesystemTool
implements Tool {

  name = "filesystem";

  description =
    "Read and write local files";

  async execute(input: any) {

    const {
      operation,
      path,
      content
    } = input;

    switch(operation) {

      case "write":

        await fs.writeFile(
          path,
          content
        );

        console.log(
          `FILE SAVED: ${path}`
        );

        return {
          success: true
        };

      case "read":

        const data =
          await fs.readFile(
            path,
            "utf-8"
          );

        console.log(
          `FILE READ: ${path}`
        );

        return {
          success: true,
          data
        };

      case "create_folder":

        await fs.mkdir(
          path,
          {
            recursive: true
          }
        );

        console.log(
          `FOLDER CREATED: ${path}`
        );

        return {
          success: true
        };

      default:
        throw new ValidationError(
          `Unknown filesystem operation: ${operation}`
        );
    }
  }
}