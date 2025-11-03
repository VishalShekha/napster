import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { dyDB_client } from "../middleware/dynamo_config.js";

dotenv.config();
const router = express.Router();
const ddb = DynamoDBDocumentClient.from(dyDB_client);

const USERS_TABLE = "user-Napster-DB";

// ========================== MIDDLEWARE: Verify JWT ==========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// ========================== GET USER PROFILE ==========================
router.get("/", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;

    const result = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { emailid: email },
      })
    );

    if (!result.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.Item;

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.emailid,
        dob: user.dob,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== UPDATE USER PROFILE ==========================
router.put("/", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { name, dob, oldPassword, newPassword } = req.body;

    // Fetch existing user
    const existingUser = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { emailid: email },
      })
    );

    if (!existingUser.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateExpression = "SET updatedAt = :updatedAt";
    const expressionAttributeValues = {
      ":updatedAt": new Date().toISOString(),
    };
    const expressionAttributeNames = {};

    // ✅ Update name
    if (name) {
      updateExpression += ", #name = :name";
      expressionAttributeNames["#name"] = "name";
      expressionAttributeValues[":name"] = name.trim();
    }

    // ✅ Update DOB
    if (dob) {
      updateExpression += ", dob = :dob";
      expressionAttributeValues[":dob"] = dob;
    }

    // ✅ Handle password update (oldPassword required)
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Old password is required" });
      }

      const validPass = await bcrypt.compare(
        oldPassword,
        existingUser.Item.password
      );

      if (!validPass) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      const hashedPass = await bcrypt.hash(newPassword, 10);
      updateExpression += ", password = :password";
      expressionAttributeValues[":password"] = hashedPass;
    }

    // ✅ Save updates
    const updateResult = await ddb.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { emailid: email },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames:
          Object.keys(expressionAttributeNames).length > 0
            ? expressionAttributeNames
            : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );

    const updatedUser = updateResult.Attributes;

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: updatedUser.name,
        email: updatedUser.emailid,
        dob: updatedUser.dob,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
