import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function QuestionCard({ question, index, onSelect, selectedOption }) {
  const [chosen, setChosen] = useState(selectedOption || "");

  useEffect(() => {
    setChosen(selectedOption);
  }, [selectedOption]);

  const handleClick = (opt) => {
    setChosen(opt);
    onSelect(opt.trim()); // trim extra spaces
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
    >
      {/* Question */}
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-cyan-400 text-center">
        {index + 1}. {question.question}
      </h2>

      {/* Options */}
      <div className="grid gap-4">
        {question.options.map((opt, i) => {
          const isSelected = chosen === opt;
          return (
            <motion.button
              key={i}
              onClick={() => handleClick(opt)}
              whileTap={{ scale: 0.97 }}
              className={`w-full text-left px-5 py-3 rounded-xl font-medium border transition-all duration-300
                ${
                  isSelected
                    ? "bg-cyan-600/90 border-cyan-400 text-white shadow-md shadow-cyan-400/40"
                    : "bg-gray-900/40 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-cyan-500/60 hover:text-white"
                }`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
