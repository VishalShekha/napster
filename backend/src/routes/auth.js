import express from "express";
import { dummyUser } from "../models/userModel.js";


const router = express.Router();

// @route   POST /auth/register
router.post("/register", (req, res) => {
  const { name, email, password, dob } = req.body;

  // Just return success for demo purposes — not actually storing anything
  if (!name || !email || !password || !dob) {
    return res.status(400).json({ message: "All fields are required" });
  }

  return res.json({
    message: "User registered (mock)",
    user: { id: Date.now(), name, email, dob },
  });
});

// @route   POST /auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check against the dummy user
  if (email === dummyUser.email && password === dummyUser.password) {
    return res.json({
      message: "Login successful",
      token: "mock-token-abc123",
      user: dummyUser,
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
