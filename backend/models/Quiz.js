import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ add this
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
