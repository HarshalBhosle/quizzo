import express from "express";
import { createQuiz, getAllQuizzes, getQuizById, saveAttempt } from "../controllers/quizController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protected route - only logged-in users can create quizzes
router.post("/create", verifyToken, createQuiz);

// Fetch all quizzes
router.get("/myquizzes", verifyToken, getAllQuizzes);

// Fetch single quiz by ID
router.get("/:id", getQuizById);
router.post("/attempt", verifyToken, saveAttempt);

export default router;



