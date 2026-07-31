// FactScene.tsx
// Scene 2: Main fact/story — sabse lambi scene hoti hai, isliye text thora chota
// (para jaisa) rakha hai taake 2-3 lines mein poora fact fit ho jaye.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../lib/theme";

export const FactScene: React.FC<{ text: string; date: string }> = ({ text, date }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const slideY = interpolate(frame, [0, 15], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
      }}
    >
      {/* "On this day" date badge, upar */}
      <div
        style={{
          position: "absolute",
          top: 180,
          fontFamily: theme.fonts.body,
          fontSize: 30,
          letterSpacing: 4,
          color: theme.colors.goldDark,
          textTransform: "uppercase",
          opacity,
        }}
      >
        On this day — {date}
      </div>

      <div
        style={{
          transform: `translateY(${slideY}px)`,
          opacity,
          fontFamily: theme.fonts.body,
          fontSize: 52,
          fontWeight: 500,
          color: theme.colors.white,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
