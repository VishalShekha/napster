import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Summer Vibes", description: "Hot tracks of the season", cover: "/placeholder.svg?key=chart1" },
    { id: 2, title: "Indie Gems", description: "Fresh indie picks", cover: "/placeholder.svg?key=chart2" },
  ]);
});

export default router;
