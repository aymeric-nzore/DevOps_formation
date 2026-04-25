import express from "express";
import { createClient } from "redis";
import { Client } from "pg";
const app = express();
app.use(express.json());

//connexion redis
const redis = createClient({
  url: process.env.REDIS_URL,
});
async function connectRedis() {
  try {
    await redis.connect();
    console.log("Redis connected ✅");
  } catch (err) {
    console.log("Redis not ready, retrying... 🔁");
    setTimeout(connectRedis, 3000);
  }
}

connectRedis();

//postgres
const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
async function connectDB() {
  try {
    await db.connect();
    console.log("Postgres connected ✅");
  } catch (err) {
    console.log("Postgres not ready, retrying... 🔁");
    setTimeout(connectDB, 3000);
  }
}

connectDB();
// test
app.get("/", (req, res) => {
  res.send("API OK 🚀");
});

//route avec cache
app.get("/users", async (req, res) => {
  const cached = await redis.get("users");

  if (cached) {
    console.log("CACHE HIT");
    return res.json(JSON.parse(cached));
  }

  console.log("CACHE MISS");

  const result = await db.query("SELECT * FROM users");

  await redis.setEx("users", 10, JSON.stringify(result.rows));

  res.json(result.rows);
});

//ajout user
app.post("/users", async (req, res) => {
  const { name } = req.body;

  await db.query("INSERT INTO users(name) VALUES($1)", [name]);

  await redis.del("users");

  res.send("User ajouté");
});

app.listen(3000, () => {
  console.log("Server running");
});
