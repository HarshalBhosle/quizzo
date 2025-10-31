import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900/80 text-gray-300 border-t border-gray-700 py-6 mt-10 backdrop-blur-lg"
    >
      <div className="max-w-6xl mx-auto text-center text-sm">
        <p className="text-cyan-400 font-semibold tracking-wide">
          © {new Date().getFullYear()} AI Quiz App
        </p>
        <p className="text-gray-400 mt-2">
          Built with 💡 using <span className="text-cyan-400">React</span>,{" "}
          <span className="text-emerald-400">Node.js</span> &{" "}
          <span className="text-purple-400">Gemini AI</span>
        </p>
      </div>
    </motion.footer>
  );
}
