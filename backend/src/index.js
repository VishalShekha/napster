import express from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< HEAD
import profileRoutes from "./routes/profile.js";
import userSongsRoutes from "./routes/user-songs.js";
=======
  
import genresRoutes from "./routes/genres.js";
import topChartsRoutes from "./routes/topCharts.js";
import moodPlaylistsRoutes from "./routes/moodPlaylists.js";
>>>>>>> 277c3b3a3fe592f3d4c5fe4b57d4718229553336
import friendsRoutes from "./routes/friends.js";
import blendsRoutes from "./routes/blends.js";
import sessionsRoutes from "./routes/sessions.js";
import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Check
app.get("/devTest", (req, res) => {
  res.send("Hello world");
});

app.post("/login", (req, res) => {
  res.json({ token: "your-token-value" });
});

<<<<<<< HEAD
app.use("/api/friends", friendsRoutes);        // GET /api/friends
app.use("/api", blendsRoutes);                 // GET /api/personal-blends, GET /api/common-blends, POST /api/blends
app.use("/api/sessions", sessionsRoutes);
app.use("/profile", profileRoutes);
app.use("/user-songs", userSongsRoutes);
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
=======
app.use("/api/friends", friendsRoutes);        
app.use("/api", blendsRoutes);                 
app.use("/api/genres", genresRoutes);
app.use("/api/top-charts", topChartsRoutes);
app.use("/api/mood-playlists", moodPlaylistsRoutes);


>>>>>>> 277c3b3a3fe592f3d4c5fe4b57d4718229553336
// Server running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
