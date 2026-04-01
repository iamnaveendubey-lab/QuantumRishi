import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const MEMORY_FILE = path.join(DATA_DIR, "memory.json");

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
  }
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
  }
  try {
    await fs.access(MEMORY_FILE);
  } catch {
    await fs.writeFile(MEMORY_FILE, JSON.stringify({}));
  }
}

async function startServer() {
  await ensureDataDir();
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Auth Mock
  app.post("/api/auth/login", async (req, res) => {
    const { email } = req.body;
    const users = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
    let user = users.find((u: any) => u.email === email);
    if (!user) {
      user = { id: Date.now().toString(), email, name: email.split("@")[0] };
      users.push(user);
      await fs.writeFile(USERS_FILE, JSON.stringify(users));
    }
    res.json({ user });
  });

  // Profile Update
  app.post("/api/user/profile", async (req, res) => {
    const { userId, profile } = req.body;
    const users = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profile };
      await fs.writeFile(USERS_FILE, JSON.stringify(users));
      res.json({ user: users[userIndex] });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Memory Engine
  app.get("/api/memory/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const fileData = await fs.readFile(MEMORY_FILE, "utf-8");
      const currentMemory = JSON.parse(fileData);
      const userMemory = currentMemory[userId] || {
        stressLevel: 0,
        confidenceLevel: 0,
        consistencyScore: 0,
        recentPerformance: [],
        patterns: [],
        history: [],
        weakAreas: [],
        studyGoalProgress: 0
      };
      res.json(userMemory);
    } catch (err) {
      res.json({ history: [] });
    }
  });

  app.post("/api/memory/:userId", async (req, res) => {
    const { userId } = req.params;
    const { update } = req.body;
    const memory = JSON.parse(await fs.readFile(MEMORY_FILE, "utf-8"));
    memory[userId] = { ...(memory[userId] || {}), ...update };
    await fs.writeFile(MEMORY_FILE, JSON.stringify(memory));
    res.json(memory[userId]);
  });

  // AI Mentor Chat - DEPRECATED (Logic moved to frontend)
  app.post("/api/chat", async (req, res) => {
    res.status(410).json({ error: "Endpoint moved to frontend" });
  });

  // Reflection System - DEPRECATED (Logic moved to frontend)
  app.post("/api/reflection", async (req, res) => {
    res.status(410).json({ error: "Endpoint moved to frontend" });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quantum Rishi Server running on http://localhost:${PORT}`);
  });
}

startServer();
