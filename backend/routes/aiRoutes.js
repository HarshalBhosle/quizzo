import express from "express";
import { generateAIResponse } from "../controllers/aiController.js";

const router = express.Router();

// POST /ai/generate
router.post("/generate", generateAIResponse);

export default router;
