import { toolRegistry }
from "./registry.ts";

export async function executeTool(

  toolName: string,

  params: any
) {

  const tool =
    toolRegistry.find(

      tool =>
        tool.name === toolName
    );

  if (!tool) {

    throw new Error(
      `Tool not found:
       ${toolName}`
    );
  }

  console.log(
    `EXECUTING TOOL:
     ${tool.name}`
  );

  return tool.execute(
    params
  );
}