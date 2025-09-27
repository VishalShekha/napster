import express from "express";
import cors from "cors";
import dotenv from "dotenv";
  

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Check
app.get("/devTest", (req, res) => {
  res.send("Hello world");
});

app.post("/login", (req, res) => {
  res.json({ token: "your-token-value" });
});

// Server running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
