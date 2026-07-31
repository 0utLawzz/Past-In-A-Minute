// episode-types.ts
// Ye "shape" define karta hai ke ek episode ke andar kya-kya data hona chahiye.
// CSV/Google Sheet ke columns isi naam se match hone chahiye (headers case-sensitive nahi).

export interface Episode {
  id: string; // e.g. "EP001" — unique episode number, file names isi se banenge
  date: string; // "On this day" wali date, e.g. "1545-07-19"
  title: string; // Video ka title, e.g. "The Mary Rose Sinks"
  hook: string; // Scene 1: attention-grabbing opening line
  fact: string; // Scene 2: main historical fact / story
  twist: string; // Scene 3: surprising twist or lesser-known detail
  reflection: string; // Scene 4: "why it matters" / reflective line
  cta: string; // Scene 5: call-to-action line, e.g. "Follow for tomorrow's story"

  // Production tracking (dashboard checklist ke liye)
  status:
    | "draft" // sirf text hai, kuch aur nahi hua
    | "script_ready" // saara text final hai
    | "voice_ready" // TTS ban chuki hai
    | "video_rendered" // Remotion se final .mp4 ban chuka hai
    | "uploaded"; // aap ne khud YouTube/FB pe daal diya
  notes?: string; // koi bhi manual note (optional)
}
