import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-6xl font-extrabold mb-4 text-cyan-400 drop-shadow-[0_0_20px_#00ffff]"
      >
        AI Quiz App 🤖
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg mb-10 text-gray-300 text-center max-w-xl"
      >
        Create, Play & Analyze Quizzes with <span className="text-cyan-400">AI Power</span> — built for futuristic learners 🚀
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-6"
      >
        <Link
          to="/login"
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-lg hover:shadow-emerald-400/50 transition-all duration-300"
        >
          Sign Up
        </Link>
      </motion.div>
    </div>
  );
}
