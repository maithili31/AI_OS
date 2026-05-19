import express from "express";
import cors from "cors";
import workflowRoutes from "./routes/workflow.routes.ts";
import executionRoutes from "./routes/execution.routes.ts";
import dlqRoutes from "./routes/dlq.routes.ts";
import agentRoutes from "./routes/agent.routes.ts";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/agent",
  agentRoutes
);

app.use(
  "/workflows",
  workflowRoutes
);

app.use(
  "/executions",
  executionRoutes
);

app.use(
  "/dlq",
  dlqRoutes
);

const PORT = 3000;

app.listen(PORT, () => {

  console.log(
    `SERVER RUNNING ON PORT ${PORT}`
  );
});