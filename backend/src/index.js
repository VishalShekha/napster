import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile.js";
import userSongsRoutes from "./routes/user-songs.js";
import notificationsRoutes from "./routes/notifications.js";
import genresRoutes from "./routes/genres.js";
import topChartsRoutes from "./routes/topCharts.js";
import moodPlaylistsRoutes from "./routes/moodPlaylists.js";
import friendsRoutes from "./routes/friends.js";
import blendsRoutes from "./routes/blends.js";
import sessionsRoutes from "./routes/sessions.js";
import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search.js";
import playlistRoutes from "./routes/playlists.js";
import usersRoutes from "./routes/users.js";
import uploadRoutes from "./routes/uploads.js";
import rec from "./routes/rec.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend's URL
    credentials: true, // allow cookies / tokens
  })
);

app.use(express.urlencoded({ extended: true }));

// Check
app.get("/devTest", (req, res) => {
  res.send("Hello world");
});

app.post("/login", (req, res) => {
  res.json({ token: "your-token-value" });
});

app.use("/profile", profileRoutes);
app.use("/user-songs", userSongsRoutes);
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/playlists", playlistRoutes);
app.use("/users", usersRoutes);
app.use("/api/rec", rec);
app.use("/api/upload", uploadRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/genres", genresRoutes);
app.use("/api/top-charts", topChartsRoutes);
app.use("/api/mood-playlists", moodPlaylistsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api", blendsRoutes);

// Server running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
