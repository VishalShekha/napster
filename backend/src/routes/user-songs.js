import express from "express";
const router = express.Router();

// GET /user-songs
router.get("/", (req, res) => {
  res.json([
    {
      id: 101,
      title: "Midnight Echoes",
      artist: "John Doe",
      album: "Solo Sessions",
      plays: 1247,
      duration: "3:42",
      cover: "/abstract-album-cover.png",
    },
    {
      id: 102,
      title: "Digital Dreams",
      artist: "John Doe",
      album: "Electronic Vibes",
      plays: 892,
      duration: "4:15",
      cover: "/midnight-dreams-album-cover.png",
    },
    {
      id: 103,
      title: "Acoustic Sunrise",
      artist: "John Doe",
      album: "Morning Sessions",
      plays: 2156,
      duration: "3:28",
      cover: "/acoustic-sessions-album-cover.png",
    },
    {
      id: 104,
      title: "Bass Revolution",
      artist: "John Doe",
      album: "Heavy Beats",
      plays: 3421,
      duration: "2:58",
      cover: "/album-cover-bass-drop.jpg",
    },
    {
      id: 105,
      title: "Jazz Fusion",
      artist: "John Doe",
      album: "Smooth Sounds",
      plays: 567,
      duration: "5:12",
      cover: "/album-cover-jazz-nights.jpg",
    },
  ]);
});

export default router;
