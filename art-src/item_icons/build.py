"""Builds art-src/item_icons.png (framed item icons: Giant's Berry, Ember
Bloom, Rolling Barrel, Ink Blaster, arrow, fire + ice arrows) from
art-src/item_icons_raw.jpg (Gemini sheet on magenta, 2 rows of 4; the
sheet repeats the ink bottle and barrel, only the first of each is used).
Each framed tile is cropped to its bounds and box-downscaled to 96px.
Prints the SRC crop table.
Run: python3 art-src/item_icons/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'item_icons_raw.jpg')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
BG = (r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)
near = BG.copy()  # the magenta-ish JPEG fringe only counts right next to the background
for d in (1, 2, 3):
    near[d:] |= BG[:-d]; near[:-d] |= BG[d:]; near[:, d:] |= BG[:, :-d]; near[:, :-d] |= BG[:, d:]
fg = ~(BG | (near & (r > g + 60) & (b > g + 60)))
def runs(m, minlen):
    idx = np.where(m)[0]; out = []; s = p = idx[0]
    for c in idx[1:]:
        if c - p > 4: out.append((s, p)); s = c
        p = c
    out.append((s, p))
    return [x for x in out if x[1] - x[0] >= minlen]
rows = runs(fg.sum(1) > 40, 100)
assert len(rows) == 2, rows
tiles = []
for y0, y1 in rows:
    cols = runs(fg[y0:y1 + 1].sum(0) > 40, 100)
    assert len(cols) == 4, cols
    for x0, x1 in cols: tiles.append((x0, y0, x1 + 1, y1 + 1))
PICK = {'superMushroom': 0, 'fireFlower': 1, 'dkBarrel': 2, 'inkBlaster': 3, 'arrow': 6, 'elemArrow': 7}
S = 96
out = Image.new('RGBA', ((S + 2) * len(PICK), S), (0, 0, 0, 0)); src = {}
for i, (name, k) in enumerate(PICK.items()):
    x0, y0, x1, y1 = tiles[k]
    rgba = np.dstack([A[y0:y1, x0:x1], fg[y0:y1, x0:x1] * 255.0]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA').resize((S, S), Image.BOX)
    a = np.array(im); a[..., 3] = np.where(a[..., 3] > 110, 255, 0)
    out.paste(Image.fromarray(a, 'RGBA'), (i * (S + 2), 0)); src[name] = [i * (S + 2), 0, S, S]
out.save(os.path.join(HERE, '..', 'item_icons.png'), optimize=True)
print(json.dumps(src))
