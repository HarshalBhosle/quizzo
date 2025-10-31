import axios from "axios";

export const generateAIResponse = async (req, res) => {
  try {
    const { topic, numQuestions } = req.body;
    if (!topic) return res.status(400).json({ message: "Topic is required" });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // 🧠 Improved, strict prompt
    const prompt = `
    Generate ${numQuestions || 5} multiple-choice quiz questions on the topic "${topic}".
    Each question should follow this strict format:

    Q: <question text>
    A) <option 1>
    B) <option 2>
    C) <option 3>
    D) <option 4>
    Answer: <A/B/C/D>

    Do not include explanations, numbering, or markdown formatting.
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ Parsing Logic
    const questions = [];
    const blocks = aiText
      .split(/Q:\s*/i)
      .map((b) => b.trim())
      .filter((b) => b);

    blocks.forEach((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const question = lines[0];
      const options = lines
        .filter((l) => /^[A-D]\)/i.test(l))
        .map((opt) => opt.replace(/^[A-D]\)\s*/i, "").trim());
      const answerLine = lines.find((l) => /^Answer:/i.test(l));
      const answer = answerLine
        ? answerLine.replace(/^Answer:\s*/i, "").trim()
        : "";

      if (question && options.length === 4 && answer) {
        questions.push({ question, options, answer });
      }
    });

    return res.json({ questions });
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to generate AI response",
      details: error.response?.data || error.message,
    });
  }
};
