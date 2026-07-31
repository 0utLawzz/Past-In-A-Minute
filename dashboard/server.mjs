// server.mjs
//
// Ye ek LOCAL server hai -- sirf aapke PC pe chalta hai (http://localhost:4321).
// Koi cloud database nahi, koi external API nahi (siwaye optional Google Sheet
// fetch ke, jo bhi sirf public CSV link se hoti hai). Saara data content/episodes.json
// mein bas ek file ke roop mein rehta hai.
//
// Chalane ka tareeka: npm run dashboard
// Phir browser mein kholein: http://localhost:4321

import express from "express";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const app = express();
const PORT = process.env.PORT || 4321;

const EPISODES_JSON = path.resolve("content/episodes.json");
const EPISODES_CSV = path.resolve("content/episodes.csv");
const VALID_STATUSES = ["draft", "script_ready", "voice_ready", "video_rendered", "uploaded"];

app.use(express.json());
app.use(express.static(path.resolve("dashboard/public")));
const upload = multer({ storage: multer.memoryStorage() });

async function readEpisodes() {
  try {
    const raw = await fs.readFile(EPISODES_JSON, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeEpisodes(episodes) {
  await fs.writeFile(EPISODES_JSON, JSON.stringify(episodes, null, 2), "utf-8");
  // CSV bhi hamesha sync rakhte hain, taake aap Excel mein bhi khol sakein
  const csv = stringify(episodes, { header: true });
  await fs.writeFile(EPISODES_CSV, csv, "utf-8");
}

// GET /api/episodes -- checklist ke liye poori list
app.get("/api/episodes", async (_req, res) => {
  res.json(await readEpisodes());
});

// POST /api/episodes -- manual form se naya episode add karna
app.post("/api/episodes", async (req, res) => {
  const episodes = await readEpisodes();
  const newEpisode = {
    id: req.body.id || `EP${String(episodes.length + 1).padStart(3, "0")}`,
    date: req.body.date || "",
    title: req.body.title || "",
    hook: req.body.hook || "",
    fact: req.body.fact || "",
    twist: req.body.twist || "",
    reflection: req.body.reflection || "",
    cta: req.body.cta || "",
    status: "draft",
    notes: req.body.notes || "",
  };
  episodes.push(newEpisode);
  await writeEpisodes(episodes);
  res.json(newEpisode);
});

// PATCH /api/episodes/:id -- edit ya status update (checklist ke checkboxes isi se chalte hain)
app.patch("/api/episodes/:id", async (req, res) => {
  const episodes = await readEpisodes();
  const idx = episodes.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Episode nahi mila" });

  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: `Invalid status. Valid: ${VALID_STATUSES.join(", ")}` });
  }

  episodes[idx] = { ...episodes[idx], ...req.body };
  await writeEpisodes(episodes);
  res.json(episodes[idx]);
});

// DELETE /api/episodes/:id
app.delete("/api/episodes/:id", async (req, res) => {
  const episodes = await readEpisodes();
  const filtered = episodes.filter((e) => e.id !== req.params.id);
  await writeEpisodes(filtered);
  res.json({ deleted: req.params.id });
});

// POST /api/upload-csv -- ek CSV file upload kar ke bulk episodes import karna
app.post("/api/upload-csv", upload.single("file"), async (req, res) => {
  try {
    const rows = parse(req.file.buffer.toString("utf-8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    const episodes = rows.map((row, i) => ({
      id: row.id || `EP-ROW${i + 2}`,
      date: row.date || "",
      title: row.title || "",
      hook: row.hook || "",
      fact: row.fact || "",
      twist: row.twist || "",
      reflection: row.reflection || "",
      cta: row.cta || "",
      status: VALID_STATUSES.includes(row.status) ? row.status : "draft",
      notes: row.notes || "",
    }));
    await writeEpisodes(episodes);
    res.json({ imported: episodes.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/sync-sheet -- Google Sheet (published CSV link) se sync karna
app.post("/api/sync-sheet", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Sheet CSV URL missing" });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} -- kya sheet published hai?`);
    const csvText = await response.text();
    const rows = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });
    const episodes = rows.map((row, i) => ({
      id: row.id || `EP-ROW${i + 2}`,
      date: row.date || "",
      title: row.title || "",
      hook: row.hook || "",
      fact: row.fact || "",
      twist: row.twist || "",
      reflection: row.reflection || "",
      cta: row.cta || "",
      status: VALID_STATUSES.includes(row.status) ? row.status : "draft",
      notes: row.notes || "",
    }));
    await writeEpisodes(episodes);
    res.json({ synced: episodes.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/generate-voice/:id -- TTS trigger karna dashboard se hi
app.post("/api/generate-voice/:id", async (req, res) => {
  const child = spawn("node", ["scripts/tts.mjs", req.params.id], { stdio: "pipe" });
  let output = "";
  child.stdout.on("data", (d) => (output += d.toString()));
  child.stderr.on("data", (d) => (output += d.toString()));
  child.on("close", (code) => {
    res.json({ success: code === 0, log: output });
  });
});

// POST /api/render/:id -- video render trigger karna dashboard se hi
app.post("/api/render/:id", async (req, res) => {
  const child = spawn("node", ["scripts/render.mjs", req.params.id], { stdio: "pipe" });
  let output = "";
  child.stdout.on("data", (d) => (output += d.toString()));
  child.stderr.on("data", (d) => (output += d.toString()));
  child.on("close", (code) => {
    res.json({ success: code === 0, log: output });
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Past In A Minute Dashboard chal raha hai:`);
  console.log(`   http://localhost:${PORT}\n`);
});
