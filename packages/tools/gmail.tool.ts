import { google } from "googleapis";
import { authorize } from "./gmail-auth.ts";
import { initDB } from "../memory/index.ts";
import { eventBus } from "../workflow-engine/index.ts";

export async function readEmails() {

  const auth = await authorize();

  const gmail =
    google.gmail({
      version: "v1",
      auth
    });
  
  const db = await initDB();

  const response =
    await gmail.users.messages.list({

      userId: "me",

      maxResults: 5
    });

  const messages =
    response.data.messages || [];

  console.log(
    `FOUND ${messages.length} EMAILS`
  );

  for (const message of messages) {

    const existing = await db.get(
  
      `SELECT * FROM processed_emails
       WHERE id = ?`,
  
      message.id
    );
  
    if (existing) {
  
      console.log(
        `SKIPPING DUPLICATE:
  ${message.id}`
      );
  
      continue;
    }
  
    const email =
      await gmail.users.messages.get({
  
        userId: "me",
  
        id: message.id!
      });
  
    const headers =
      email.data.payload?.headers || [];
  
      const subject =
      headers.find(
        h => h.name === "Subject"
      )?.value || "No Subject";
    
    const from =
      headers.find(
        h => h.name === "From"
      )?.value || "Unknown Sender";
  
    console.log("\nEMAIL:");
  
    console.log("FROM:", from);
  
    console.log("SUBJECT:", subject);
  
    await eventBus.emitEvent({
  
      type: "gmail.new_email",
  
      payload: {
  
        from,
  
        subject,
  
        body:
          email.data.snippet
  
      },
  
      timestamp: Date.now()
  
    });
  
    await db.run(
  
      `INSERT INTO processed_emails
       (id)
  
       VALUES (?)`,
  
      message.id
    );
  }
}