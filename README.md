# Past In A Minute — Static Video Studio

**GitHub Repository:** [https://github.com/0utLawzz/Past-In-A-Minute.git](https://github.com/0utLawzz/Past-In-A-Minute.git)

Ek **offline, no-API-key, PC-runnable** video production tool "Past In A Minute" history channel ke liye.
Sab kuch aapke Windows PC pe local chalta hai — koi cloud database, koi paid API, koi subscription nahi.

## Ye tool kya karta hai

1. Episode data (Hook / Fact / Twist / Reflection / CTA) CSV, manual form, ya Google Sheet se leta hai
2. Local dashboard mein checklist dikhata hai: Draft → Script Ready → Voice Ready → Video Rendered → Uploaded
3. Free/offline Piper TTS se voice-over generate karta hai
4. Remotion (React-based) se final 9:16 portrait `.mp4` video render karta hai — aapki Past In A Minute
   branding (charcoal + gold, serif font, hourglass motif) ke sath
5. Upload aap khud manually karte hain (YouTube/Facebook) — koi auto-publish nahi (jaisa aap ne chaha tha)

---

## One-Time Setup

### 1. Node.js
Aapke PC pe already Node v24 hai — kuch karne ki zaroorat nahi. (Node v18+ chahiye.)

### 2. Project install
```bash
cd past-in-a-minute-studio
npm install
```

### 3. Voice-over Setup (Piper TTS)

Piper ek **free, fully offline** neural text-to-speech engine hai — koi API key, koi internet
runtime pe nahi chahiye (sirf one-time model download).

1. Yahan se Windows build download karein: https://github.com/rhasspy/piper/releases
   (file: `piper_windows_amd64.zip`)
2. Isay `piper/` folder mein extract karein (isi project ke andar) — `piper/piper.exe` hona chahiye
3. Ek voice model download karein (free): https://github.com/rhasspy/piper/blob/master/VOICES.md
   Suggested: `en_US-lessac-medium` — dono files chahiye:
   - `en_US-lessac-medium.onnx`
   - `en_US-lessac-medium.onnx.json`
   Dono ko `piper/` folder mein rakh dein.
4. Test: `echo "Hello world" | piper/piper.exe --model piper/en_US-lessac-medium.onnx --output_file test.wav`

Agar `piper.exe` PATH mein nahi hai, to environment variable set kar dein:
```powershell
$env:PIPER_PATH = "C:\path\to\piper\piper.exe"
$env:PIPER_MODEL = "C:\path\to\piper\en_US-lessac-medium.onnx"
```

### 4. Google Sheet Setup (optional — agar Sheet se content lena hai)

1. Apni Google Sheet kholein (columns: `id, date, title, hook, fact, twist, reflection, cta, status, notes`)
2. **File → Share → Publish to web**
3. Dropdown mein sheet/tab select karein, format **"Comma-separated values (.csv)"** choose karein
4. **Publish** dabayein, jo link mile use copy karein
5. Dashboard mein "Sync Google Sheet" button se ye link paste kar dein — bas

Ye link **public read-only** hota hai, isliye koi OAuth/API key nahi chahiye.

---

## Roz ka Workflow

### Dashboard kholein
```bash
npm run dashboard
```
Browser mein: **http://localhost:4321**

Yahan se aap:
- ✅ Naya episode add kar sakte hain (form se)
- ✅ CSV upload kar sakte hain (bulk)
- ✅ Google Sheet se sync kar sakte hain
- ✅ Har episode ka status track kar sakte hain
- ✅ "🎙️ Generate" button se voice-over banayein
- ✅ "🎬 Render" button se final video banayein

### Command line se bhi chala sakte hain

```bash
# CSV se episodes.json banayein
npm run csv-to-json

# Ek episode ki voice-over banayein
node scripts/tts.mjs EP001

# Saare "script_ready" episodes ki voice-over ek sath
node scripts/tts.mjs --all

# Ek episode render karein
node scripts/render.mjs EP001

# Saare "voice_ready" episodes render karein
node scripts/render.mjs --all

# Remotion Studio mein live preview dekhein (design tweak karne ke liye)
npm run remotion:preview
```

### Final video kahan milegi
`output/EP001.mp4` — seedha YouTube Shorts / Facebook Reels pe upload karne ke liye ready.

---

## Project Structure

```
past-in-a-minute-studio/
├── content/
│   ├── episodes.csv          ← master data (Excel mein bhi khol sakte hain)
│   └── episodes.json         ← auto-generated, dashboard/render isi ko padhte hain
├── remotion/
│   ├── src/
│   │   ├── scenes/           ← 5 scene components (Hook, Fact, Twist, Reflection, CTA)
│   │   ├── lib/theme.ts      ← brand colors/fonts (yahan se poori video ki styling control hoti hai)
│   │   └── EpisodeVideo.tsx  ← scenes ko timeline mein jodta hai
│   └── public/audio/         ← TTS se generate hui .wav files yahan aati hain
├── scripts/
│   ├── fetch-sheet.mjs       ← Google Sheet se CSV khinchta hai
│   ├── csv-to-json.mjs       ← CSV → JSON convert
│   ├── tts.mjs                ← Piper TTS wrapper
│   └── render.mjs             ← Remotion render orchestration
├── dashboard/
│   ├── server.mjs            ← local Express server (koi cloud nahi)
│   └── public/                ← dashboard UI (HTML/CSS/JS)
└── output/                    ← final .mp4 files yahan bante hain
```

## Scene timing ya design change karni ho

- **Timing (kitne seconds har scene chale):** `remotion/src/EpisodeVideo.tsx` mein `SCENE_SECONDS` object
- **Colors/fonts:** `remotion/src/lib/theme.ts`
- **Har scene ka layout:** `remotion/src/scenes/*.tsx`

## Gotchas / Common Issues

- **"Piper exit code..." error:** Piper installed nahi ya path galat — README ka "Voice-over Setup" dobara check karein
- **Render bohot slow hai:** Pehli baar Chromium download hota hai (Remotion internally use karta hai) — ek baar ho jaye to fast ho jata hai
- **Sheet sync fail ho rahi hai:** Sheet "Published to web" honi chahiye, private/shared-only link kaam nahi karega
- **Dashboard status update nahi ho raha:** Dashboard chalate waqt `npm run dashboard` ka terminal khula rakhein, band mat karein
