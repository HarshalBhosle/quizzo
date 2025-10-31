import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import QuestionCard from "./QuestionCard";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Clock } from "lucide-react";

export default function QuizPlayer() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🕒 Timer states
  const [timeLeft, setTimeLeft] = useState(null);
  const [questionTime, setQuestionTime] = useState(0);
  const questionTimerRef = useRef(null);
  const totalTimerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data } = await api.get(`/api/quiz/${id}`);
      setQuiz(data);

      // 🧩 initialize total time from quiz.timer (in minutes)
      if (data?.timer) {
        setTimeLeft(data.timer * 60);
      }
    };
    fetchQuiz();
  }, [id]);

  // Start countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    totalTimerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(totalTimerRef.current);
  }, [timeLeft]);

  // Start question timer
  useEffect(() => {
    if (!quiz) return;
    startQuestionTimer();
    return () => clearInterval(questionTimerRef.current);
  }, [quiz]);

  const startQuestionTimer = () => {
    clearInterval(questionTimerRef.current);
    setQuestionTime(0);
    questionTimerRef.current = setInterval(() => {
      setQuestionTime((t) => t + 1);
    }, 1000);
  };

  const getCorrectOption = (question) => {
    if (!question?.answer) return "";
    let ans = question.answer.trim();
    ans = ans.replace(/^Answer:\s*/i, "");
    const match = ans.match(/^([A-Da-d])\)?/);
    if (match) {
      const letter = match[1].toUpperCase();
      const idx = letter.charCodeAt(0) - 65;
      return question.options[idx]?.trim().toLowerCase() || "";
    }
    const letterAndText = ans.match(/^[A-Da-d]\)\s*(.+)$/);
    if (letterAndText) return letterAndText[1].trim().toLowerCase();
    return ans.trim().toLowerCase();
  };

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
        timeSpent: questionTime,
        difficulty: currentQuestion.difficulty || "N/A",
      };
      if (existing) {
        return prev.map((a) => (a.index === index ? newAnswer : a));
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const handleNext = () => {
    if (index + 1 < quiz.questions.length) {
      setIndex(index + 1);
      startQuestionTimer();
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
      startQuestionTimer();
    }
  };

  const handleSubmit = async () => {
    clearInterval(questionTimerRef.current);
    clearInterval(totalTimerRef.current);
    if (submitted) return;

    const calculatedScore = answers.filter((a) => a.isCorrect).length;
    setScore(calculatedScore);
    setSubmitted(true);

    try {
      await api.post("/api/quiz/attempt", {
        quiz: id,
        score: calculatedScore,
        correctAnswers: calculatedScore,
        totalQuestions: quiz.questions.length,
        totalTime: quiz.timer ? quiz.timer * 60 - timeLeft : 0,
        answers,
      });
    } catch (err) {
      console.error("Error saving attempt:", err);
    }
  };

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s.toString().padStart(2, "0")}`;
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
        <p className="mt-3 text-gray-400">
          ⏱️ Total Time Used:{" "}
          {quiz.timer ? formatTime(quiz.timer * 60 - timeLeft) : "--"}
        </p>
        <p className="mt-2 text-gray-400">Well done completing the quiz!</p>
      </motion.div>
    );

  const selectedOption =
    answers.find((a) => a.index === index)?.selectedOption || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex">
      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-20 left-6 bg-cyan-600 hover:bg-cyan-500 p-3 rounded-lg z-40 shadow-lg transition-all duration-200"
      >
        <Menu size={22} />
      </button>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="fixed top-0 left-0 h-full w-64 bg-gray-800/90 backdrop-blur-lg 
                         border-r border-gray-700 z-50 shadow-lg p-5 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-800/90 backdrop-blur-md pb-2 z-10">
                <h2 className="text-xl font-semibold text-cyan-400">Questions</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 pb-5">
                {quiz.questions.map((_, i) => {
                  const answered = answers.find((a) => a.index === i);
                  const isCurrent = i === index;
                  return (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all
                        ${
                          isCurrent
                            ? "bg-cyan-600 text-white ring-2 ring-cyan-300"
                            : answered
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Quiz Area */}
      <div className="flex-1 flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-gray-800/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-cyan-400 text-center">
              {quiz.title}
            </h2>

            {/* Countdown Timer */}
            {quiz.timer && (
              <div
                className={`flex items-center gap-2 text-lg font-semibold ${
                  timeLeft <= 30 ? "text-red-500" : "text-cyan-400"
                }`}
              >
                <Clock size={18} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {!completed ? (
            <div className="space-y-8">
              <QuestionCard
                question={quiz.questions[index]}
                index={index}
                onSelect={handleSelect}
                selectedOption={selectedOption}
              />
              <p className="text-sm text-gray-400 text-right">
                ⏱️ Time on this question: {formatTime(questionTime)}
              </p>

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
    </div>
  );
}
