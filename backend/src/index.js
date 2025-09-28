import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile.js";
import userSongsRoutes from "./routes/user-songs.js";
import friendsRoutes from "./routes/friends.js";
import blendsRoutes from "./routes/blends.js";
import sessionsRoutes from "./routes/sessions.js";
import authRoutes from "./routes/auth.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/genres", (req, res) => {
  res.json([
    { id: 1, name: "Pop",     color: "bg-pink-500",  cover: "/placeholder.svg?key=pop1" },
    { id: 2, name: "Hip-Hop", color: "bg-orange-500",cover: "/placeholder.svg?key=hiphop1" },
    { id: 3, name: "Rock",    color: "bg-red-500",   cover: "/placeholder.svg?key=rock1" },
  ]);
});

app.get("/top-charts", (req, res) => {
  res.json([
    { id: 1, title: "Summer Vibes", description: "Hot tracks of the season", cover: "/placeholder.svg?key=chart1" },
    { id: 2, title: "Indie Gems",   description: "Fresh indie picks",        cover: "/placeholder.svg?key=chart2" },
  ]);
});

app.get("/mood-playlists", (req, res) => {
  res.json([
    { id: 1, title: "Morning Boost", description: "Wake up energized", cover: "/placeholder.svg?key=mood1" },
    { id: 2, title: "Chill Night",   description: "Relax and unwind",  cover: "/placeholder.svg?key=mood2" },
  ]);
});

// Check
app.get("/devTest", (req, res) => {
  res.send("Hello world");
});

app.post("/login", (req, res) => {
  res.json({ token: "your-token-value" });
});

app.use("/api/friends", friendsRoutes);        // GET /api/friends
app.use("/api", blendsRoutes);                 // GET /api/personal-blends, GET /api/common-blends, POST /api/blends
app.use("/api/sessions", sessionsRoutes);
app.use("/profile", profileRoutes);
app.use("/user-songs", userSongsRoutes);
app.use("/auth", authRoutes);
// Server running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
