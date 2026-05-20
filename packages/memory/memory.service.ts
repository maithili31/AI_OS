import crypto from "crypto";

import { initDB }
from "./index.ts";

export async function saveMemory(

  type: string,

  content: string,

  metadata: any = {}
) {

  const db =
    await initDB();

  const id =
    crypto.randomUUID();

  await db.run(

    `
    INSERT INTO memories (

      id,
      type,
      content,
      metadata,
      created_at

    )

    VALUES (?, ?, ?, ?, ?)
    `,

    id,

    type,

    content,

    JSON.stringify(
      metadata
    ),

    Date.now()
  );

  console.log(
    "MEMORY SAVED:",
    content
  );
}

export async function getRecentMemories(

  limit = 10
) {

  const db =
    await initDB();

  return db.all(

    `
    SELECT *
    FROM memories

    ORDER BY created_at DESC

    LIMIT ?
    `,

    limit
  );
}