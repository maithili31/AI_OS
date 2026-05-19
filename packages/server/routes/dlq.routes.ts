import { Router } from "express";

import { getDLQEvents } from "../controllers/dlq.controller.ts";

const router = Router();

router.get(
  "/",
  getDLQEvents
);

export default router;