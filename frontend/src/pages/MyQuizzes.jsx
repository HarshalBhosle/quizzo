import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const { data } = await api.get("/api/quiz/myquizzes");
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };
    getQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this quiz?")) return;
    try {
      await api.delete(`/api/quiz/${id}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
      alert("✅ Quiz deleted successfully!");
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert("❌ Failed to delete quiz!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 drop-shadow-lg">
        📚 My Quizzes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {quizzes.length > 0 ? (
          quizzes.map((quiz, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800/70 border border-gray-700 rounded-2xl shadow-lg p-6 text-center hover:shadow-emerald-400/40 hover:-translate-y-2 transition"
            >
              <BookOpen className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-3">{quiz.title}</h2>

              <div className="flex justify-center gap-3">
                <Link
                  to={`/play/${quiz._id}`}
                  className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-lg inline-block"
                >
                  Play Quiz
                </Link>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg inline-block"
                  title="Delete Quiz"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 mt-10">No quizzes created yet 😔</p>
        )}
      </div>
    </div>
  );
}
