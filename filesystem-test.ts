import { toolRegistry }
from "./packages/tools/registry.ts";

async function run() {

  const filesystemTool =
    toolRegistry.filesystem;

  await filesystemTool.execute({

    operation: "create_folder",

    path: "./output"

  });

  await filesystemTool.execute({

    operation: "write",

    path: "./output/test.txt",

    content:
      "Hello from AI OS"

  });

  const result =
    await filesystemTool.execute({

      operation: "read",

      path: "./output/test.txt"

    });

  console.log("\nFILE CONTENT:");

  console.log(result.data);
}

run();