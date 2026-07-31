// csv-to-json.mjs
//
// content/episodes.csv ko parse karke content/episodes.json banata hai.
// Dashboard aur render script dono isi episodes.json ko padhte hain -- CSV ko
// seedha nahi (kyunke JSON parse karna zyada reliable hai).
//
// Chalane ka tareeka: node scripts/csv-to-json.mjs
// (Ya bas: npm run csv-to-json)

import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";

const CSV_PATH = path.resolve("content/episodes.csv");
const JSON_PATH = path.resolve("content/episodes.json");

const VALID_STATUSES = ["draft", "script_ready", "voice_ready", "video_rendered", "uploaded"];

try {
  const csvText = await fs.readFile(CSV_PATH, "utf-8");

  const rows = parse(csvText, {
    columns: true, // pehli row ko header (column names) samjho
    skip_empty_lines: true,
    trim: true,
  });

  const episodes = rows.map((row, index) => {
    // Agar status column khali ho ya galat value ho, to "draft" default rakho
    const status = VALID_STATUSES.includes(row.status) ? row.status : "draft";

    if (!row.id) {
      console.warn(`[Warning] Row ${index + 2} mein 'id' khali hai -- skip ho sakta hai renders mein.`);
    }

    return {
      id: row.id || `EP-ROW${index + 2}`,
      date: row.date || "",
      title: row.title || "",
      hook: row.hook || "",
      fact: row.fact || "",
      twist: row.twist || "",
      reflection: row.reflection || "",
      cta: row.cta || "",
      status,
      notes: row.notes || "",
    };
  });

  await fs.writeFile(JSON_PATH, JSON.stringify(episodes, null, 2), "utf-8");
  console.log(`✅ ${episodes.length} episodes converted -> ${JSON_PATH}`);
} catch (err) {
  console.error(`[Error] ${err.message}`);
  process.exit(1);
}
