#!/usr/bin/env python3
"""
Simple TTS script using Windows built-in SAPI (Speech API)
This works on Windows without any external dependencies
"""
import sys
import wave
import subprocess
import tempfile
import os

def main():
    if len(sys.argv) < 3:
        print("Usage: python simple_tts.py <model_path> <output_file>", file=sys.stderr)
        sys.exit(1)
    
    model_path = sys.argv[1]  # Not used for SAPI
    output_file = sys.argv[2]
    
    # Read text from stdin
    text = sys.stdin.read().strip()
    
    print(f"Text to synthesize: {text}", file=sys.stderr)
    print(f"Output: {output_file}", file=sys.stderr)
    
    # Use Windows PowerShell with SAPI to generate speech
    # This uses the built-in Windows speech synthesis
    ps_script = f'''
Add-Type -AssemblyName System.Speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speak.SetOutputToWaveFile("{output_file}")
$speak.Speak("{text}")
$speak.Dispose()
'''
    
    try:
        # Create temporary PowerShell script
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ps1', delete=False) as f:
            f.write(ps_script)
            ps_file = f.name
        
        # Execute PowerShell script
        result = subprocess.run(
            ['powershell', '-ExecutionPolicy', 'Bypass', '-File', ps_file],
            capture_output=True,
            text=True
        )
        
        # Clean up temporary file
        os.unlink(ps_file)
        
        if result.returncode != 0:
            print(f"PowerShell error: {result.stderr}", file=sys.stderr)
            sys.exit(1)
        
        if os.path.exists(output_file):
            print(f"Successfully created audio file: {output_file}", file=sys.stderr)
            sys.exit(0)
        else:
            print(f"Failed to create audio file", file=sys.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()