import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";
import {
  BarChart3,
  Trophy,
  Brain,
  TrendingUp,
  Clock,
  Trash2,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    avgScore: 0,
    attempts: [],
  });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/api/analytics/me");
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const toggleQuestions = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteAnalysis = async (id) => {
    if (!window.confirm("🗑️ Delete this analysis permanently?")) return;
    try {
      await api.delete(`/api/analytics/${id}`);
      setAnalytics((prev) => ({
        ...prev,
        attempts: prev.attempts.filter((a) => a._id !== id),
      }));
      alert("✅ Deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-400 text-lg animate-pulse">
        Fetching your futuristic insights...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-lg">
        {error}
      </div>
    );

  const chartData = analytics.attempts.map((a) => ({
    name: a.quiz?.title || "Quiz",
    score: a.score,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#111827] to-[#1a103d] text-white px-6 py-10 flex flex-col items-center">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wide"
      >
        🚀 Performance Analytics
      </motion.h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full max-w-6xl">
        <StatCard
          icon={<Trophy className="text-yellow-400" size={28} />}
          title="Total Attempts"
          value={analytics.totalAttempts}
          gradient="from-yellow-500/20 to-orange-500/10"
        />
        <StatCard
          icon={<Brain className="text-pink-400" size={28} />}
          title="Average Score"
          value={`${analytics.avgScore.toFixed(2)}%`}
          gradient="from-pink-500/20 to-purple-500/10"
        />
        <StatCard
          icon={<TrendingUp className="text-green-400" size={28} />}
          title="Best Quiz"
          value={
            analytics.attempts.length
              ? Math.max(...analytics.attempts.map((a) => a.score)) + "%"
              : "N/A"
          }
          gradient="from-green-500/20 to-emerald-500/10"
        />
        <StatCard
          icon={<Clock className="text-cyan-400" size={28} />}
          title="Recent Activity"
          value={
            analytics.attempts.length
              ? new Date(
                  analytics.attempts[analytics.attempts.length - 1].createdAt
                ).toLocaleDateString()
              : "No Data"
          }
          gradient="from-cyan-500/20 to-blue-500/10"
        />
      </div>

      {/* Score Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-2xl w-full max-w-6xl mb-10"
        >
          <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-2 mb-4">
            <BarChart3 size={22} /> Score Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                }}
              />
              <Bar dataKey="score" fill="url(#colorScore)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Attempts List */}
      <div className="w-full max-w-6xl space-y-6">
        {analytics.attempts.length > 0 ? (
          analytics.attempts.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 hover:border-cyan-600 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-purple-400">
                  {a.quiz?.title || "Untitled Quiz"}
                </h3>
                <span className="text-gray-400 text-sm">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-300">
                Score:{" "}
                <span className="text-green-400 font-bold">{a.score}%</span>
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => toggleQuestions(a._id)}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
                >
                  <Eye size={16} />
                  {expanded[a._id] ? "Hide Details" : "View Details"}
                </button>

                <button
                  onClick={() => handleDeleteAnalysis(a._id)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>

              {/* Expanded Section */}
              {expanded[a._id] && a.quiz?.questions && (
                <div className="mt-5 bg-gray-900/70 border border-gray-700 rounded-xl p-4 text-gray-300">
                  {a.quiz.questions.map((q, qi) => (
                    <div key={qi} className="mb-4">
                      <p className="font-semibold text-cyan-400">
                        {qi + 1}. {q.question}
                      </p>
                      <ul className="list-disc ml-6 mt-2">
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

/* -----------------------------
   💡 Small Reusable Stat Card
----------------------------- */
function StatCard({ icon, title, value, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} border border-gray-700 shadow-xl backdrop-blur-md`}
    >
      <div className="flex items-center gap-3 mb-2">{icon}<h3 className="text-gray-300 font-semibold">{title}</h3></div>
      <p className="text-2xl font-bold text-white tracking-wide">{value}</p>
    </motion.div>
  );
}
