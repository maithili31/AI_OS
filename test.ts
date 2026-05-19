import { eventBus }
from "./packages/workflow-engine/index.ts";

async function run() {

  await eventBus.emitEvent({

    type: "gmail.new_email",

    payload: {

      from:
        "recruiter@google.com",

      subject:
        "Interview Opportunity",

      body:
        "We would like to interview you."

    },

    timestamp: Date.now()

  });
}

run();