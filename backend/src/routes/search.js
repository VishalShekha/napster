// backend/src/routes/search.js
import { Router } from "express";
const router = Router();

// Mock categories (later you can pull from DB)
const categories = [
  { id: 1, name: "Pop", color: "bg-pink-500" },
  { id: 2, name: "Hip-Hop", color: "bg-orange-500" },
  { id: 3, name: "Rock", color: "bg-red-500" },
  { id: 4, name: "Electronic", color: "bg-purple-500" },
  { id: 5, name: "Jazz", color: "bg-blue-500" },
  { id: 6, name: "Classical", color: "bg-green-500" },
  { id: 7, name: "R&B", color: "bg-yellow-500" },
  { id: 8, name: "Country", color: "bg-amber-600" },
];

// GET /search?q=term
router.get("/", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";

  // 🔎 Mock search results
  const results = {
    songs: [
      {
        id: 1,
        title: "Shattered Reality",
        artist: "Supersonic",
        album: "Digital Dreams",
        duration: "3:42",
        cover: "/album-cover-shattered-reality.jpg",
      },
      {
        id: 2,
        title: "Electric Pulse",
        artist: "Neon Waves",
        album: "Synthwave",
        duration: "3:55",
        cover: "/album-cover-electric-pulse.jpg",
      },
      {
        id: 3,
        title: "Bass Drop",
        artist: "Digital Storm",
        album: "Electronic Fury",
        duration: "3:18",
        cover: "/album-cover-bass-drop.jpg",
      },
    ].filter((s) => s.title.toLowerCase().includes(q)),

    artists: [
      { id: 1, name: "Supersonic", followers: "1.2M", cover: "/placeholder.svg?key=artist1" },
      { id: 2, name: "Neon Waves", followers: "856K", cover: "/placeholder.svg?key=artist2" },
      { id: 3, name: "Digital Storm", followers: "623K", cover: "/placeholder.svg?key=artist3" },
    ].filter((a) => a.name.toLowerCase().includes(q)),

    albums: [
      { id: 1, title: "Digital Dreams", artist: "Supersonic", year: "2024", cover: "/album-cover-shattered-reality.jpg" },
      { id: 2, title: "Synthwave", artist: "Neon Waves", year: "2024", cover: "/album-cover-electric-pulse.jpg" },
      { id: 3, title: "Electronic Fury", artist: "Digital Storm", year: "2023", cover: "/album-cover-bass-drop.jpg" },
    ].filter((a) => a.title.toLowerCase().includes(q)),

    playlists: [
      { id: 1, title: "Electronic Hits", description: "The best electronic music", songs: 127, cover: "/placeholder.svg?key=playlist1" },
      { id: 2, title: "Future Bass", description: "Modern bass-heavy tracks", songs: 89, cover: "/placeholder.svg?key=playlist2" },
    ].filter((p) => p.title.toLowerCase().includes(q)),
  };

  res.json(results);
});

// GET /search/categories
router.get("/categories", (req, res) => {
  res.json(categories);
});

export default router;
