import { executeTool } from "../tools/executor.ts";
import { ExecutionContext } from "./execution-context.ts";
  
function injectContext(

  value: any,

  context: any

) {

  if (
    typeof value !==
    "string"
  ) {

    return value;
  }

  return value.replace(

    /\{\{(.*?)\}\}/g,

    (_, key) => {

      const keys =
        key.trim().split(".");

      let current =
        context;

      for (
        const k of keys
      ) {

        current =
          current?.[k];
      }

      return current ?? "";
    }
  );
}

export async function executeWorkflow(task: any){
  if ( !task.steps || !Array.isArray(task.steps)) {
      throw new Error(
        "No execution steps found"
      );
  }
  
    const results = [];
    const context = new ExecutionContext();
  
    for (const step of task.steps){
      for (const key in step){
        step[key] =
          injectContext(
            step[key],
            context.getAll()
          );
      }

      console.log("EXECUTING STEP:", step.intent);
      // optional delay
      if (step.delay){
        console.log(`WAITING ${step.delay}ms`);
        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              step.delay
            )
        );
      }
  
      // retries
      const retryCount = step.retry || 1;
      let lastError: any;
      let success = false;
      for (let attempt = 1; attempt <= retryCount; attempt++){
        try {
          console.log(`ATTEMPT ${attempt}`);
          const result = await executeTool(
            step.intent,
            step
          );

          context.set(
            step.intent,
            result
          );
            
          context.set(
            "last_result",
            result
          );
  
          results.push({
            intent:
              step.intent,
  
            success:
              true,
  
            result
          });
  
          success = true;
  
          break;
  
        } catch (error: any) {
  
          console.error(
            `STEP FAILED:
             ${step.intent}`
          );
  
          console.error(
            error.message
          );
  
          lastError =
            error;
        }
      }
      // final failure
      if (!success) {
        results.push({
          intent: step.intent,
          success: false,
          error: lastError?.message
        });
        throw new Error(
          `Workflow failed at:
           ${step.intent}`
        );
      }
    }
  
    return {
      success: true,
      results
    };
  }