// tts.mjs
//
// Ye script har episode ke 5 lines (hook+fact+twist+reflection+cta) ko jodkar
// ek script banata hai, aur placeholder audio file generate karta hai.
// Real voice-over ke liye Piper TTS properly set up karna padega.
//
// Chalane ka tareeka: node scripts/tts.mjs EP001
// (ya sab pending episodes ke liye:  node scripts/tts.mjs --all)

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const EPISODES_JSON = path.resolve("content/episodes.json");
const AUDIO_DIR = path.resolve("remotion/public/audio");

// Piper model path (supports default en_US-amy-medium.onnx or en_US-lessac-medium.onnx or PIPER_MODEL env)
function getPiperModel(modelName) {
  if (process.env.PIPER_MODEL) return process.env.PIPER_MODEL;
  if (modelName) return path.resolve(`piper/${modelName}`);
  const amyPath = path.resolve("piper/en_US-amy-medium.onnx");
  const lessacPath = path.resolve("piper/en_US-lessac-medium.onnx");
  return amyPath;
}

async function ensureAudioDir() {
  await fs.mkdir(AUDIO_DIR, { recursive: true });
}

function buildScriptText(ep) {
  // Har scene ke darmiyan chota pause (comma se) taake voice natural lage
  return [ep.hook, ep.fact, ep.twist, ep.reflection, ep.cta].join(" ... ");
}

function runPiper(text, outputFile, modelPath) {
  return new Promise((resolve, reject) => {
    const piperExe = path.resolve("piper/piper.exe");

    // Check if piper.exe and model exist
    const runPiperExe = () => {
      const piper = spawn(piperExe, ["--model", modelPath, "--output_file", outputFile]);
      piper.stdin.write(text);
      piper.stdin.end();

      let stderr = "";
      piper.stderr.on("data", (d) => (stderr += d.toString()));

      piper.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.warn(`Piper exe returned code ${code}, falling back to SAPI speech engine...`);
          runSapiFallback();
        }
      });

      piper.on("error", () => {
        runSapiFallback();
      });
    };

    const runSapiFallback = () => {
      const pythonScript = path.resolve("scripts/simple_tts.py");
      const python = spawn("python", [pythonScript, modelPath, outputFile]);

      python.stdin.write(text);
      python.stdin.end();

      let stderr = "";
      python.stderr.on("data", (d) => (stderr += d.toString()));

      python.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`TTS script exit code ${code}.\n${stderr}`));
      });

      python.on("error", (err) => {
        reject(new Error(`TTS script execution failed: ${err.message}`));
      });
    };

    runPiperExe();
  });
}

async function generateForEpisode(ep, modelName) {
  const outputFile = path.join(AUDIO_DIR, `${ep.id}.wav`);
  const text = buildScriptText(ep);
  const modelPath = getPiperModel(modelName);

  console.log(`\n🎙️  Generating voice-over for ${ep.id} — "${ep.title}" (Model: ${path.basename(modelPath)})`);
  await runPiper(text, outputFile, modelPath);
  console.log(`   ✅ Saved: ${outputFile}`);

  return outputFile;
}

async function main() {
  const args = process.argv.slice(2);
  const targetArg = args[0];
  let voiceModel = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--voice" && args[i + 1]) {
      voiceModel = args[i + 1];
    }
  }

  if (!targetArg) {
    console.error('Usage: node scripts/tts.mjs <EPISODE_ID> [--voice model_name]   OR   node scripts/tts.mjs --all [--voice model_name]');
    process.exit(1);
  }

  const episodesRaw = await fs.readFile(EPISODES_JSON, "utf-8");
  const episodes = JSON.parse(episodesRaw);
  await ensureAudioDir();

  const targets =
    targetArg === "--all"
      ? episodes.filter((e) => e.status === "script_ready")
      : episodes.filter((e) => e.id === targetArg);

  if (targets.length === 0) {
    console.log("Koi matching episode nahi mila (status 'script_ready' honi chahiye --all ke liye).");
    return;
  }

  for (const ep of targets) {
    try {
      await generateForEpisode(ep, voiceModel);
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
