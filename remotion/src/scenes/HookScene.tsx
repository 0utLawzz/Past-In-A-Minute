// HookScene.tsx
// Scene 1: Video ki pehli 2-3 seconds — yahan sabse zyada "hook" wala punch hona chahiye,
// warna viewer scroll kar jayega. Isliye text bada aur center mein.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../lib/theme";

export const HookScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text halka sa zoom-in + fade-in hoti hai jab scene shuru hoti hai
  const scale = spring({ frame, fps, config: { damping: 200 }, from: 0.85, to: 1 });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Thin gold rule line, top */}
      <div
        style={{
          position: "absolute",
          top: 140,
          width: 160,
          height: 2,
          backgroundColor: theme.colors.gold,
          opacity,
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontFamily: theme.fonts.headline,
          fontSize: 76,
          fontWeight: 700,
          color: theme.colors.textPrimary,
          textAlign: "center",
          lineHeight: 1.25,
          letterSpacing: 1,
        }}
      >
        {text}
      </div>
      {/* Thin gold rule line, bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          width: 160,
          height: 2,
          backgroundColor: theme.colors.gold,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};
