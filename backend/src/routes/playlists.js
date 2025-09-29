import { Router } from "express"
const router = Router()

// Mock playlist data
const playlists = [
  {
    id: "1",
    name: "My Playlist #1",
    description: "A collection of my favorite tracks",
    cover: "/placeholder.svg?key=playlist1",
    owner: "You",
    followers: 1247,
    totalDuration: "2 hr 34 min",
    songs: [
      { id: 1, title: "Shattered Reality", artist: "Supersonic", album: "Digital Dreams", duration: "3:42", cover: "/album-cover-shattered-reality.jpg" },
      { id: 2, title: "Ocean Waves", artist: "Calm Sounds", album: "Nature's Symphony", duration: "4:15", cover: "/album-cover-ocean-waves.png" },
      { id: 3, title: "City Lights", artist: "Urban Beat", album: "Metropolitan", duration: "3:28", cover: "/album-cover-city-lights.jpg" },
    ],
  },
]

// GET /playlists/:id
router.get("/:id", (req, res) => {
  const playlist = playlists.find((p) => p.id === req.params.id)
  if (!playlist) return res.status(404).json({ error: "Playlist not found" })
  res.json(playlist)
})

export default router
