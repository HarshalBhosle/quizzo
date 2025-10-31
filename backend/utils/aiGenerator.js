import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export const generateAIQuestions = async (topic, numQuestions, difficulty) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Generate ${numQuestions} ${difficulty} quiz questions on "${topic}". Each in JSON with:
  questionText, options (array of 4), correctAnswer.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text);
};
