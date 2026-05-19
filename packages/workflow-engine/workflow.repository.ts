import { initDB } from "../memory/index.ts";

export async function getWorkflows() {

  const db = await initDB();

  const workflows =
    await db.all(

      `SELECT *
       FROM workflows
       WHERE enabled = 1`
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
        )
    })
  );
}