import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/80 backdrop-blur-md text-white border-b border-gray-700 shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-cyan-400 hover:text-cyan-300 transition-all"
        >
          💡 Quizzo
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-cyan-300 transition">
            Home
          </Link>

          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-cyan-300 transition">
                Dashboard
              </Link>
              <Link to="/create" className="hover:text-cyan-300 transition">
                Create Quiz
              </Link>
              <Link to="/myquizzes" className="hover:text-cyan-300 transition">
                My Quizzes
              </Link>
              <Link to="/analytics" className="hover:text-cyan-300 transition">
                Analytics
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 bg-cyan-600 text-white px-4 py-1.5 rounded-lg hover:bg-cyan-500 hover:shadow-cyan-400/40 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-cyan-300 transition">
                Login
              </Link>
              <Link to="/signup" className="hover:text-cyan-300 transition">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}


