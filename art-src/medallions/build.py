"""Builds art-src/medallions.png (the four Elemental Medallions: forest,
fire, water, shadow) from art-src/medallions_raw.jpg (Gemini sheet on
magenta). Magenta + its JPEG fringe keyed out, each medallion cropped to
its bounds and box-downscaled to 96px; the game scales further per use
(HUD icons, chest reveal). Prints the SRC crop table.
Run: python3 art-src/medallions/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'medallions_raw.jpg')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
BG = (r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)
FR = ~BG & (r > g + 60) & (b > g + 60)          # magenta fringe
alpha = (~(BG | FR)).astype(float)
cols = np.where(alpha.sum(0) > 3)[0]
runs, start = [], cols[0]
for a, b2 in zip(cols, cols[1:]):
    if b2 != a + 1: runs.append((start, a)); start = b2
runs.append((start, cols[-1]))
runs = [(x0, x1) for x0, x1 in runs if x1 - x0 > 40]
assert len(runs) == 4, runs
S = 96
out = Image.new('RGBA', (S * 4 + 6, S), (0, 0, 0, 0))
src = {}
for i, (name, (x0, x1)) in enumerate(zip(['forest', 'fire', 'water', 'shadow'], runs)):
    rows = np.where(alpha[:, x0:x1 + 1].sum(1) > 3)[0]
    y0, y1 = rows[0], rows[-1]
    rgba = np.dstack([A[y0:y1 + 1, x0:x1 + 1], alpha[y0:y1 + 1, x0:x1 + 1] * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA').resize((S, S), Image.BOX)
    a = np.array(im); a[..., 3] = np.where(a[..., 3] > 110, 255, 0)
    out.paste(Image.fromarray(a, 'RGBA'), (i * (S + 2), 0))
    src[name] = [i * (S + 2), 0, S, S]
out.save(os.path.join(HERE, '..', 'medallions.png'), optimize=True)
print(json.dumps(src))
