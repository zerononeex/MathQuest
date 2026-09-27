"""Builds art-src/entrances.png (grand overworld entrances: the four temples
and the castle) from whichever art-src/entrance_<kind>_raw.jpg sheets exist
(Gemini art on flat magenta). Magenta + its JPEG fringe keyed out, the
building cropped to its bounds and box-downscaled to its in-game width
(temples 96px = 6 tiles, castle 224px = 14 tiles). Prints ENTRANCE_SRC.
Run: python3 art-src/entrances/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
WIDTH = {'forest': 96, 'fire': 96, 'water': 96, 'shadow': 96, 'castle': 224}
tiles, src = [], {}
for kind, W in WIDTH.items():
    p = os.path.join(HERE, '..', 'entrance_%s_raw.jpg' % kind)
    if not os.path.exists(p): continue
    A = np.array(Image.open(p).convert('RGB')).astype(float)
    r, g, b = A[..., 0], A[..., 1], A[..., 2]
    BG = (r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)
    FR = ~BG & (r > g + 70) & (b > g + 70)          # magenta fringe
    alpha = ~(BG | FR)
    rows, cols = np.where(alpha.sum(1) > 4)[0], np.where(alpha.sum(0) > 4)[0]
    y0, y1, x0, x1 = rows[0], rows[-1], cols[0], cols[-1]
    rgba = np.dstack([A[y0:y1 + 1, x0:x1 + 1], alpha[y0:y1 + 1, x0:x1 + 1] * 255.0])
    H = round(W * (y1 - y0 + 1) / (x1 - x0 + 1))
    # premultiplied box downscale so no magenta bleeds into the edges
    pm = rgba.copy(); pm[..., :3] *= pm[..., 3:4] / 255.0
    im = np.array(Image.fromarray(pm.astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
    a = im[..., 3]
    im[..., :3] = np.where(a[..., None] > 0, im[..., :3] * 255.0 / np.maximum(a[..., None], 1), 0)
    im[..., 3] = np.where(a > 120, 255, 0)
    # edge pixels still tinted by the magenta backdrop go transparent
    op = im[..., 3] > 0
    edge = op & ~(np.roll(op, 1, 0) & np.roll(op, -1, 0) & np.roll(op, 1, 1) & np.roll(op, -1, 1))
    pink = (im[..., 0] > im[..., 1] + 35) & (im[..., 2] > im[..., 1] + 35)
    im[..., 3][edge & pink] = 0
    tiles.append((kind, Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA')))
x = 0
out = Image.new('RGBA', (sum(t.width + 2 for _, t in tiles), max(t.height for _, t in tiles)), (0, 0, 0, 0))
for kind, t in tiles:
    out.paste(t, (x, 0)); src[kind] = [x, 0, t.width, t.height]; x += t.width + 2
out.save(os.path.join(HERE, '..', 'entrances.png'), optimize=True)
print(json.dumps(src))
