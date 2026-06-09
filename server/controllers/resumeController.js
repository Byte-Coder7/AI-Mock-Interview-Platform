// server/controllers/resumeController.js

const Resume = require("../models/Resume");

// POST /api/resume/upload
// Uploads resume text and creates a Resume document.
const uploadResume = async (req, res) => {
  try {
    const { fileName, resumeText } = req.body;

    const userId = req.user?._id;

    // Validate fileName exists
    if (!fileName || !String(fileName).trim()) {
      return res.status(400).json({
        success: false,
        message: "fileName is required",
      });
    }

    // Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user",
      });
    }

    // Create Resume document
    const resume = await Resume.create({
      userId,
      fileName: String(fileName).trim(),
      resumeText: resumeText || "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
};

// GET /api/resume/history
// Returns all resumes for the currently authenticated user.
const getResumeHistory = async (req, res) => {
  try {
    const userId = req.user?._id;

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get resume history",
    });
  }
};

module.exports = {
  uploadResume,
  getResumeHistory,
};


