import {
    toolRegistry
  } from "./registry.ts";
  
  export function describeTools() {
  
    return toolRegistry.map(tool => {
  
      return `
  
  TOOL:
  ${tool.name}
  
  DESCRIPTION:
  ${tool.description}
  
  PARAMETERS:
  ${JSON.stringify(
    tool.parameters || [],
    null,
    2
  )}
  `;
    }).join("\n");
  }