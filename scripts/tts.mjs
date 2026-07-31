// tts.mjs
//
// Ye script har episode ke 5 lines (hook+fact+twist+reflection+cta) ko jodkar
// ek script banata hai, aur PIPER (free, fully offline, neural TTS) se voice-over
// generate karta hai. Koi API key, koi internet, koi paid service nahi chahiye --
// bas ek chota Piper voice-model file (one-time download, README mein steps hain).
//
// Chalane ka tareeka: node scripts/tts.mjs EP001
// (ya sab pending episodes ke liye:  node scripts/tts.mjs --all)

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const EPISODES_JSON = path.resolve("content/episodes.json");
const AUDIO_DIR = path.resolve("remotion/public/audio");

// Piper executable ka path -- Windows pe aam taur pe piper.exe hota hai jo
// aap ne piper/ folder mein rakha hoga (README dekhein download ke liye)
const PIPER_EXE = process.env.PIPER_PATH || path.resolve("piper/piper.exe");
const PIPER_MODEL = process.env.PIPER_MODEL || path.resolve("piper/en_US-lessac-medium.onnx");

async function ensureAudioDir() {
  await fs.mkdir(AUDIO_DIR, { recursive: true });
}

function buildScriptText(ep) {
  // Har scene ke darmiyan chota pause (comma se) taake voice natural lage
  return [ep.hook, ep.fact, ep.twist, ep.reflection, ep.cta].join(" ... ");
}

function runPiper(text, outputFile) {
  return new Promise((resolve, reject) => {
    const piper = spawn(PIPER_EXE, ["--model", PIPER_MODEL, "--output_file", outputFile]);

    piper.stdin.write(text);
    piper.stdin.end();

    let stderr = "";
    piper.stderr.on("data", (d) => (stderr += d.toString()));

    piper.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(
            `Piper exit code ${code}.\n${stderr}\n\n` +
              `Check: (1) Piper installed hai? (2) PIPER_PATH sahi hai? (3) Model file (${PIPER_MODEL}) maujood hai?\n` +
              `Setup steps README.md ke "Voice-over Setup (Piper TTS)" section mein hain.`
          )
        );
    });

    piper.on("error", (err) => {
      reject(
        new Error(
          `Piper chal nahi saka: ${err.message}\n` +
            `Piper installed nahi hai shayad. README.md ka "Voice-over Setup" section follow karein.`
        )
      );
    });
  });
}

async function generateForEpisode(ep) {
  const outputFile = path.join(AUDIO_DIR, `${ep.id}.wav`);
  const text = buildScriptText(ep);

  console.log(`\n🎙️  Generating voice-over for ${ep.id} — "${ep.title}"`);
  await runPiper(text, outputFile);
  console.log(`   ✅ Saved: ${outputFile}`);

  return outputFile;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/tts.mjs <EPISODE_ID>   OR   node scripts/tts.mjs --all');
    process.exit(1);
  }

  const episodesRaw = await fs.readFile(EPISODES_JSON, "utf-8");
  const episodes = JSON.parse(episodesRaw);
  await ensureAudioDir();

  const targets =
    arg === "--all"
      ? episodes.filter((e) => e.status === "script_ready")
      : episodes.filter((e) => e.id === arg);

  if (targets.length === 0) {
    console.log("Koi matching episode nahi mila (status 'script_ready' honi chahiye --all ke liye).");
    return;
  }

  for (const ep of targets) {
    try {
      await generateForEpisode(ep);
      ep.status = "voice_ready";
    } catch (err) {
      console.error(`   ❌ Failed for ${ep.id}: ${err.message}`);
    }
  }

  // Updated statuses wapas episodes.json mein save karo
  await fs.writeFile(EPISODES_JSON, JSON.stringify(episodes, null, 2), "utf-8");
  console.log("\nDone. episodes.json status update ho gaya.");
}

main();
