// server/routes/interviewRoutes.js
// Routes for starting an AI mock interview session.

const express = require("express");

const { startInterview, submitAnswers, getInterviewHistory } = require("../controllers/interviewController");


const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route to start an interview session
router.post("/start", protect, startInterview);

// Protected route to submit interview answers
router.post("/submit", protect, submitAnswers);

// Protected route to get interview history
router.get("/history", protect, getInterviewHistory);

module.exports = router;



