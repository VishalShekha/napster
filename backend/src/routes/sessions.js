import express from "express";
const router = express.Router();

let sessions = [
  { id: "1", name: "Late Night Jam", host: "Alice", participants: 4 },
  { id: "2", name: "Coding Mix", host: "Bob", participants: 2 },
];

router.get("/", (req, res) => {
  res.json(sessions);
});

export default router;
