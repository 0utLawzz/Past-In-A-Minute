---
name: project
description: Architecture, setup, workflow, and operations guide for the Past In A Minute static video production project.
---

# Past In A Minute — Project Operations Guide

"Past In A Minute" is an offline, zero-cost, no-API-key video studio designed for generating 9:16 portrait history reels (YouTube Shorts / Facebook Reels).

## Core Project Architecture

- **Dashboard**: Express local server (`dashboard/server.mjs`) on `http://localhost:4321`.
- **Data Store**: `content/episodes.csv` & `content/episodes.json` master tracking files.
- **Audio Engine (TTS)**: Piper TTS engine (`piper/piper.exe`), using offline `.onnx` voice models located in `piper/`.
- **Video Engine**: Remotion (React video framework) in `remotion/`.
- **Output Directory**: Rendered `.mp4` files go to `output/`.

## Key Commands & Workflow

- `npm run dashboard`: Launch local dashboard UI to manage episodes, sync Google Sheets, run TTS & render.
- `npm run tts`: Generate TTS audio files in `remotion/public/audio/`.
- `npm run render`: Render Remotion videos into `output/`.
- `npm run remotion:preview`: Launch Remotion Studio for live preview and scene tweaking.

## File Map

- `content/episodes.json`: Status flow `draft` → `script_ready` → `voice_ready` → `rendered` → `uploaded`.
- `scripts/tts.mjs`: Piper TTS wrapper script for audio synthesis.
- `scripts/render.mjs`: Remotion CLI wrapper for rendering MP4 outputs.
- `remotion/src/lib/theme.ts`: Brand tokens & theme configurations.
- `remotion/src/EpisodeVideo.tsx`: Core scene composition & sequence timing.
