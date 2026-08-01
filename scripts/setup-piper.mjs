#!/usr/bin/env node
/**
 * setup-piper.mjs
 *
 * Downloads the Piper TTS Linux binary and en_US-lessac-medium voice model
 * into the `piper/` directory if they are not already present.
 * Run automatically on startup (see workflow command in .replit / replit.md).
 *
 * Piper release: 2023.11.14-2 (latest stable with bundled espeak-ng)
 * Model: en_US-lessac-medium (good quality, ~60 MB)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createWriteStream, existsSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { spawn } from "node:child_process";

const PIPER_DIR = path.resolve("piper");
const PIPER_BIN = path.join(PIPER_DIR, "piper");

const PIPER_RELEASE_URL =
  "https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz";

const MODEL_BASE =
  "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium";
const MODEL_ONNX = path.join(PIPER_DIR, "en_US-lessac-medium.onnx");
const MODEL_JSON = path.join(PIPER_DIR, "en_US-lessac-medium.onnx.json");

async function fetchTo(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const tmp = dest + ".tmp";
  await pipeline(res.body, createWriteStream(tmp));
  await fs.rename(tmp, dest);
}

async function extractTarGz(tarPath, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  return new Promise((resolve, reject) => {
    const tar = spawn("tar", ["-xzf", tarPath, "-C", destDir, "--strip-components=1"], {
      stdio: "inherit",
    });
    tar.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`tar exit ${code}`))));
  });
}

async function ensurePiperBinary() {
  if (existsSync(PIPER_BIN)) {
    console.log("✅ Piper binary already present.");
    return;
  }
  console.log("⬇️  Downloading Piper Linux binary (~25 MB)…");
  const tmp = path.join(PIPER_DIR, "piper_linux.tar.gz");
  await fs.mkdir(PIPER_DIR, { recursive: true });
  await fetchTo(PIPER_RELEASE_URL, tmp);
  await extractTarGz(tmp, PIPER_DIR);
  await fs.unlink(tmp).catch(() => {});
  await fs.chmod(PIPER_BIN, 0o755);
  // also chmod helper binaries bundled alongside piper
  for (const bin of ["espeak-ng", "piper_phonemize"]) {
    const p = path.join(PIPER_DIR, bin);
    if (existsSync(p)) await fs.chmod(p, 0o755);
  }
  console.log("✅ Piper binary ready.");
}

async function ensureVoiceModel() {
  if (existsSync(MODEL_ONNX) && existsSync(MODEL_JSON)) {
    console.log("✅ Voice model already present.");
    return;
  }
  console.log("⬇️  Downloading en_US-lessac-medium voice model (~60 MB)…");
  await fetchTo(`${MODEL_BASE}/en_US-lessac-medium.onnx`, MODEL_ONNX);
  await fetchTo(`${MODEL_BASE}/en_US-lessac-medium.onnx.json`, MODEL_JSON);
  console.log("✅ Voice model ready.");
}

async function ensureOutputDirs() {
  await fs.mkdir(path.resolve("output"), { recursive: true });
  await fs.mkdir(path.resolve("remotion/public/audio"), { recursive: true });
}

(async () => {
  try {
    await ensureOutputDirs();
    await ensurePiperBinary();
    await ensureVoiceModel();
    console.log("🎙️  Piper setup complete — TTS is ready.");
  } catch (err) {
    console.error("❌ Piper setup failed:", err.message);
    console.error("   Voice generation will not work until this is resolved.");
    // Don't exit 1 — let the dashboard still start even if piper setup fails
  }
})();
