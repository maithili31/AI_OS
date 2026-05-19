import { Router }
from "express";

import {
  getExecutions
} from "../controllers/execution.controller.ts";

const router = Router();

router.get(
  "/",
  getExecutions
);

export default router;