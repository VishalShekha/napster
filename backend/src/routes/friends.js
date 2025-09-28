import express from "express";
const router = express.Router();

let friends = [
  { id: "1", name: "Alice", status: "Listening to Midnight Echoes", avatar: "/friend1.jpg" },
  { id: "2", name: "Bob", status: "Online • Browsing music", avatar: "/friend2.jpg" },
  { id: "3", name: "Charlie", status: "Offline", avatar: "/friend3.jpg" },
];

router.get("/", (req, res) => {
  res.json(friends);
});

export default router;
