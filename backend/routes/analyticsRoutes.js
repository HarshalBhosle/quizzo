import express from "express";
import { getAnalytics, deleteAnalysis } from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/analytics/me
// Returns analytics for the logged-in user
router.get("/me", verifyToken, getAnalytics);
router.delete("/:id", verifyToken, deleteAnalysis);

// (Optional) admin endpoints to fetch global analytics could be added

export default router;
