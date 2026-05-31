import { keyboard, Key, sleep } from "@nut-tree-fork/nut-js";
import { Tool } from "./index.ts";

export class PressKeysTool implements Tool {
  name = "press_keys";
  description = "Press keyboard shortcuts and key combinations";
  parameters = [
    {
      name: "keys",
      type: "string",
      description: "Key combination",
      required: true
    }
  ];

  private keyMap: Record<string, Key> = {
    enter: Key.Enter,
    tab: Key.Tab,
    escape: Key.Escape,
    esc: Key.Escape,
    space: Key.Space,
    up: Key.Up,
    down: Key.Down, 
    left: Key.Left,
    right: Key.Right,
    backspace: Key.Backspace,
    delete: Key.Delete, 
    ctrl: Key.LeftControl,
    control: Key.LeftControl,
    shift: Key.LeftShift,
    alt: Key.LeftAlt,
    windows: Key.LeftSuper,
    win: Key.LeftSuper,
    super:Key.LeftSuper,
    a: Key.A,
    b: Key.B,
    c: Key.C,
    d: Key.D,
    e: Key.E,
    f: Key.F,
    g: Key.G,
    h: Key.H,
    i: Key.I,
    j: Key.J,
    k: Key.K,
    l: Key.L,
    m: Key.M,
    n: Key.N,
    o: Key.O,
    p: Key.P,
    q: Key.Q,
    r: Key.R,
    s: Key.S,
    t: Key.T,
    u: Key.U,
    v: Key.V,
    w: Key.W,
    x: Key.X,
    y: Key.Y,
    z: Key.Z
  };

  normalizeKeys(keys: string){
    return keys
      .toLowerCase()
      .replace(
        /\s+/g,
        " "
      )
      .replace(
        /\s*\+\s*/g,
        "+"
      )
      .trim();
  }

  extractRepeatCount(keys: string){
    if (keys.includes("twice")){
      return 2;
    }

    const match =
      keys.match(
        /(\d+)\s*times?/
      );

    if (match) {
      return parseInt(match[1]);
    }
    return 1;
  }

  removeRepeatWords(keys: string){
    return keys
      .replace(
        /\btwice\b/gi,
        ""
      )
      .replace(
        /\d+\s*times?/gi,
        ""
      )
      .trim();
  }

  async execute(input: any){
    let keys = input.keys;
    if ( input.parameters && Array.isArray(input.parameters)){
      for (const param of input.parameters){
        if (param.name === "keys"){
          keys = param.value;
        }
      }
    }
    if (!keys) {
      throw new Error("Keys missing");
    }

    keys = this.normalizeKeys(keys);

    const repeatCount = this.extractRepeatCount(keys);

    keys = this.removeRepeatWords(keys);

    let keyParts: string[] = [];

    if (keys.includes("+")){
      keyParts = keys.split("+");
    } else {
      keyParts = keys.split(" ");
    }

    keyParts =
      keyParts
        .map(key => key.trim())
        .filter(Boolean);

    const mappedKeys = keyParts.map( key => {
        const mapped = this.keyMap[key];
        if (!mapped) {
          throw new Error(`Unsupported key: ${key}`);
        }
        return mapped;
      }
    );

    for (let i = 0; i < repeatCount; i++){
      await keyboard.pressKey(
        ...mappedKeys
      );
      await sleep(100);
      await keyboard.releaseKey(
        ...mappedKeys.reverse()
      );
      await sleep(150);
    }

    return {
      success: true,
      keys: keyParts,
      repeatCount
    };
  }
}

export const pressKeysTool = new PressKeysTool();