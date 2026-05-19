// import { planTask } from "../../agent/planner.ts";
// import { sendEmailTool } from "../../tools/index.ts";

// export async function planCommand(
//   req: any,
//   res: any
// ) {

//   const { command } =
//     req.body;

//   const result =
//     await planTask(command);

//   res.json(result);
// }

// export async function executePlannedTask(
//     req: any,
//     res: any
//   ) {
  
//     const task =
//       req.body;
  
//     if (
//       task.intent ===
//       "send_email"
//     ) {
  
//       await sendEmailTool.execute(
  
//         task.recipient,
  
//         task.subject,
  
//         task.body
//       );
//     }
  
//     res.json({
//       success: true
//     });
//   }

import { planTask }
from "../../agent/planner.ts";

import {
  executeTool
} from "../../tools/executor.ts";

export async function planCommand(

  req: any,

  res: any
) {

  try {

    const { command } =
      req.body;

    if (!command) {

      return res.status(400).json({

        success: false,

        error:
          "Command is required"
      });
    }

    console.log(
      "PLANNING COMMAND:",
      command
    );

    const result =
      await planTask(command);

    console.log(
      "PLANNED TASK:",
      result
    );

    res.json(result);

  } catch (error: any) {

    console.error(
      "PLAN COMMAND ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      error:
        error.message
    });
  }
}

export async function executePlannedTask(

  req: any,

  res: any
) {

  try {

    const task =
      req.body;

    if (!task.intent) {

      return res.status(400).json({

        success: false,

        error:
          "Task intent missing"
      });
    }

    console.log(
      "EXECUTING TASK:",
      task
    );

    const result =
      await executeTool(

        task.intent,

        task
      );

    console.log(
      "TASK EXECUTED SUCCESSFULLY"
    );

    res.json({

      success: true,

      result
    });

  } catch (error: any) {

    console.error(
      "TASK EXECUTION ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      error:
        error.message
    });
  }
}