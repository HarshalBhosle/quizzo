import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import QuestionCard from "./QuestionCard";
import { motion } from "framer-motion";

export default function QuizPlayer() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // stores all user answers
  const [completed, setCompleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data } = await api.get(`/api/quiz/${id}`);
      setQuiz(data);
    };
    fetchQuiz();
  }, [id]);

  // ✅ helper to normalize and extract correct option
  const getCorrectOption = (question) => {
    if (!question?.answer) return "";
    let ans = question.answer.trim();

    // remove "Answer:" prefix if present
    ans = ans.replace(/^Answer:\s*/i, "");

    // if it's a letter like A, B, C, D or A)
    const match = ans.match(/^([A-Da-d])\)?/);
    if (match) {
      const letter = match[1].toUpperCase();
      const idx = letter.charCodeAt(0) - 65; // A->0
      return question.options[idx]?.trim().toLowerCase() || "";
    }

    // if it's like "A) Option text"
    const letterAndText = ans.match(/^[A-Da-d]\)\s*(.+)$/);
    if (letterAndText) return letterAndText[1].trim().toLowerCase();

    // otherwise assume the answer is full text
    return ans.trim().toLowerCase();
  };

  // ✅ handle option selection
  const handleSelect = (selectedOption) => {
    const currentQuestion = quiz.questions[index];
    const correctAnswer = getCorrectOption(currentQuestion);
    const chosen = selectedOption.trim().toLowerCase();
    const isCorrect = chosen === correctAnswer;

    setAnswers((prev) => {
      const existing = prev.find((a) => a.index === index);
      const newAnswer = {
        index,
        question: currentQuestion.question,
        selectedOption,
        isCorrect,
        difficulty: currentQuestion.difficulty || "N/A",
      };

      if (existing) {
        // replace previous answer for this question
        return prev.map((a) => (a.index === index ? newAnswer : a));
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const handleNext = () => {
    if (index + 1 < quiz.questions.length) setIndex(index + 1);
    else setCompleted(true);
  };

  // ✅ added Previous button handler
  const handlePrevious = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSubmit = async () => {
    const calculatedScore = answers.filter((a) => a.isCorrect).length;
    setScore(calculatedScore);
    try {
      await api.post("/api/quiz/attempt", {
        quiz: id,
        score: calculatedScore,
        correctAnswers: calculatedScore,
        totalQuestions: quiz.questions.length,
        answers,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving attempt:", err);
      alert("Failed to save attempt");
    }
  };

  if (!quiz)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        Loading quiz...
      </div>
    );

  if (submitted)
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-20"
      >
        <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg">
          Quiz Submitted! 🎉
        </h1>
        <p className="text-xl mt-5 text-gray-300">
          You scored{" "}
          <span className="text-cyan-500 font-bold">
            {score}/{quiz.questions.length}
          </span>
        </p>
        <p className="mt-2 text-gray-400">Great job completing the quiz!</p>
      </motion.div>
    );

  const selectedOption =
    answers.find((a) => a.index === index)?.selectedOption || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-gray-800/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-cyan-400 text-center">
          {quiz.title}
        </h2>

        {!completed ? (
          <div className="space-y-8">
            <QuestionCard
              question={quiz.questions[index]}
              index={index}
              onSelect={handleSelect}
              selectedOption={selectedOption}
            />

            {/* ✅ Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={index === 0}
                className={`px-6 py-2 text-lg rounded-lg transition-all duration-200 shadow-md ${
                  index === 0
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "bg-gray-700 hover:bg-gray-600 hover:shadow-gray-400/40"
                }`}
              >
                ← Previous
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2 text-lg bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-cyan-400/40"
              >
                {index + 1 < quiz.questions.length ? "Next →" : "Finish Quiz"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-12">
            <h1 className="text-3xl font-bold text-cyan-400 mb-4">
              Quiz Completed!
            </h1>
            <button
              onClick={handleSubmit}
              className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-lg font-semibold shadow-md hover:shadow-emerald-400/40 transition-all duration-300"
            >
              Submit Quiz 🚀
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
