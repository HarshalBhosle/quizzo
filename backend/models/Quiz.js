import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },

    // ⏱️ Optional timer field (in seconds)
    timer: {
      type: Number,
      default: 0, // 0 = no timer
    },

    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String }],
        answer: { type: String, required: true },
      },
    ],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
