import { keyboard, Key ,sleep } from "@nut-tree-fork/nut-js";
import { Tool } from "./index.ts";

export class TypeTextTool
  implements Tool {

  name = "type_text";

  description =
    "Type text using keyboard automation";

  parameters = [

    {
      name: "text",

      type: "string",

      description:
        "Text to type",

      required: true
    }
  ];

  async execute(
    input: any
  ) {
  
    let text =
      input.text;
  
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
          "text"
        ) {
  
          text =
            param.value;
        }
      }
    }
  
    if (!text) {
  
      throw new Error(
        "Text missing"
      );
    }
  
    console.log(
      "TYPING INPUT:",
      text
    );
  
    /*
    =========================================
    STABILIZATION DELAY
    =========================================
    */
  
    await sleep(1000);
  
    /*
    =========================================
    SPECIAL KEY DETECTION
    =========================================
    */
  
    const lowerText =
      text.toLowerCase();
  
    /*
    =========================================
    ENTER
    =========================================
    */
  
    if (
      lowerText.includes(
        "and press enter"
      )
    ) {
  
      const cleanText =
  
        text.replace(
          /and press enter/gi,
          ""
        ).trim();
  
      await keyboard.type(
        cleanText
      );
  
      await sleep(300);
  
      await keyboard.pressKey(
        Key.Enter
      );
  
      await keyboard.releaseKey(
        Key.Enter
      );
  
      return {
  
        success: true,
  
        typed:
          cleanText,
  
        action:
          "enter"
      };
    }
  
    /*
    =========================================
    TAB
    =========================================
    */
  
    if (
      lowerText.includes(
        "and press tab"
      )
    ) {
  
      const cleanText =
  
        text.replace(
          /and press tab/gi,
          ""
        ).trim();
  
      await keyboard.type(
        cleanText
      );
  
      await sleep(300);
  
      await keyboard.pressKey(
        Key.Tab
      );
  
      await keyboard.releaseKey(
        Key.Tab
      );
  
      return {
  
        success: true,
  
        typed:
          cleanText,
  
        action:
          "tab"
      };
    }
  
    /*
    =========================================
    ESCAPE
    =========================================
    */
  
    if (
      lowerText.includes(
        "and press escape"
      )
    ) {
  
      const cleanText =
  
        text.replace(
          /and press escape/gi,
          ""
        ).trim();
  
      await keyboard.type(
        cleanText
      );
  
      await sleep(300);
  
      await keyboard.pressKey(
        Key.Escape
      );
  
      await keyboard.releaseKey(
        Key.Escape
      );
  
      return {
  
        success: true,
  
        typed:
          cleanText,
  
        action:
          "escape"
      };
    }
  
    /*
    =========================================
    NORMAL TYPING
    =========================================
    */
  
    await keyboard.type(
      text
    );
  
    return {
  
      success: true,
  
      typed:
        text
    };
  }
}

export const typeTextTool =
  new TypeTextTool();