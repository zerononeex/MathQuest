"""Rebuilds art-src/entrances.png and writes it + ENTRANCE_SRC into math-quest.html.
Run: python3 art-src/entrances/embed.py"""
import os, re, base64, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..', '..')
src = subprocess.check_output([sys.executable, os.path.join(HERE, 'build.py')]).decode().strip()
p = os.path.join(ROOT, 'math-quest.html'); s = open(p).read()
b64 = base64.b64encode(open(os.path.join(HERE, '..', 'entrances.png'), 'rb').read()).decode()
s, n1 = re.subn(r'  entrances: "data:image/png;base64,[^"]*",', lambda m: '  entrances: "data:image/png;base64,' + b64 + '",', s)
s, n2 = re.subn(r'const ENTRANCE_SRC = \{.*?\};', lambda m: 'const ENTRANCE_SRC = ' + src + ';', s)
assert n1 == 1 and n2 == 1, (n1, n2)
open(p, 'w').write(s); print(src)
