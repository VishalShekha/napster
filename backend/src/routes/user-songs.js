// routes/user-songs.js
import express from "express";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dyDB_client } from "../middleware/dynamo_config.js";

const router = express.Router();
const ddb = DynamoDBDocumentClient.from(dyDB_client);

const SONGS_TABLE = "Songs-Napster-DB";

// GET all songs for a given user email
router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Query DynamoDB by email (assuming email is partition key)
    const data = await ddb.send(
      new QueryCommand({
        TableName: SONGS_TABLE,
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );

    const songs = data.Items.map((item) => ({
      id: item.id,
      title: item.title,
      album: item.album,
      plays: item.plays || 0,
      duration: item.duration || "00:00",
      status: item.status || "published",
      uploadDate: item.createdAt,
      cover: item.coverUrl,
      audioUrl: item.audioUrl,
    }));

    res.json(songs);
  } catch (err) {
    console.error("❌ Error fetching user songs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
