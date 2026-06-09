const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

// Returns exactly 5 interview questions for a given role.
const generateQuestions = async (role) => {
  try {
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate exactly 5 interview questions for a ${role} position.\nReturn only a JSON array of strings.\nDo not return markdown.`;

    const result = await model.generateContent(prompt);
    const responseText = (result.response?.text?.() ?? "").trim();

    const questions = JSON.parse(responseText);
    return questions;

  } catch (error) {
    throw error;
  }
};

module.exports = { generateQuestions };

