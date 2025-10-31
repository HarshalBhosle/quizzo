import Attempt from "../models/Attempt.js";

export const getAnalytics = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user.id }).populate("quiz");

    if (!attempts.length) {
      return res.json({ totalAttempts: 0, avgScore: 0, attempts: [] });
    }

    const totalScore = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
    const avgScore = totalScore / attempts.length;

    res.json({ totalAttempts: attempts.length, avgScore, attempts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Analysis not found" });

    if (attempt.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await attempt.deleteOne();
    res.json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({ message: error.message });
  }
};
