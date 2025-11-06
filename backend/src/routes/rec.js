// routes/user-songs.js
import express from "express";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dyDB_client } from "../middleware/dynamo_config.js";

const router = express.Router();
const ddb = DynamoDBDocumentClient.from(dyDB_client);

const SONGS_TABLE = "Songs-Napster-DB";

// GET happy & similar songs for a given user
router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });
    

    // Fetch all songs for this user
    const data = await ddb.send(
      new QueryCommand({
        TableName: SONGS_TABLE,
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );

    if (!data.Items || data.Items.length === 0) {
      return res.json([]);
    }

    // Define mood closeness order (most similar to "happy" first)
    const moodOrder = ["happy", "party", "rock", "classic", "instrumental", "sad"];

    // Compute a “happiness score” based on proximity to “happy” mood
    const sortedSongs = data.Items.sort((a, b) => {
      const aRatings = a.ratings || {};
      const bRatings = b.ratings || {};

      const aScore = moodOrder.reduce((score, mood, idx) => {
        return score + ((aRatings[mood] || 0) * (moodOrder.length - idx));
      }, 0);

      const bScore = moodOrder.reduce((score, mood, idx) => {
        return score + ((bRatings[mood] || 0) * (moodOrder.length - idx));
      }, 0);

      return bScore - aScore; // Descending order
    });

    // Map only required song details
    const songs = sortedSongs.map((item) => ({
      id: item.id,
      title: item.title,
      album: item.album,
      genre: item.genre,
      cover: item.coverUrl,
      audioUrl: item.audioUrl,
      ratings: item.ratings,
      createdAt: item.createdAt,
    }));

    console.log(`✅ Fetched ${songs.length} happy songs for user: ${email}`);
    res.json(songs);
  } catch (err) {
    console.error("❌ Error fetching happy songs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
