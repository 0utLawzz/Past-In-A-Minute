#!/usr/bin/env python3
"""
Linux TTS fallback using espeak-ng (bundled with Piper).
Called by tts.mjs when piper binary fails. Generates a WAV file via espeak-ng.
"""
import sys
import os
import subprocess
import shutil

def main():
    if len(sys.argv) < 3:
        print("Usage: python simple_tts.py <model_path> <output_file>", file=sys.stderr)
        sys.exit(1)

    output_file = sys.argv[2]
    text = sys.stdin.read().strip()

    print(f"[TTS fallback] Text: {text[:80]}...", file=sys.stderr)
    print(f"[TTS fallback] Output: {output_file}", file=sys.stderr)

    # Prefer the espeak-ng bundled with piper (same dir as the piper binary)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    piper_espeak = os.path.join(project_root, "piper", "espeak-ng")
    system_espeak = shutil.which("espeak-ng") or shutil.which("espeak")

    espeak_bin = piper_espeak if os.path.isfile(piper_espeak) else system_espeak

    if not espeak_bin:
        print("[TTS fallback] espeak-ng not found. Install: sudo apt-get install espeak-ng", file=sys.stderr)
        sys.exit(1)

    # Set LD_LIBRARY_PATH so bundled espeak-ng can find libespeak-ng.so.1,
    # and ESPEAK_DATA_PATH so it finds its phoneme data (not the system path)
    env = os.environ.copy()
    piper_dir = os.path.join(project_root, "piper")
    existing_ld = env.get("LD_LIBRARY_PATH", "")
    env["LD_LIBRARY_PATH"] = f"{piper_dir}:{existing_ld}" if existing_ld else piper_dir
    espeak_data = os.path.join(piper_dir, "espeak-ng-data")
    if os.path.isdir(espeak_data):
        env["ESPEAK_DATA_PATH"] = espeak_data

    try:
        result = subprocess.run(
            [espeak_bin, "-w", output_file, "--stdin"],
            input=text.encode("utf-8"),
            capture_output=True,
            env=env,
        )
        if result.returncode != 0:
            print(f"[TTS fallback] espeak error: {result.stderr.decode()}", file=sys.stderr)
            sys.exit(1)
        if os.path.exists(output_file):
            print(f"[TTS fallback] Created: {output_file}", file=sys.stderr)
            sys.exit(0)
        else:
            print("[TTS fallback] File not created.", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"[TTS fallback] Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
