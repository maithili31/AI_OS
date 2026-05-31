import { keyboard, Key, sleep } from "@nut-tree-fork/nut-js";
import { Tool } from "./index.ts";

export class TypeTextTool implements Tool {
  name = "type_text";
  description = "Type text using keyboard automation";

  parameters = [
    {
      name: "text",
      type: "string",
      description: "Text to type",
      required: true
    }
  ];

  /**
   * Safe action-suffix configuration map for trailing control key presses
   */
  private keyActionMap = [
    { token: "and press enter", key: Key.Enter, actionName: "enter" },
    { token: "and press tab", key: Key.Tab, actionName: "tab" },
    { token: "and press escape", key: Key.Escape, actionName: "escape" },
  ];

  async execute(input: any) {
    let text = input.text;

    // Safely extract text parameter from envelope array if matching format exists
    if (input.parameters && Array.isArray(input.parameters)) {
      const textParam = input.parameters.find((param: any) => param.name === "text");
      if (textParam) {
        text = textParam.value;
      }
    }

    if (!text) {
      throw new Error("Text missing");
    }

    console.log("TYPING INPUT:", text);

    // Context synchronization stabilization delay
    await sleep(1000);

    const lowerText = text.toLowerCase();

    // Check for matched key trigger actions dynamically
    for (const action of this.keyActionMap) {
      if (lowerText.includes(action.token)) {
        const cleanText = text
          .replace(new RegExp(action.token, "gi"), "")
          .trim();

        if (cleanText) {
          await keyboard.type(cleanText);
          await sleep(300);
        }

        await keyboard.pressKey(action.key);
        await keyboard.releaseKey(action.key);

        return {
          success: true,
          typed: cleanText,
          action: action.actionName
        };
      }
    }

    // Default Fallback: Regular string typing literal
    await keyboard.type(text);

    return {
      success: true,
      typed: text
    };
  }
}

export const typeTextTool = new TypeTextTool();