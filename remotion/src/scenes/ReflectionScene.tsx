// ReflectionScene.tsx
// Scene 4: Reflection — "ye kyun matter karta hai" wala calm, thoughtful moment.
// Deliberately simple/quiet rakha hai taake pace break ho (viewer thora saans le).

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../lib/theme";

export const ReflectionScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div
        style={{
          opacity,
          fontFamily: theme.fonts.headline,
          fontStyle: "italic",
          fontSize: 46,
          fontWeight: 400,
          color: theme.colors.textSecondary,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        "{text}"
      </div>
    </AbsoluteFill>
  );
};
