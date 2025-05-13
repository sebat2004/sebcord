import express from "express";

import { MessageResponse } from "../interfaces/MessageResponse";
import emojis from "./emojis";
import user from "./user";
import friends from "./friends";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

// router.use("/emojis", emojis);
router.use("/user", user);
router.use("/friends", friends);

export default router;
