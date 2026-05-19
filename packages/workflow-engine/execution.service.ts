import { initDB }
from "../memory/index.ts";

export async function listExecutions() {

  const db = await initDB();

  return await db.all(
    `
    SELECT *
    FROM executions

    ORDER BY started_at DESC
    `
  );
}