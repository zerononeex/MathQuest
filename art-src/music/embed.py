"""Writes the area songs (art-src/music/ow_*.mp3) and the Great Fairy's grotto song (fairy.mp3) into MUSIC_SRC in
math-quest.html. The mp3s were cut from the Gemini videos with ffmpeg:
lead-in silence removed, capped at 150s, 0.3s fade-in / 2.5s fade-out so
the loop seam is soft, mono 64 kbps.
Run: python3 art-src/music/embed.py"""
import os, re, base64, glob
HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(HERE, '..', '..', 'math-quest.html'); s = open(p).read()
for f in sorted(glob.glob(os.path.join(HERE, 'ow_*.mp3'))) + [os.path.join(HERE, 'fairy.mp3')]:
    k = os.path.basename(f)[:-4]
    line = '  %s: "data:audio/mpeg;base64,%s",' % (k, base64.b64encode(open(f, 'rb').read()).decode())
    s, n = re.subn(r'  %s: "data:audio/mpeg;base64,[^"]*",' % k, lambda m: line, s)
    if not n:
        i = s.index('const MUSIC_SRC = {\n'); j = s.index('\n};', i)
        s = s[:j] + '\n' + line + s[j:]
    print(k, os.path.getsize(f))
open(p, 'w').write(s)
