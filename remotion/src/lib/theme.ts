// theme.ts
// Ye file "Past In A Minute" ke brand tokens rakhti hai.
// Har scene (Hook, Fact, Twist, Reflection, CTA) isi file se colors/fonts leta hai,
// taake agar kabhi brand refresh karni ho to sirf yahan change karna padega — har scene mein nahi.

export const theme = {
  colors: {
    // Background: solid charcoal-black (jaisa logo mein hai)
    background: "#1C1C1C",
    backgroundGradientDark: "#120c06",
    backgroundGradientMid: "#3a2c1e",

    // Gold accent family
    gold: "#D4AF37",
    goldLight: "#f3d38a",
    goldMid: "#c99a3f",
    goldDark: "#8a6423",

    // Text
    textPrimary: "#f3d38a", // headline text pe halka lighter gold, readability ke liye
    textSecondary: "#e8c46a",
    white: "#FFFFFF",
  },

  fonts: {
    // Headline: serif (jaisa logo mein "PAST IN A MINUTE" hai)
    headline: "Georgia, 'Times New Roman', serif",
    // Body/captions: sans-serif, thodi tracking ke sath
    body: "'Segoe UI', Arial, sans-serif",
  },

  tagline: "History, One Day At A Time",
  channelName: "PAST IN A MINUTE",

  // Video canvas: 9:16 portrait, YouTube/FB Shorts ke liye
  video: {
    width: 1080,
    height: 1920,
    fps: 30,
  },
} as const;

export type Theme = typeof theme;
