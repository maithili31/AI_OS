import {

    mouse,
  
    Button,
  
    Point,
  
    sleep
  
  }
  
  from "@nut-tree-fork/nut-js";
  
  import { Tool }
  from "./index.ts";
  
  export class MouseClickTool
    implements Tool {
  
    name = "mouse_click";
  
    description =
      "Move mouse to coordinates and click";
  
    parameters = [
  
      {
        name: "x",
  
        type: "number",
  
        description:
          "X coordinate",
  
        required: true
      },
  
      {
        name: "y",
  
        type: "number",
  
        description:
          "Y coordinate",
  
        required: true
      }
    ];
  
    async execute(
      input: any
    ) {
  
      let x =
        input.x;
  
      let y =
        input.y;
  
      /*
      =========================================
      PARAMETER EXTRACTION
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
            "x"
          ) {
  
            x =
              Number(
                param.value
              );
          }
  
          if (
            param.name ===
            "y"
          ) {
  
            y =
              Number(
                param.value
              );
          }
        }
      }
  
      /*
      =========================================
      VALIDATION
      =========================================
      */
  
      if (
        x === undefined ||
        y === undefined
      ) {
  
        throw new Error(
          "Mouse coordinates missing"
        );
      }
  
      console.log(
        `MOVING MOUSE TO:
         ${x}, ${y}`
      );
  
      /*
      =========================================
      MOVE
      =========================================
      */
  
      await mouse.move(
  
        new Point(
          x,
          y
        )
      );
  
      await sleep(500);
  
      /*
      =========================================
      CLICK
      =========================================
      */
  
      console.log(
        "CLICKING..."
      );
  
      await mouse.click(
        Button.LEFT
      );
  
      console.log(
        "CLICK COMPLETE"
      );
  
      return {
  
        success: true,
  
        x,
  
        y
      };
    }
  }
  
  export const mouseClickTool =
    new MouseClickTool();