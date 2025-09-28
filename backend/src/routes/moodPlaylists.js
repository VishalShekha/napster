import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Morning Boost", description: "Wake up energized", cover: "/placeholder.svg?key=mood1" },
    { id: 2, title: "Chill Night", description: "Relax and unwind", cover: "/placeholder.svg?key=mood2" },
  ]);
});

export default router;
