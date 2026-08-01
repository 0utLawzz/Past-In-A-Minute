---
name: past-in-a-minute-branding
description: Apply the "Past In A Minute" history-reel brand system (colors, fonts, logo, 4 visual themes including torn-paper/typewriter, 6-scene structure, 3-reels-a-day production cadence with SFX/music, Facebook Shorts + YouTube asset specs). Use this whenever working on the Past In A Minute channel, the Maritime-History-Reel repo, or any related reel/video/thumbnail/banner/logo/social asset — even if the user just says "make a reel," "new theme," "export a video," "channel art," or references "on this day" content, without explicitly naming the brand. Always consult this before generating any visual asset or video copy for this project so output stays on-brand.
---

# Past In A Minute — Brand & Design System

Channel: **Past In A Minute** — tagline: "History, One Day At A Time."
Format: daily 9:16 short-form video, one real historical event per date.

Use this skill any time you're producing something visual or written for this
project: logos, banners, thumbnails, video scene copy, render themes, or
social page assets (YouTube/Facebook).

## Core brand tokens

- **Background**: charcoal/near-black — `#1C1C1C`, `#241a10`, `#120c06`
- **Accent (gold)**: `#D4AF37`, `#c99a3f`, `#f3d38a`, `#8a6423`
- **Headline font**: serif (Georgia / Times New Roman) — bold, wide letter-spacing
- **Body/label font**: clean sans-serif, small tracking/letter-spacing for labels
- **Motif**: clock/hourglass emblem, thin gold rule lines, subtle vintage grain/particle texture
- **Voice**: calm documentary narrator tone. Short sentences. Curiosity hook → fact → twist → reflection → CTA.
- **Standard CTA (Scene 6)**: "Follow for daily history." (use "Follow for daily maritime history." if the topic is naval/maritime)

## The 6-scene video structure

Every reel follows this fixed structure (matches `videoProjectsTable` schema in
the Maritime-History-Reel repo: `lib/db/src/schema/video-projects.ts`):

| Scene | Field(s) | Purpose | Duration |
|---|---|---|---|
| Hook | `hookDate`, `hookYear` | "ON THIS DAY" label + typewriter date reveal | ~4.0s |
| Scene 2 | `scene2Headline`, `scene2Subline` | Title card + full image | ~4.5s |
| Scene 3 | `scene3Headline`, `scene3Body` | Build-up / cause / context | ~4.5s |
| Scene 4 | `scene4Headline`, `scene4Body` | The dramatic peak / twist (emotional high point) | ~5.5s |
| Scene 5 | `scene5Headline`, `scene5Body` | Resolution / legacy / "why it matters" | ~4.5s |
| Scene 6 | `scene6Cta` | Branding + CTA | ~4.0s |

Also fill `title` (video title) and `topic` (category tag, e.g. "Maritime
Disaster", "Invention", "Naval Battle", "Exploration").

When drafting scene copy for a new event, keep to this same rhythm: hook →
plain fact → deeper/surprising fact or myth-bust → reflective closing line.
See `references/example-topics.md` for two fully-worked examples (Mary Rose,
Vasa) to match tone and pacing against.

## Four visual themes

All themes reuse the same 6-scene structure and timing — only the visual
treatment changes. Add/select via a `theme` field: `vintage` | `cinematic` | `minimal` | `oldpaper`.

**A — Vintage Sepia Gold** (default)
Charcoal background, gold serif type, soft gold particle overlay,
typewriter-style hook animation. Warm, archival, documentary feel.

**B — Dark Cinematic**
Near-black background, high-contrast white/red accent instead of gold,
faster cuts, bolder sans-serif headlines, subtle film-grain overlay.
Use for higher-drama topics (wars, disasters).

**C — Modern Minimal**
Off-white/cream background, black text, thin gold rule lines as the only
accent, flat design (no particles/glow), faster pacing. Use when the topic
is lighter (inventions, discoveries) or for daytime/bright-mode viewing.

**D — Vintage Cutout** (torn paper / typewriter, inspired by the OutLawZ logo look)
Warm tan background, cream torn-paper cards, mauve/coral/pink accent arcs,
typewriter-style text reveal. Signature move: 2-3 concentric torn-paper arc
rings continuously rotate around the frame edge (outer clockwise, inner
counter-clockwise) for a parallax "old newspaper" feel. Scene transitions
use a paper-rip effect instead of fade. Use for nostalgic/"front page"-style
framing of an event.

Full color/type tokens per theme: see `references/theme-tokens.md`.

## Daily volume & audio layer

- Default cadence is **3 reels/day**, one event each, themes rotated across
  the day (e.g. Vintage Sepia Gold → Vintage Cutout → Dark Cinematic) so the
  feed doesn't feel repetitive. Never repeat a `hookDate`+`hookYear` already
  used.
- Every reel gets a full audio layer, not just narration:
  - Background music bed, ducked under narration (~20% volume)
  - SFX per scene: hook whoosh/paper rustle, typewriter clack on text
    reveals, transition sound matching the visual transition (e.g. paper-rip
    for Theme D), tension riser/stamp on the Scene 4 dramatic peak, closing
    chime/whoosh on the branding outro
- Keep SFX theme-appropriate: Theme D uses paper/typewriter sounds, Theme B
  (Dark Cinematic) uses hard cuts/risers, Theme A/C use softer whoosh/chime.

## Platform asset specs

- **Logo / profile picture**: 800x800px square, works on both YouTube and Facebook
- **YouTube banner**: 2560x1440px, keep all text/logo inside the centered safe
  area (~1546x423px) since sides get cropped on different devices
- **Facebook cover**: 820x312px, keep left ~110px clear (profile picture overlaps there)
- Always reuse the same logo file across both platforms — don't redesign per platform

## When generating new assets

1. Check which theme is being used (default to Vintage Sepia Gold if unspecified)
2. Pull exact hex tokens from `references/theme-tokens.md` — don't invent new colors
3. Keep serif headline / sans-serif body font pairing consistent
4. For video copy, follow the 6-scene rhythm above and match tone in `references/example-topics.md`
5. For static assets (logo/banner/cover), reuse existing exported files if available before regenerating from scratch
