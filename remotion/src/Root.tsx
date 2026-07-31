// Root.tsx
// Remotion isi file ko dhoondta hai composition register karne ke liye.
// "episode" prop CLI se pass hota hai (dekhein scripts/render.mjs) — isliye
// har episode ke liye alag se code likhne ki zaroorat nahi, same composition
// har episode ka data le kar apne aap render kar deti hai.

import React from "react";
import { Composition, getInputProps } from "remotion";
import { EpisodeVideo, TOTAL_DURATION_IN_FRAMES } from "./EpisodeVideo";
import { theme } from "./lib/theme";
import type { Episode } from "./lib/episode-types";

// Preview (Remotion Studio) mein dikhane ke liye ek default/sample episode
const sampleEpisode: Episode = {
  id: "EP000",
  date: "19 July 1545",
  title: "The Mary Rose Sinks",
  hook: "One ship. One battle. One terrible mistake.",
  fact: "On this day in 1545, King Henry VIII's flagship, the Mary Rose, sank in the Solent — in full view of the king himself.",
  twist: "It wasn't the enemy that sank her. Open gunports and a sudden turn let the sea pour straight in.",
  reflection: "Sometimes the greatest threats aren't the ones we're watching for.",
  cta: "Follow Past In A Minute for tomorrow's story.",
  status: "draft",
};

export const RemotionRoot: React.FC = () => {
  // Jab actual render ho raha ho (CLI se), episode data yahan se aata hai
  const inputProps = getInputProps() as { episode?: Episode; audioFileName?: string };
  const episode = inputProps.episode ?? sampleEpisode;
  const audioFileName = inputProps.audioFileName;

  return (
    <Composition
      id="EpisodeVideo"
      component={EpisodeVideo}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={theme.video.fps}
      width={theme.video.width}
      height={theme.video.height}
      defaultProps={{ episode: sampleEpisode, audioFileName: undefined }}
      // Render ke waqt yahi props CLI se override ho jate hain (--props flag se)
    />
  );
};
