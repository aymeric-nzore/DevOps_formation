import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import os from "os";
import Redis from "ioredis";
dotenv.config();
const app = express();
app.use(express.json());

//redis
const redis = new Redis({
  host: "redis",
  port: 6379,
});
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Mongo connected");
  } catch (err) {
    console.log("Mongo error, retry...");
    setTimeout(connectDB, 5000);
  }
}
connectDB();

// MODEL
const User = mongoose.model("User", {
  name: String,
});
//Circuit breaker
let isOpen = false;
let failureCount = 0;
// routes
app.get("/", (req, res) => {
  res.send(`Hello from ${HOST}`);
});

app.get("/health", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).send("OK");
  } else {
    res.status(500).send("DB DOWN");
  }
});

app.post("/user", async (req, res) => {
  if (isOpen) {
    return res.status(503).json({
      error: "Service temporairement indisponible",
    });
  }
  try {
    const cached = await redis.get("users");
    if (cached) {
      console.log("CACHE present");
      return res.json(JSON.parse(cached));
    }
    console.log("cache absent");
    const users = await User.find();

    await redis.set("users", JSON.stringify(users), "EX", 10);
    res.json(users);
  } catch (e) {
    failureCount++;

    if (failureCount >= 3) {
      circuitOpen = true;

      console.log("Circuit OPEN");

      setTimeout(() => {
        circuitOpen = false;
        failureCount = 0;
        console.log("Circuit RESET");
      }, 10000);
    }

    res.status(503).json({ error: "DB error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
