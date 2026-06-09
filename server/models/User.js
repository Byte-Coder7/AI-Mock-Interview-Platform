// server/models/User.js
// Mongoose User model for the AI Mock Interview Platform.

const mongoose = require("mongoose");

// Define the User schema with required fields.
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email address (stored lowercase, must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // User's password hash
    password: {
      type: String,
      required: true,
    },

    // Account creation timestamp
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Avoid Mongoose adding an extra __v version key unless needed.
    versionKey: false,
  }
);

// Export the compiled model.
const User = mongoose.model("User", userSchema);
module.exports = User;

