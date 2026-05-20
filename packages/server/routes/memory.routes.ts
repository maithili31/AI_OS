import express
from "express";

import {
  getRecentMemories
}
from "../../memory/memory.service.ts";

const router =
  express.Router();

router.get(
  "/",

  async (_req, res) => {

    const memories =
      await getRecentMemories();

    res.json(memories);
  }
);

export default router;