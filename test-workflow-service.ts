import {
    createWorkflow,
    listWorkflows,
    disableWorkflow
  } from "./packages/workflow-engine/workflow.service.ts";
  
  async function run() {
  
    await createWorkflow({
  
      id: "test-workflow",
  
      trigger: "gmail.new_email",
  
      conditions: [
        {
          field: "from",
          contains: "@"
        }
      ],
  
      actions: [
        "notify_user"
      ]
    });
  
    const workflows =
      await listWorkflows();
  
    console.log(workflows);
  
    await disableWorkflow(
      "test-workflow"
    );
  
    console.log(
      "WORKFLOW DISABLED"
    );
  }
  
  run();