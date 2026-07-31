// render.mjs
//
// Ye "master" script hai -- ek episode ka ID leta hai, Remotion CLI ko call karta hai,
// aur output/ folder mein final .mp4 bana deta hai. Voice-over (agar voice_ready hai)
// automatically video ke sath jud jati hai.
//
// Chalane ka tareeka:
//   node scripts/render.mjs EP001
//   node scripts/render.mjs --all      (jo bhi "voice_ready" ya us se aage hain, sab render honge)

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const EPISODES_JSON = path.resolve("content/episodes.json");
const OUTPUT_DIR = path.resolve("output");

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

function renderOne(episode) {
  return new Promise(async (resolve, reject) => {
    const outputFile = path.join(OUTPUT_DIR, `${episode.id}.mp4`);
    const propsFile = path.join(OUTPUT_DIR, `props_${episode.id}.json`);
    const audioFileName =
      episode.status === "voice_ready" || episode.status === "video_rendered" || episode.status === "uploaded"
        ? `${episode.id}.wav`
        : undefined;

    const props = JSON.stringify({ episode, audioFileName });
    await fs.writeFile(propsFile, props, "utf-8");

    console.log(`\n🎬 Rendering ${episode.id} — "${episode.title}"`);

    // npx remotion render <entry> <composition-id> <output> --props='...'
    const child = spawn(
      "npx",
      [
        "remotion",
        "render",
        "remotion/src/index.ts",
        "EpisodeVideo",
        outputFile,
        `--props=${propsFile}`,
      ],
      { stdio: "inherit", shell: true }
    );

    child.on("close", (code) => {
      if (code === 0) resolve(outputFile);
      else reject(new Error(`Remotion render exit code ${code} for ${episode.id}`));
    });
  });
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node scripts/render.mjs <EPISODE_ID>   OR   node scripts/render.mjs --all");
    process.exit(1);
  }

  const episodesRaw = await fs.readFile(EPISODES_JSON, "utf-8");
  const episodes = JSON.parse(episodesRaw);
  await ensureOutputDir();

  const renderableStatuses = ["voice_ready", "video_rendered"];
  const targets =
    arg === "--all"
      ? episodes.filter((e) => renderableStatuses.includes(e.status))
      : episodes.filter((e) => e.id === arg);

  if (targets.length === 0) {
    console.log(
      "Koi matching episode nahi mila. Render karne se pehle episode ka status 'voice_ready' hona chahiye\n" +
        "(pehle 'npm run tts' chalayein, ya dashboard se voice-over generate karein)."
    );
    return;
  }

  for (const ep of targets) {
    try {
      await renderOne(ep);
      ep.status = "video_rendered";
      console.log(`   ✅ ${ep.id} -> output/${ep.id}.mp4`);
    } catch (err) {
      console.error(`   ❌ Failed for ${ep.id}: ${err.message}`);
    }
  }

  await fs.writeFile(EPISODES_JSON, JSON.stringify(episodes, null, 2), "utf-8");
  console.log("\nDone. Ab 'output/' folder check karein — final videos wahan hain.");
}

main();
