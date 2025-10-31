import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    score: Number,
    correctAnswers: Number,
    totalQuestions: Number,
    answers: [
      {
        question: String,
        selectedOption: String,
        isCorrect: Boolean,
        difficulty: String,
      },
    ],
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt
);

const Attempt = mongoose.model("Attempt", attemptSchema);
export default Attempt;
