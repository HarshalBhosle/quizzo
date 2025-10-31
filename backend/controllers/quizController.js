import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, topic, questions } = req.body;

    if (!title || !topic || !questions?.length) {
      return res.status(400).json({ message: "Title, topic, and questions are required" });
    }

    const quiz = new Quiz({
      title,
      topic,
      questions,
      user: req.user.id, // ✅ Link quiz to the logged-in user
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ NEW: Fetch single quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const saveAttempt = async (req, res) => {
  try {
    const { quiz, score, correctAnswers, totalQuestions, answers } = req.body;
    const attempt = new Attempt({
      user: req.user.id,
      quiz,
      score,
      correctAnswers,
      totalQuestions,
      answers,
    });
    await attempt.save();
    res.status(201).json({ message: "Attempt saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
