import express from "express";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";

import { dyDB_client } from "../middleware/dynamo_config.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = express.Router();
const ddb = DynamoDBDocumentClient.from(dyDB_client);

const HISTORY_TABLE = "user-listening-history";
const SONGS_TABLE = "Songs-Napster-DB";

/* =========================================================
   ✅ TOP SONGS LISTENED BY USER  (Jump Back In)
   ✅ Uses BatchGet & handles missing songs safely
========================================================= */
router.get("/top-songs/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.email;
    if (!userId)
      return res.status(400).json({ error: "Missing user in token" });

    // ✅ 1. Fetch listening history
    const historyRes = await ddb.send(
      new QueryCommand({
        TableName: HISTORY_TABLE,
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: { ":u": userId },
      })
    );

    const history = historyRes.Items || [];
    if (history.length === 0) return res.json({ topSongs: [] });

    // ✅ 2. Sort by lastPlayed and take top 4
    const top4 = history
      .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
      .slice(0, 4);

    // ✅ 3. Prepare BatchGet keys
    const songKeys = top4.map((h) => ({
      email: "global",
      id: h.songId,
    }));

    // ✅ 4. Fetch ONLY those songs
    const songsRes = await ddb.send(
      new BatchGetCommand({
        RequestItems: {
          [SONGS_TABLE]: { Keys: songKeys },
        },
      })
    );

    const songs = songsRes?.Responses?.[SONGS_TABLE] || [];

    // ✅ 5. Merge history + actual songs (skip missing songs)
    const merged = top4
      .map((h) => {
        const match = songs.find((s) => s.id === h.songId);
        if (!match) return null; // Skip missing songs
        return {
          ...match,
          listenCount: h.listenCount,
          lastPlayed: h.lastPlayed,
        };
      })
      .filter(Boolean); // remove null

    return res.json({ topSongs: merged });
  } catch (err) {
    console.error("ERROR /top-songs/user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   ✅ MADE FOR YOU — Mood Recommendations
   ✅ No SCAN — Uses BatchGet
========================================================= */
router.get("/made-for-you", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.email;

    const historyRes = await ddb.send(
      new QueryCommand({
        TableName: HISTORY_TABLE,
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: { ":u": userId },
      })
    );

    const history = historyRes.Items || [];
    if (history.length === 0) return res.json({ recommended: [] });

    // ✅ Count moods
    const moodScore = {};
    for (let item of history) {
      const mood = item.mood?.toLowerCase();
      if (!mood) continue;
      moodScore[mood] = (moodScore[mood] || 0) + item.listenCount;
    }

    // ✅ Top 3 moods
    const topMoods = Object.entries(moodScore)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((x) => x[0]);

    // ✅ Get all unique songIds from DB via BatchGet
    // Extract unique IDs from history (safer)
    const uniqueSongIds = [...new Set(history.map((h) => h.songId))];

    const songKeys = uniqueSongIds.map((id) => ({
      email: "global",
      id,
    }));

    const songsRes = await ddb.send(
      new BatchGetCommand({
        RequestItems: {
          [SONGS_TABLE]: { Keys: songKeys },
        },
      })
    );

    const allSongs = songsRes?.Responses?.[SONGS_TABLE] || [];

    // ✅ Calculate mood score
    const recommended = allSongs
      .map((song) => {
        const r = song.ratings || {};
        let score = 0;
        for (let m of topMoods) {
          score += Number(r[m] || 0);
        }
        return { ...song, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return res.json({ recommended });
  } catch (err) {
    console.error("ERROR /made-for-you:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   ✅ STORE / UPDATE LISTENING HISTORY
   ✅ Validate song using GSI (no scan)
========================================================= */
router.post("/listen", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.email;
    const { songId } = req.body;

    if (!userId) return res.status(400).json({ error: "User missing" });
    if (!songId) return res.status(400).json({ error: "songId required" });

    // ✅ Validate song via GSI
    const songRes = await ddb.send(
      new QueryCommand({
        TableName: SONGS_TABLE,
        IndexName: "GSI_id",
        KeyConditionExpression: "id = :sid",
        ExpressionAttributeValues: { ":sid": String(songId) },
      })
    );

    if (!songRes.Items || songRes.Items.length === 0)
      return res.status(404).json({ error: "Song not found" });

    const mood = "happy"; // You can compute dynamically later

    const existing = await ddb.send(
      new GetCommand({
        TableName: HISTORY_TABLE,
        Key: { userId, songId: String(songId) },
      })
    );

    if (existing.Item) {
      await ddb.send(
        new UpdateCommand({
          TableName: HISTORY_TABLE,
          Key: { userId, songId: String(songId) },
          UpdateExpression:
            "SET listenCount = if_not_exists(listenCount, :zero) + :inc, mood = :m, lastPlayed = :t",
          ExpressionAttributeValues: {
            ":inc": 1,
            ":m": mood,
            ":t": new Date().toISOString(),
            ":zero": 0,
          },
        })
      );
    } else {
      await ddb.send(
        new PutCommand({
          TableName: HISTORY_TABLE,
          Item: {
            userId,
            songId: String(songId),
            mood,
            listenCount: 1,
            lastPlayed: new Date().toISOString(),
          },
        })
      );
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("ERROR /listen:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   ✅ USER TOTAL LISTEN COUNT
========================================================= */
router.get("/stats/user-summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.email;

    const historyRes = await ddb.send(
      new QueryCommand({
        TableName: HISTORY_TABLE,
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: { ":u": userId },
      })
    );

    const history = historyRes.Items || [];

    let totalListenCount = 0;
    history.forEach((i) => (totalListenCount += i.listenCount || 0));

    return res.json({
      totalListenCount,
      totalSongsPlayed: history.length,
    });
  } catch (err) {
    console.error("ERROR /stats/user-summary:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
