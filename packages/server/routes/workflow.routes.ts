import { Router }
from "express";

import {
  getAllWorkflows,
  createWorkflowHandler,
  disableWorkflowHandler,
  deleteWorkflowHandler,
  enableWorkflowHandler
} from "../controllers/workflow.controller.ts";

const router = Router();

router.get(
  "/",
  getAllWorkflows
);

router.post(
  "/",
  createWorkflowHandler
);

router.patch(
  "/:id/disable",
  disableWorkflowHandler
);

router.delete(
  "/:id",
  deleteWorkflowHandler
);

router.patch(
  "/:id/enable",
  enableWorkflowHandler
);

export default router;