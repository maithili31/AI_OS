import {
    createWorkflow,  
    listWorkflows,  
    disableWorkflow,
    deleteWorkflow,
    enableWorkflow
  
  } from "../../workflow-engine/workflow.service.ts";
  
  export async function getAllWorkflows(
    req: any,
    res: any
  ) {
  
    const workflows =
      await listWorkflows();
  
    res.json(workflows);
  }
  
  export async function createWorkflowHandler(
    req: any,
    res: any
  ) {
  
    await createWorkflow(
      req.body
    );
  
    res.json({
      success: true
    });
  }
  
  export async function disableWorkflowHandler(
    req: any,
    res: any
  ) {
  
    await disableWorkflow(
      req.params.id
    );
  
    res.json({
      success: true
    });
  }
  
  export async function deleteWorkflowHandler(
    req: any,
    res: any
  ) {
  
    await deleteWorkflow(
      req.params.id
    );
  
    res.json({
      success: true
    });
  }

  export async function enableWorkflowHandler(
    req: any,
    res: any
  ) {
  
    await enableWorkflow(
      req.params.id
    );
  
    res.json({
      success: true
    });
  }