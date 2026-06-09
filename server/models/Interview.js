
// Mongoose Interview model for the AI Mock Interview Platform.

const mongoose = require("mongoose");

// Define the Interview schema
const interviewSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this interview
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Role being interviewed for (e.g., Frontend Developer, Backend Developer)
    role: {
      type: String,
      required: true,
      trim: true,
    },

    // Interview questions asked
    questions: {
      type: [String],
      default: [],
    },

    // User answers for each question
    answers: {
      type: [String],
      default: [],
    },

    // Overall score for the interview
    score: {
      type: Number,
      default: 0,
    },

    // Feedback text (from AI or interviewer)
    feedback: {
      type: String,
      default: "",
    },

    // Interview status
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the compiled model using CommonJS
const Interview = mongoose.model("Interview", interviewSchema);
module.exports = Interview;

