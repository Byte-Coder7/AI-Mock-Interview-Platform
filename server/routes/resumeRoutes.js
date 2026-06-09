// server/routes/resumeRoutes.js
// Routes for resume upload.

const express = require("express");

const { uploadResume, getResumeHistory } = require("../controllers/resumeController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route to upload resume
router.post("/upload", protect, uploadResume);

// Protected route to get resume history
router.get("/history", protect, getResumeHistory);

module.exports = router;


