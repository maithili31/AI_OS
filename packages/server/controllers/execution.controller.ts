import { listExecutions }
from "../../workflow-engine/execution.service.ts";

export async function getExecutions(
  req: any,
  res: any
) {

  const executions =
    await listExecutions();

  res.json(executions);
}