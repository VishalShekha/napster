import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { dyDB_client } from "../middleware/dynamo_config.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
dotenv.config();

const ddb = DynamoDBDocumentClient.from(dyDB_client);
const PLAYLISTS_TABLE = "playlists-Napster-DB";
const SONGS_TABLE = "Songs-Napster-DB";

// ========================== MIDDLEWARE: Verify JWT ==========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// ========================== CREATE PLAYLIST ==========================
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userEmail = req.user.email;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const playlistId = uuidv4();
    const playlist = {
      playlistId,
      emailid: userEmail,
      name: name.trim(),
      description: description?.trim() || "",
      songs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await ddb.send(
      new PutCommand({
        TableName: PLAYLISTS_TABLE,
        Item: playlist,
      })
    );

    res.status(201).json({
      message: "Playlist created successfully",
      data: playlist,
    });
  } catch (err) {
    console.error("❌ Error creating playlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== GET ALL USER PLAYLISTS ==========================
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const result = await ddb.send(
      new QueryCommand({
        TableName: PLAYLISTS_TABLE,
        KeyConditionExpression: "emailid = :email",
        ExpressionAttributeValues: {
          ":email": userEmail,
        },
      })
    );

    res.json({
      success: true,
      data: result.Items || [],
    });
  } catch (err) {
    console.error("❌ Error fetching playlists:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== GET SINGLE PLAYLIST ==========================
router.get("/:playlistId", authenticateToken, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userEmail = req.user.email;

    // Fetch the playlist from DynamoDB
    const playlistResult = await ddb.send(
      new GetCommand({
        TableName: PLAYLISTS_TABLE,
        Key: { emailid: userEmail, playlistId },
      })
    );

    if (!playlistResult.Item) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const playlist = playlistResult.Item;
    const songIds = playlist.songIds || [];

    // If no songs, return as-is
    if (songIds.length === 0) {
      return res.json({ success: true, data: { ...playlist, songs: [] } });
    }

    // Fetch all songs sequentially (or in parallel with Promise.all)
    const songs = [];
    for (const songId of songIds) {
      try {
        const songResult = await ddb.send(
          new QueryCommand({
            TableName: SONGS_TABLE,
            KeyConditionExpression: "email = :email AND id = :id",
            ExpressionAttributeValues: {
              ":email": '"' + userEmail + '"',
              ":id": songId,
            },
          })
        );

        if (songResult.Items) {
          const s = songResult.Items[0];
          console.log(s);
          songs.push({
            id: s.id,
            title: s.title,
            album: s.album ?? "Unknown Album",
            artist: s.artist ?? "Unknown Artist",
            genre: s.genre ?? "Unknown",
            duration: s.duration ?? "00:00",
            coverUrl: s.coverUrl ?? null,
            audioUrl: s.audioUrl ?? null,
            createdAt: s.createdAt,
          });
        }
      } catch (err) {
        console.error(`Error fetching song ${songId}:`, err);
      }
    }

    // Return playlist + songs
    return res.json({
      success: true,
      data: {
        ...playlist,
        songs,
      },
    });
  } catch (err) {
    console.error("Error fetching playlist:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== UPDATE PLAYLIST ==========================
router.put("/:playlistId", authenticateToken, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const userEmail = req.user.email;

    let updateExpression = "SET updatedAt = :updatedAt";
    const expressionAttributeValues = {
      ":updatedAt": new Date().toISOString(),
    };

    if (name) {
      updateExpression += ", #name = :name";
      expressionAttributeValues[":name"] = name.trim();
    }

    if (description !== undefined) {
      updateExpression += ", description = :description";
      expressionAttributeValues[":description"] = description.trim();
    }

    const result = await ddb.send(
      new UpdateCommand({
        TableName: PLAYLISTS_TABLE,
        Key: {
          emailid: userEmail,
          playlistId: playlistId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: name ? { "#name": "name" } : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );

    res.json({
      message: "Playlist updated successfully",
      data: result.Attributes,
    });
  } catch (err) {
    console.error("❌ Error updating playlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== DELETE PLAYLIST ==========================
router.delete("/:playlistId", authenticateToken, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userEmail = req.user.email;

    await ddb.send(
      new DeleteCommand({
        TableName: PLAYLISTS_TABLE,
        Key: {
          emailid: userEmail,
          playlistId: playlistId,
        },
      })
    );

    res.json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting playlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== ADD SONGS TO PLAYLIST ==========================
router.post("/:playlistId/songs", authenticateToken, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songIds } = req.body; // Just accept song IDs
    const userEmail = req.user.email;

    if (!songIds || !Array.isArray(songIds) || songIds.length === 0) {
      return res.status(400).json({ message: "Song IDs array is required" });
    }

    // First, get the current playlist
    const getResult = await ddb.send(
      new GetCommand({
        TableName: PLAYLISTS_TABLE,
        Key: {
          emailid: userEmail,
          playlistId: playlistId,
        },
      })
    );

    if (!getResult.Item) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Get current song IDs or initialize empty array
    const currentSongIds = Array.isArray(getResult.Item.songIds)
      ? getResult.Item.songIds
      : [];

    // Create a Set of existing song IDs for duplicate checking
    const existingSongIds = new Set(currentSongIds.map((id) => String(id)));

    // Filter out duplicates
    const newSongIds = songIds.filter((id) => !existingSongIds.has(String(id)));

    // If no new songs to add
    if (newSongIds.length === 0) {
      return res.status(400).json({
        message: "All selected songs are already in the playlist",
      });
    }

    // Combine current song IDs with new song IDs
    const updatedSongIds = [...currentSongIds, ...newSongIds];

    // Update the playlist with new song IDs
    const result = await ddb.send(
      new UpdateCommand({
        TableName: PLAYLISTS_TABLE,
        Key: {
          emailid: userEmail,
          playlistId: playlistId,
        },
        UpdateExpression: "SET songIds = :songIds, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":songIds": updatedSongIds,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    res.json({
      message: `${newSongIds.length} song(s) added successfully`,
      data: result.Attributes,
    });
  } catch (err) {
    console.error("❌ Error adding songs to playlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== REMOVE SONG FROM PLAYLIST ==========================
router.delete(
  "/:playlistId/songs/:songId",
  authenticateToken,
  async (req, res) => {
    try {
      const { playlistId, songId } = req.params;
      const userEmail = req.user.email;

      // Get current playlist
      const getResult = await ddb.send(
        new GetCommand({
          TableName: PLAYLISTS_TABLE,
          Key: {
            emailid: userEmail,
            playlistId: playlistId,
          },
        })
      );

      if (!getResult.Item) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      const currentSongIds = getResult.Item.songIds || [];
      const updatedSongIds = currentSongIds.filter(
        (id) => String(id) !== String(songId)
      );

      // Update playlist with removed song
      await ddb.send(
        new UpdateCommand({
          TableName: PLAYLISTS_TABLE,
          Key: {
            emailid: userEmail,
            playlistId: playlistId,
          },
          UpdateExpression: "SET songIds = :songIds, updatedAt = :updatedAt",
          ExpressionAttributeValues: {
            ":songIds": updatedSongIds,
            ":updatedAt": new Date().toISOString(),
          },
        })
      );

      res.json({
        success: true,
        message: "Song removed from playlist",
      });
    } catch (err) {
      console.error("❌ Error removing song from playlist:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
