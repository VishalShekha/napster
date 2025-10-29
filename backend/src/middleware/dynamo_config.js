import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

// ✅ DynamoDB Configuration
export const dyDB_client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_DDB,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_DDB,
  },
});