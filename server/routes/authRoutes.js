const express = require("express");

const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// POST /auth/register
// Registers a new user
router.post("/register", registerUser);

// POST /auth/login
// Logs in an existing user
router.post("/login", loginUser);

module.exports = router;

