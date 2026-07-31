// TwistScene.tsx
// Scene 3: "Twist" — jo baat surprising hai, wo yahan reveal hoti hai.
// Gold background block use kiya hai taake ye scene baaki scenes se visually alag/impactful lage.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../lib/theme";

export const TwistScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const barWidth = interpolate(frame, [0, 20], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 34,
          letterSpacing: 6,
          color: theme.colors.gold,
          textTransform: "uppercase",
          marginBottom: 30,
          opacity,
        }}
      >
        But here's the twist
      </div>

      {/* Animated gold underline bar */}
      <div
        style={{
          width: `${barWidth}%`,
          maxWidth: 300,
          height: 3,
          backgroundColor: theme.colors.gold,
          marginBottom: 40,
        }}
      />

      <div
        style={{
          opacity,
          fontFamily: theme.fonts.headline,
          fontSize: 58,
          fontWeight: 700,
          color: theme.colors.textPrimary,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
