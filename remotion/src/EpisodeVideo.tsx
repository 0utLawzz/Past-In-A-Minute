// EpisodeVideo.tsx
// Ye "master timeline" hai — 5 scenes ko ek ke baad ek sequence mein chalata hai.
// Har scene ka duration (kitne seconds) yahan control hota hai — SCENE_DURATIONS badal kar
// aap kisi bhi scene ko lamba/chota kar sakte hain, poori video re-time ho jayegi.

import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { theme } from "./lib/theme";
import type { Episode } from "./lib/episode-types";
import { HookScene } from "./scenes/HookScene";
import { FactScene } from "./scenes/FactScene";
import { TwistScene } from "./scenes/TwistScene";
import { ReflectionScene } from "./scenes/ReflectionScene";
import { CTAScene } from "./scenes/CTAScene";

// Har scene kitni der (seconds) chalegi — yahan se easily adjust ho sakta hai
const SCENE_SECONDS = {
  hook: 3,
  fact: 6,
  twist: 5,
  reflection: 4,
  cta: 4,
};

const fps = theme.video.fps;
const toFrames = (seconds: number) => Math.round(seconds * fps);

export const TOTAL_DURATION_IN_FRAMES =
  toFrames(SCENE_SECONDS.hook) +
  toFrames(SCENE_SECONDS.fact) +
  toFrames(SCENE_SECONDS.twist) +
  toFrames(SCENE_SECONDS.reflection) +
  toFrames(SCENE_SECONDS.cta);

export const EpisodeVideo: React.FC<{ episode: Episode; audioFileName?: string }> = ({
  episode,
  audioFileName,
}) => {
  let startFrame = 0;
  const hookFrames = toFrames(SCENE_SECONDS.hook);
  const factFrames = toFrames(SCENE_SECONDS.fact);
  const twistFrames = toFrames(SCENE_SECONDS.twist);
  const reflectionFrames = toFrames(SCENE_SECONDS.reflection);
  const ctaFrames = toFrames(SCENE_SECONDS.cta);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* Agar TTS audio file maujood hai (voice_ready ya us se aage), to poori video ke
          upar bajegi. Agar nahi hai, video phir bhi silent render ho jayegi (text-only). */}
      {audioFileName ? <Audio src={staticFile(`audio/${audioFileName}`)} /> : null}

      <Sequence from={startFrame} durationInFrames={hookFrames}>
        <HookScene text={episode.hook} />
      </Sequence>

      <Sequence from={(startFrame += hookFrames)} durationInFrames={factFrames}>
        <FactScene text={episode.fact} date={episode.date} />
      </Sequence>

      <Sequence from={(startFrame += factFrames)} durationInFrames={twistFrames}>
        <TwistScene text={episode.twist} />
      </Sequence>

      <Sequence from={(startFrame += twistFrames)} durationInFrames={reflectionFrames}>
        <ReflectionScene text={episode.reflection} />
      </Sequence>

      <Sequence from={(startFrame += reflectionFrames)} durationInFrames={ctaFrames}>
        <CTAScene text={episode.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
