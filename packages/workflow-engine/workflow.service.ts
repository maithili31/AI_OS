import { initDB } from "../memory/index.ts";

export async function createWorkflow(
  workflow: any
) {

  const db = await initDB();

  await db.run(
    `
    INSERT INTO workflows (
      id,
      trigger_type,
      conditions,
      actions,
      enabled,
      created_at
    )

    VALUES (?, ?, ?, ?, ?, ?)
    `,

    workflow.id,

    workflow.trigger,

    JSON.stringify(
      workflow.conditions
    ),

    JSON.stringify(
      workflow.actions
    ),

    1,

    Date.now()
  );
}

export async function listWorkflows() {

    const db = await initDB();
  
    const workflows =
      await db.all(
        `SELECT * FROM workflows`
      );
  
    return workflows.map(
      (workflow: any) => ({
  
        id: workflow.id,
  
        trigger:
          workflow.trigger_type,
  
        conditions:
          JSON.parse(
            workflow.conditions
          ),
  
        actions:
          JSON.parse(
            workflow.actions
          ),
  
        enabled:
          Boolean(
            workflow.enabled
          ),
  
        createdAt:
          workflow.created_at
      })
    );
  }

export async function deleteWorkflow(
    workflowId: string
){ 
    const db = await initDB();
    await db.run(
      `
      DELETE FROM workflows
      WHERE id = ?
      `,
      workflowId
    );
}

export async function disableWorkflow(
    workflowId: string
){
    const db = await initDB();
  
    await db.run(
      `
      UPDATE workflows
      SET enabled = 0
      WHERE id = ?
      `,
      workflowId
    );
}

export async function enableWorkflow(
  workflowId: string
) {

  const db = await initDB();

  await db.run(
    `
    UPDATE workflows

    SET enabled = 1

    WHERE id = ?
    `,
    workflowId
  );
}