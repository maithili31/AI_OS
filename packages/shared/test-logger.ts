import { logger }
from "./index.ts";

logger.info(
  "EVENT_QUEUED",
  {
    eventType: "gmail.new_email"
  }
);

logger.warn(
  "RETRYING_EVENT",
  {
    retryCount: 2
  }
);

logger.error(
  "EVENT_FAILED",
  {
    workflowId: "1"
  }
);