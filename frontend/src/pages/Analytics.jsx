import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    avgScore: 0,
    attempts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({}); // For toggling Q&A

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/api/analytics/me");
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleQuestions = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteAnalysis = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this analysis?"))
      return;
    try {
      await api.delete(`/api/analytics/${id}`);
      setAnalytics((prev) => ({
        ...prev,
        attempts: prev.attempts.filter((a) => a._id !== id),
      }));
      alert("✅ Analysis deleted successfully!");
    } catch (err) {
      console.error("Error deleting analysis:", err);
      alert("❌ Failed to delete analysis!");
    }
  };

  if (loading)
    return (
      <p className="p-8 text-gray-400 text-center animate-pulse">
        Loading analytics...
      </p>
    );
  if (error) return <p className="p-8 text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        📊 Quiz Analytics
      </h1>

      <div className="bg-gray-800/70 border border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-4xl mb-8">
        <p className="text-lg">
          <span className="text-cyan-400 font-semibold">Total Attempts:</span>{" "}
          {analytics.totalAttempts}
        </p>
        <p className="text-lg">
          <span className="text-cyan-400 font-semibold">Average Score:</span>{" "}
          {analytics.avgScore.toFixed(2)}
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-5">
        {analytics.attempts.length > 0 ? (
          analytics.attempts.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/70 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-pink-400/40 transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-purple-400">
                  {a.quiz?.title || "Untitled Quiz"}
                </h3>
                <p className="text-sm text-gray-400">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <p className="mt-2">
                Score:{" "}
                <span className="font-bold text-green-400">{a.score}</span>
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => toggleQuestions(a._id)}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm transition"
                >
                  {expanded[a._id] ? "Hide Questions" : "Show Questions"}
                </button>
                <button
                  onClick={() => handleDeleteAnalysis(a._id)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm transition"
                >
                  🗑️ Delete Analysis
                </button>
              </div>

              {expanded[a._id] && a.quiz?.questions && (
                <div className="mt-4 bg-gray-800/70 border border-gray-700 rounded-lg p-4 text-gray-300">
                  {a.quiz.questions.map((q, qi) => (
                    <div key={qi} className="mb-4">
                      <p className="font-semibold text-cyan-400">
                        {qi + 1}. {q.question}
                      </p>
                      <ul className="list-disc ml-6 mt-1">
                        {q.options.map((opt, oi) => (
                          <li
                            key={oi}
                            className={`${
                              opt === q.answer
                                ? "text-green-400 font-medium"
                                : "text-gray-400"
                            }`}
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                      <hr className="border-gray-700 mt-3" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No attempts yet 💤</p>
        )}
      </div>
    </div>
  );
}
