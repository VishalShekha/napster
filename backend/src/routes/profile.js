import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    id: 1,
    name: "John Doe",
    role: "Artist",
    avatar: "/music-artist-profile.jpg",
  });
});

export default router;
