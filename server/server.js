require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();


// Middleware section

app.use(cors());
app.use(express.json());


// Routes section

app.get("/", (req, res) => {
  res.json({ message: "AI Mock Interview API Running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resume", resumeRoutes);


// Server start section

const PORT = process.env.PORT || 5000;

// Ensure DB is connected before starting the server
(async () => {
  try {
    await connectDB();

    console.log("✅ MongoDB connected. Starting server...");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
})();

