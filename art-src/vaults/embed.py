"""Rebuilds art-src/vaults.png and writes it + VAULT_SRC into math-quest.html.
Run: python3 art-src/vaults/embed.py"""
import os, re, base64, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..', '..')
src = subprocess.check_output([sys.executable, os.path.join(HERE, 'build.py')]).decode().strip()
p = os.path.join(ROOT, 'math-quest.html'); s = open(p).read()
line = '  vaults: "data:image/png;base64,' + base64.b64encode(open(os.path.join(HERE, '..', 'vaults.png'), 'rb').read()).decode() + '",'
s, n = re.subn(r'  vaults: "data:image/png;base64,[^"]*",', lambda m: line, s)
if not n: s = s.replace('const ATLAS_SRC = {\n', 'const ATLAS_SRC = {\n' + line + '\n', 1)
s, n2 = re.subn(r'const VAULT_SRC = \{.*?\};', lambda m: 'const VAULT_SRC = ' + src + ';', s)
assert n2 == 1
open(p, 'w').write(s); print(src)
