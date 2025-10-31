import express from "express";
import { submitAttempt } from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/attempt/submit
// Body: { quizId, answers: [{ question, selectedOption, isCorrect, difficulty }, ...] }
router.post("/submit", protect, submitAttempt);

// (Optional) GET attempts for a user or quiz could be added here

export default router;
