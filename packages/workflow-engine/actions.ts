import { toolRegistry } from "../tools/registry.ts";
import { PermanentError } from "../shared/errors";

export async function executeAction(
  action: string,
  payload: any
) {

  const tool =
    toolRegistry[
      action as keyof typeof toolRegistry
    ];

  if (!tool) {
    throw new PermanentError(
      `Tool not found: ${action}`,
      "TOOL_NOT_FOUND"
    );
  }

  await tool.execute(payload);
}