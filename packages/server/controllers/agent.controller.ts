import { planTask } from "../../agent/planner.ts";
import { executeTool } from "../../tools/executor.ts";
import { saveMemory } from "../../memory/memory.service.ts";
import { saveVectorMemory } from "../../memory/vector-memory.service.ts";

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

    if (

      !task.steps ||

      !Array.isArray(
        task.steps
      )

    ) {

      return res.status(400).json({

        success: false,

        error:
          "No execution steps found"
      });
    }

    console.log(
      "EXECUTING TASK:",
      task
    );

    const results: any[] = [];

    for (
      const step
      of task.steps
    ) {

      console.log(
        "EXECUTING STEP:",
        step.intent
      );

      const result =
        await executeTool(

          step.intent,

          step
        );

      results.push({

        intent:
          step.intent,

        result
      });
    }

    console.log(
      "TASK EXECUTED SUCCESSFULLY"
    );
    await saveMemory(

      "task_execution",
    
      `Executed command:
       ${JSON.stringify(task)}`,
    
      {
        task,
        results
      }
    );

    await saveVectorMemory(

      JSON.stringify(task),
    
      {
        task,
        results
      }
    );

    res.json({

      success: true,

      results
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