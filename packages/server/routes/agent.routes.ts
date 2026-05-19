import { Router } from "express";

import {
  planCommand,
  executePlannedTask
} from "../controllers/agent.controller.ts";

const router = Router();

router.post(
  "/plan",
  planCommand
);

router.post(
    "/execute",
    executePlannedTask
  );

export default router;