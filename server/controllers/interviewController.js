// server/controllers/interviewController.js
// Controller for starting an AI mock interview session.

const Interview = require("../models/Interview");
const { generateQuestions } = require("./geminiController");

// POST /api/interview/start
// Creates a new interview document with status = "pending"
const startInterview = async (req, res) => {
  try {
    // 1) Get role from request body
    const { role } = req.body;

    // 2) Get logged-in user id (set by auth middleware)

    const userId = req.user?._id;

    // 3) Validate role exists
    if (!role || !String(role).trim()) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // 4) Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user",
      });
    }

    // 5) Generate interview questions using Gemini
    const questions = await generateQuestions(role);

    // 6) Create a new Interview document
    const interview = await Interview.create({
      userId,
      role: String(role).trim(),
      questions: questions,
      status: "pending",
    });

    // 7) Return the response
    return res.status(201).json({
      success: true,
      message: "Interview session created",
      interview,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create interview session",
    });
  }
};

// POST /api/interview/submit-answers
// Saves user answers and marks interview as completed (dummy evaluation for now).
const submitAnswers = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;


    // 1) Validate interviewId
    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "interviewId is required",
      });
    }

    // 2) Validate answers is an array
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "answers must be an array",
      });
    }

    // 3) Find Interview by ID
    const interview = await Interview.findById(interviewId);

    // 4) If interview not found
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // 5) Save answers
    interview.answers = answers;

    // 6) Dummy evaluation
    const score = 8;
    const feedback = "Good performance. Keep practicing.";

    // 7) Update evaluation + status
    interview.score = score;
    interview.feedback = feedback;
    interview.status = "completed";

    // 8) Save interview
    await interview.save();

    // 9) Return response
    return res.status(200).json({
      success: true,
      message: "Interview submitted successfully",
      interview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit interview answers",
    });
  }
};

// GET /api/interview/history
// Returns all interviews for the currently authenticated user.
const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user?._id;

    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get interview history",
    });
  }
};

module.exports = {
  startInterview,
  submitAnswers,
  getInterviewHistory,
};



