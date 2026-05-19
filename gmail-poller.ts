import { readEmails }
from "./packages/tools/gmail.tool.ts";

async function startPoller() {

  console.log(
    "GMAIL POLLER STARTED"
  );

  await readEmails();

  setInterval(async () => {

    console.log(
      "\nCHECKING FOR NEW EMAILS..."
    );

    await readEmails();

  }, 15000);
}

startPoller();