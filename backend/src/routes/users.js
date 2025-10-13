import express from "express";
const router = express.Router();

router.get("/me", (req, res) => {
  // Example hardcoded user profile until login/auth is implemented
  res.json({
    id: 1,
    name: "John Doe",
    role: "Artist",
    avatar: "/music-artist-profile.jpg",
    totalPlays: 12345,
    totalSongs: 12,
  });
});

export default router;
