import { initDB }
from "./packages/memory/index.ts";

async function seed() {

  const db = await initDB();

  await db.run(
    `
    INSERT OR REPLACE INTO workflows (
      id,
      trigger_type,
      conditions,
      actions,
      enabled,
      created_at
    )

    VALUES (?, ?, ?, ?, ?, ?)
    `,

    "1",

    "gmail.new_email",

    JSON.stringify([
      {
        field: "from",
        contains: "@"
      }
    ]),

    JSON.stringify([
      "notify_user",
      "save_email",
      "summarize_email"
    ]),

    1,

    Date.now()
  );

  console.log(
    "WORKFLOW SEEDED"
  );
}

seed();