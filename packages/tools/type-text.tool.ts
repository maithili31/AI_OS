// import { keyboard, Key, sleep } from "@nut-tree-fork/nut-js";
// import { Tool } from "./index.ts";
  
//   export class TypeTextTool
//     implements Tool {
  
//     name = "type_text";
  
//     description =
//       "Type text using keyboard automation";
  
//     parameters = [
  
//       {
//         name: "text",
  
//         type: "string",
  
//         description:
//           "Text to type",
  
//         required: true
//       }
//     ];
  
//     async execute(
//       input: any
//     ) {
    
//       let text =
//         input.text;
    
//       if (
//         input.parameters &&
//         Array.isArray(
//           input.parameters
//         )
//       ) {
    
//         for (
//           const param
//           of input.parameters
//         ) {
    
//           if (
//             param.name ===
//             "text"
//           ) {
    
//             text =
//               param.value;
//           }
//         }
//       }
    
//       if (!text) {
    
//         throw new Error(
//           "Text missing"
//         );
//       }
    
//       console.log(
//         "TYPING TEXT:",
//         text
//       );
    
//       /*
//       =========================================
//       STABILIZATION DELAY
//       =========================================
//       */
    
//       await sleep(20000);
    
//       /*
//       =========================================
//       TYPE CHARACTER BY CHARACTER
//       =========================================
//       */
    
//       for ( const char of text) {
//         await keyboard.type( char);
//         await sleep(2000);
//       }
    
//       return {
//         success: true,
//         typed:
//           text
//       };
//     }
//   }
  
//   export const typeTextTool =
//     new TypeTextTool();

import {

  keyboard,

  sleep

}

from "@nut-tree-fork/nut-js";

import { Tool }
from "./index.ts";

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
      "TYPING TEXT:",
      text
    );

    /*
    =========================================
    WAIT FOR WINDOW FOCUS
    =========================================
    */

    console.log(
      "FOCUS TARGET WINDOW NOW..."
    );

    await sleep(5000);

    /*
    =========================================
    TYPE CHARACTER BY CHARACTER
    =========================================
    */

    for (
      const char
      of text
    ) {

      await keyboard.type(
        char
      );

      await sleep(80);
    }

    return {

      success: true,

      typed:
        text
    };
  }
}

export const typeTextTool =
  new TypeTextTool();