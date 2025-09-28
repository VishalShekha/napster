import express from "express";
const router = express.Router();

let personalBlends = [
  { id: "1", name: "Alice Mix", members: ["Alice"], cover: "/blend1.jpg" },
];

let commonBlends = [
  { id: "2", name: "Workout Beats", members: ["You", "Bob"], cover: "/blend2.jpg" },
  { id: "3", name: "Chill Nights", members: ["You", "Alice", "Charlie"], cover: "/blend3.jpg" },
];

// GET personal blends
router.get("/personal-blends", (req, res) => {
  res.json(personalBlends);
});

// GET common blends
router.get("/common-blends", (req, res) => {
  res.json(commonBlends);
});

// POST to create a new blend
router.post("/", (req, res) => {
  const { members } = req.body;
  const newBlend = {
    id: String(Date.now()),
    name: `Blend with ${members.length} friends`,
    members,
    cover: "/placeholder.svg",
  };
  commonBlends.push(newBlend);
  res.json(newBlend);
});

export default router;
