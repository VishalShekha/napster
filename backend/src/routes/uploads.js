import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dyDB_client } from "../middleware/dynamo_config.js";
import { s3_client } from "../middleware/s3_config.js";
import AWS from "aws-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

dotenv.config();
console.log("🔍 ENV CHECK:", process.env.AWS_ACCESS_KEY_ID, process.env.AWS_REGION);

const router = express.Router();

// AWS clients
const ddb = DynamoDBDocumentClient.from(dyDB_client);

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});


const sns = new AWS.SNS();

async function notifyUpload(title, artist, email) {
  const params = {
    Message: `🎵 New song uploaded!\nTitle: ${title}\nArtist: ${artist}\nUploaded by: ${email}`,
    TopicArn: "arn:aws:sns:ap-south-1:050963339477:songUploadNotifications"
  };
  await sns.publish(params).promise();
  console.log("✅ SNS Email notification sent!");
}

const SONGS_TABLE = "Songs-Napster-DB";
const S3_BUCKET = "napster-bucket-123456"; // replace with your actual bucket name

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: generate simple unique ID
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// ========================== UPLOAD SONG ==========================
router.post(
  "/",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverArt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { email, title, artist, album, genre, description, ratings } = req.body;
      const audioFile = req.files["audio"] ? req.files["audio"][0] : null;
      const coverFile = req.files["coverArt"] ? req.files["coverArt"][0] : null;

      // ✅ Allow upload even if cover art is missing
      if (!audioFile) {
        return res.status(400).json({ message: "Audio file is required" });
      }


      // Generate unique S3 keys
      const audioKey = `audio/${generateId()}-${audioFile.originalname}`;
      

      // Upload audio to S3
      await s3_client.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: audioKey,
          Body: audioFile.buffer,
          ContentType: audioFile.mimetype,
        })
      );

      // Upload cover art to S3
      let coverUrl = null;
        if (coverFile) {
          const coverKey = `cover/${generateId()}-${coverFile.originalname}`;
          await s3_client.send(
            new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: coverKey,
              Body: coverFile.buffer,
              ContentType: coverFile.mimetype,
            })
          );
          coverUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${coverKey}`;
        }

      // Prepare metadata for DynamoDB
      const songItem = {
        email,
        id: generateId(),
        title,
        artist,
        album,
        genre,
        description,
        ratings: JSON.parse(ratings || "{}"), // parse ratings JSON
        audioUrl: `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${audioKey}`,
        coverUrl,
        createdAt: new Date().toISOString(),
      };

      // Store metadata in DynamoDB
      await ddb.send(
        new PutCommand({
          TableName: SONGS_TABLE,
          Item: songItem,
        })
      );

      await notifyUpload(title, artist, email);

      res.status(201).json({
        message: "Song uploaded successfully",
        data: songItem,
      });
    } catch (err) {
      console.error("❌ Error uploading song:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
