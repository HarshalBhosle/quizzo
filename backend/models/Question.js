import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
