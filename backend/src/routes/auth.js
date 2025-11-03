import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { dyDB_client } from "../middleware/dynamo_config.js";

const router = express.Router();
dotenv.config();

const ddb = DynamoDBDocumentClient.from(dyDB_client);
const USERS_TABLE = "user-Napster-DB";

// ========================== REGISTER ==========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    if (!name || !email || !password || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { emailid: email },
      })
    );

    if (existingUser.Item) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      emailid: email,
      name,
      dob,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await ddb.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== LOGIN ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { emailid: email },
      })
    );

    if (!result.Item) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.Item;

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { email: user.emailid, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        email: user.emailid,
        name: user.name,
        dob: user.dob,
      },
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// ========================== LOGOUT ==========================
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "No token provided" });
  }

  // ✅ FRONTEND will remove token — backend just confirms logout
  return res.json({ message: "Logged out successfully" });
});

export default router;
