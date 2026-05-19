import { initDB }
from "../memory/index.ts";

export async function addToDLQ(
  event: any,
  error: any
) {

  const db = await initDB();

  await db.run(
    `
    INSERT INTO dead_letter_queue
    (
      event_type,
      payload,
      error,
      retry_count,
      failed_at
    )

    VALUES (?, ?, ?, ?, ?)
    `,

    event.type,

    JSON.stringify(
      event.payload
    ),

    error.message,

    event.retryCount || 0,

    Date.now()
  );
}

export async function listDLQEvents() {
  const db = await initDB();

  return await db.all(
    `
    SELECT *
    FROM dead_letter_queue

    ORDER BY failed_at DESC
    `
  );
}