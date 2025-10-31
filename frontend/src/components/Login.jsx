import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form)).then(() => navigate("/dashboard"));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-md border border-gray-700 shadow-lg rounded-2xl p-8 w-96 text-white"
      >
        <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-6">
          Welcome Back
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-cyan-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-cyan-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            disabled={loading}
            className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-all font-semibold shadow-lg shadow-cyan-500/20"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-5">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
