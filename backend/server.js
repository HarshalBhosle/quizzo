import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
const app = express();

// ✅ Allow requests from your Vercel frontend
app.use(
  cors({
    origin: [
      "https://quizzo-git-main-harshalbhosles-projects.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ Quizzo backend is running smoothly.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
