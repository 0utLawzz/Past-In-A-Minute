// CTAScene.tsx
// Scene 5 (last): Call-to-action + channel branding — hourglass emblem (SVG se draw kiya,
// koi image file load nahi karni padi), channel name, tagline, aur CTA line.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../lib/theme";

const HourglassIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect x="25" y="10" width="50" height="8" rx="2" fill={color} />
    <rect x="25" y="82" width="50" height="8" rx="2" fill={color} />
    <path
      d="M30 18 L70 18 L52 50 L70 82 L30 82 L48 50 Z"
      stroke={color}
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

export const CTAScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div style={{ opacity, marginBottom: 30 }}>
        <HourglassIcon size={90} color={theme.colors.gold} />
      </div>

      <div
        style={{
          opacity,
          fontFamily: theme.fonts.headline,
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: 3,
          color: theme.colors.gold,
          marginBottom: 12,
        }}
      >
        {theme.channelName}
      </div>

      <div
        style={{
          opacity,
          fontFamily: theme.fonts.body,
          fontSize: 26,
          color: theme.colors.goldDark,
          marginBottom: 60,
        }}
      >
        {theme.tagline}
      </div>

      <div
        style={{
          opacity,
          fontFamily: theme.fonts.body,
          fontSize: 36,
          fontWeight: 600,
          color: theme.colors.white,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
