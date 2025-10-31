import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, BarChart3, Clock, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center items-center text-center py-20 px-6"
      >
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-cyan-400 drop-shadow-[0_0_25px_#00ffff]">
          Quizzo 🤖
        </h1>
        <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl leading-relaxed">
          Build smarter quizzes with AI, test your knowledge, and analyze your
          performance — all in one futuristic platform 🚀
        </p>

        <div className="flex flex-wrap gap-6 justify-center">
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
        </div>
      </motion.section>

      {/* Divider Line */}
      <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent my-8" />

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-6 py-12"
      >
        <FeatureCard
          icon={<Brain size={40} className="text-cyan-400" />}
          title="AI Quiz Generator"
          description="Instantly create intelligent quizzes with AI that saves your time and ensures unique, high-quality questions."
        />
        <FeatureCard
          icon={<BarChart3 size={40} className="text-emerald-400" />}
          title="Performance Analysis"
          description="Get detailed reports on your accuracy, time per question, and score trends with real-time data visualization."
        />
        <FeatureCard
          icon={<Clock size={40} className="text-orange-400" />}
          title="Timed Challenges"
          description="Set custom timers for your quizzes to make learning more exciting and competitive."
        />
      </motion.section>

      {/* About / Why Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="max-w-4xl text-center px-6 pb-20"
      >
        <h2 className="text-3xl font-bold mb-4 text-cyan-400 flex items-center justify-center gap-2">
          <Sparkles size={26} /> Why We Built This App
        </h2>
        <p className="text-gray-300 leading-relaxed text-lg">
          We created this platform to make learning interactive and data-driven.
          Whether you're a student, teacher, or quiz enthusiast, our AI Quiz App
          helps you generate quizzes instantly, track progress, and sharpen your
          thinking — all powered by artificial intelligence.
        </p>
      </motion.section>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 text-center shadow-md hover:shadow-cyan-500/20 transition-all"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);
