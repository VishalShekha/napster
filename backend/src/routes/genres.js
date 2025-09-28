import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Pop", color: "bg-pink-500", cover: "/placeholder.svg?key=pop1" },
    { id: 2, name: "Hip-Hop", color: "bg-orange-500", cover: "/placeholder.svg?key=hiphop1" },
    { id: 3, name: "Rock", color: "bg-red-500", cover: "/placeholder.svg?key=rock1" },
  ]);
});

export default router;
