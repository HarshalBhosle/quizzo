import React, { useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";
import { Brain, Save, PlusCircle, Eye, EyeOff } from "lucide-react";

export default function QuizCreator() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // 👈 new state

  const addQuestion = () => {
    if (!currentQ.question || !currentQ.answer)
      return alert("⚠️ Fill question & answer!");
    setQuestions([...questions, currentQ]);
    setCurrentQ({ question: "", options: ["", "", "", ""], answer: "" });
  };

  const handleCreateQuiz = async () => {
    if (!title.trim() || !topic.trim() || questions.length === 0)
      return alert("⚠️ Please fill all fields before saving!");
    try {
      await api.post("/api/quiz/create", { title, topic, questions });
      alert("✅ Quiz created successfully!");
      setTitle("");
      setTopic("");
      setQuestions([]);
      setShowPreview(false);
    } catch (err) {
      console.error("Error creating quiz:", err);
      alert("❌ Failed to create quiz!");
    }
  };

  const handleGenerateAI = async () => {
    try {
      setLoadingAI(true);
      const { data } = await api.post("/ai/generate", { topic, numQuestions });
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to generate questions. Check backend.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
      >
        🧠 Create Your Quiz
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/70 backdrop-blur-xl p-8 rounded-2xl w-full max-w-3xl border border-gray-700 shadow-xl"
      >
        {/* Title */}
        <input
          type="text"
          placeholder="Enter Quiz Title"
          className="w-full p-3 mb-4 rounded-lg bg-gray-900 border border-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* AI Generator */}
        <div className="mb-6 p-4 rounded-lg bg-gray-900/80 border border-gray-700">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" /> Generate Questions with AI
          </h2>
          <input
            type="text"
            placeholder="Enter topic (e.g., JavaScript, History)"
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="20"
            className="p-2 w-24 rounded bg-gray-800 border border-gray-700 text-center"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          />
          <button
            onClick={handleGenerateAI}
            disabled={loadingAI}
            className="ml-4 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
          >
            {loadingAI ? "⏳ Generating..." : "✨ Generate"}
          </button>
        </div>

        {/* Manual Add */}
        <div className="mb-6 bg-gray-900/80 border border-gray-700 p-5 rounded-lg">
          <input
            type="text"
            placeholder="Enter Question"
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700"
            value={currentQ.question}
            onChange={(e) =>
              setCurrentQ({ ...currentQ, question: e.target.value })
            }
          />
          {currentQ.options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              className="w-full p-3 mb-2 rounded bg-gray-800 border border-gray-700"
              value={opt}
              onChange={(e) => {
                const newOpts = [...currentQ.options];
                newOpts[i] = e.target.value;
                setCurrentQ({ ...currentQ, options: newOpts });
              }}
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700"
            value={currentQ.answer}
            onChange={(e) =>
              setCurrentQ({ ...currentQ, answer: e.target.value })
            }
          />
          <button
            onClick={addQuestion}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg transition flex items-center gap-2"
          >
            <PlusCircle size={18} /> Add Question
          </button>
        </div>

        {/* Save */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleCreateQuiz}
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition flex items-center gap-2"
          >
            <Save size={20} /> Save Quiz
          </button>

          {/* 👇 Show / Hide Preview Toggle */}
          {questions.length > 0 && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg flex items-center gap-2 text-sm transition"
            >
              {showPreview ? (
                <>
                  <EyeOff size={18} /> Hide Preview
                </>
              ) : (
                <>
                  <Eye size={18} /> Show Preview
                </>
              )}
            </button>
          )}
        </div>

        {/* 👇 Preview (hidden by default) */}
        {showPreview && questions.length > 0 && (
          <div className="mt-8 bg-gray-900/70 border border-gray-700 rounded-lg p-5">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">
              Preview ({questions.length})
            </h2>
            {questions.map((q, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold text-gray-100">
                  {i + 1}. {q.question}
                </p>
                <ul className="list-disc ml-6 text-gray-400">
                  {q.options.map((opt, j) => (
                    <li key={j}>{opt}</li>
                  ))}
                </ul>
                <p className="text-green-400 mt-1">Answer: {q.answer}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
