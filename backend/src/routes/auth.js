import express from "express";

const router = express.Router();

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", (req, res) => {
  const { name, email, password, dob } = req.body;

  if (!name || !email || !password || !dob) {
    return res.status(400).json({ message: "All fields are required" });
  }

  res.json({
    message: "User registered successfully",
    user: { id: Date.now(), name, email, dob },
  });
});

export default router; // ✅ ESM default export
