import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// ✅ S3 Configuration
export const s3_client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
  },
});
