import Attempt from "../models/Attempt.js";
import { adjustDifficulty } from "../utils/adaptiveAlgo.js";

export const submitAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    const score = (correctAnswers / totalQuestions) * 100;

    const attempt = await Attempt.create({
      user: req.user.id,
      quiz: quizId,
      correctAnswers,
      totalQuestions,
      score,
      answers,
    });

    const nextDifficulty = adjustDifficulty(score);
    res.json({ message: "Attempt saved", nextDifficulty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
