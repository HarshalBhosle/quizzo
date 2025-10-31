import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, BarChart3, BookOpen } from "lucide-react";

export default function Dashboard() {
  const cards = [
    {
      title: "Create Quiz",
      icon: <PlusCircle className="w-8 h-8 mb-3" />,
      color: "from-blue-500 to-cyan-500",
      link: "/create",
      emoji: "➕",
    },
    {
      title: "My Quizzes",
      icon: <BookOpen className="w-8 h-8 mb-3" />,
      color: "from-green-500 to-emerald-500",
      link: "/myquizzes",
      emoji: "📚",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="w-8 h-8 mb-3" />,
      color: "from-purple-500 to-pink-500",
      link: "/analytics",
      emoji: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-10 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg"
      >
        🎯 Quiz Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <Link
              to={card.link}
              className={`block bg-gradient-to-br ${card.color} p-[1px] rounded-2xl shadow-lg hover:shadow-cyan-400/40 transition-transform hover:-translate-y-2`}
            >
              <div className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center text-center h-full">
                {card.icon}
                <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
                <p className="text-gray-400 text-sm">
                  {card.emoji} Go to {card.title}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
