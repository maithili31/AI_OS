import {

    keyboard,
  
    Key
  
  }
  
  from "@nut-tree-fork/nut-js";
  
  import { Tool }
  from "./index.ts";
  
  export class PressKeysTool
    implements Tool {
  
    name = "press_keys";
  
    description =
      "Press keyboard shortcuts";
  
    parameters = [
  
      {
        name: "keys",
  
        type: "string[]",
  
        description:
          "Keys to press",
  
        required: true
      }
    ];
  
    private keyMap:
      Record<string, Key> = {
  
      enter:
        Key.Enter,
  
      tab:
        Key.Tab,
  
      escape:
        Key.Escape,
  
      space:
        Key.Space,
  
      up:
        Key.Up,
  
      down:
        Key.Down,
  
      left:
        Key.Left,
  
      right:
        Key.Right,
  
      ctrl:
        Key.LeftControl,
  
      shift:
        Key.LeftShift,
  
      alt:
        Key.LeftAlt,
  
      windows:
        Key.LeftSuper,
  
      s:
        Key.S,
  
      l:
        Key.L,
  
      c:
        Key.C,
  
      v:
        Key.V,
  
      a:
        Key.A
    };
  
    async execute(
      input: any
    ) {
  
      let keys =
        input.keys;
  
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
            "keys"
          ) {
  
            keys =
              param.value;
          }
        }
      }
  
      if (!keys) {
  
        throw new Error(
          "Keys missing"
        );
      }
  
      if (
        typeof keys ===
        "string"
      ) {
  
        keys =
          keys
  
            .split("+")
  
            .map(
              (k: string) =>
                k.trim()
            );
      }
  
      const mappedKeys =
  
        keys.map(
          (key: string) => {
  
            const mapped =
              this.keyMap[
                key.toLowerCase()
              ];
  
            if (!mapped) {
  
              throw new Error(
                `Unsupported key:
                 ${key}`
              );
            }
  
            return mapped;
          }
        );
  
      console.log(
        "PRESSING KEYS:",
        keys
      );
  
      await keyboard.pressKey(
        ...mappedKeys
      );
  
      await keyboard.releaseKey(
        ...mappedKeys.reverse()
      );
  
      return {
  
        success: true,
  
        keys
      };
    }
  }
  
  export const pressKeysTool =
    new PressKeysTool();