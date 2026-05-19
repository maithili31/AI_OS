import { initDB }
from "./packages/memory/index.ts";

async function run() {

  const db = await initDB();

  await db.run(

    `INSERT INTO event_logs
     (event_type, payload, timestamp)

     VALUES (?, ?, ?)`,
    
    "gmail.new_email",

    JSON.stringify({
      from: "recruiter@google.com"
    }),

    Date.now()
  );

  console.log(
    "EVENT SAVED TO DB"
  );

  const rows =
    await db.all(
      "SELECT * FROM event_logs"
    );

  console.log("\nDATABASE ROWS:");

  console.log(rows);
}

run();