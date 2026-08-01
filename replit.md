# Past In A Minute — Static Video Studio

**Channel:** Past In A Minute — "History, One Day At A Time."
**Format:** Daily 9:16 short-form history reels for YouTube Shorts & Facebook Reels.

## How to run

The dashboard starts automatically. It is available in the preview pane at port 5000.

On first run, the startup script downloads the Piper TTS binary and voice model (~85 MB total) into the `piper/` folder before launching the server. Subsequent starts skip the download if the files are already present.

```
# The workflow runs this automatically:
node scripts/setup-piper.mjs && PORT=5000 npm run dashboard
```

## Full pipeline (per episode)

1. **Add episode** — via the dashboard form, CSV upload, or Google Sheet sync
2. **Script Ready** — mark the episode status in the dashboard
3. **Generate voice-over** — click "Generate" on the dashboard, or:
   ```
   node scripts/tts.mjs EP0010
   node scripts/tts.mjs --all      # all script_ready episodes
   ```
4. **Render video** — click "Render" on the dashboard, or:
   ```
   node scripts/render.mjs EP0010
   node scripts/render.mjs --all   # all voice_ready episodes
   ```
5. **Download** — finished `.mp4` files appear in `output/`
6. **Upload manually** to YouTube Shorts / Facebook Reels

## Key scripts

| Command | Purpose |
|---|---|
| `npm run dashboard` | Episode management UI |
| `node scripts/tts.mjs <ID>` | Generate voice-over (Piper TTS) |
| `node scripts/render.mjs <ID>` | Render `.mp4` (Remotion) |
| `npm run csv-to-json` | Convert `content/episodes.csv` → `content/episodes.json` |
| `npm run fetch-sheet` | Pull from a published Google Sheet URL |
| `npm run remotion:preview` | Remotion Studio for live scene preview |

## TTS setup (Linux / Replit)

- **Binary:** `piper/piper` (Linux x86_64, Piper 2023.11.14-2)
- **Model:** `piper/en_US-lessac-medium.onnx` (60 MB, downloaded)
- Override model: set `PIPER_MODEL` env var to a different `.onnx` path

## Project structure

```
content/           ← episodes.csv + episodes.json (master data)
dashboard/         ← Express server + HTML/CSS/JS UI
remotion/src/      ← React scene components + brand theme
  scenes/          ← HookScene, FactScene, TwistScene, ReflectionScene, CTAScene
  lib/theme.ts     ← brand colors, fonts, video dimensions
  EpisodeVideo.tsx ← master timeline
scripts/           ← tts.mjs, render.mjs, csv-to-json.mjs, fetch-sheet.mjs
piper/             ← Piper TTS binary + voice model (gitignored)
output/            ← rendered .mp4 files (gitignored)
```

## Brand tokens

- Background: `#1C1C1C` charcoal | Accent: `#D4AF37` gold
- Headline: Georgia/serif | Body: Segoe UI/sans-serif
- Video: 1080×1920px, 30fps, 9:16 portrait

## User preferences

- Keep the project stack as-is (no migrations, no restructuring)
- No auto-publish — videos are uploaded manually
- Offline/zero-cost philosophy: no paid APIs, no cloud databases
