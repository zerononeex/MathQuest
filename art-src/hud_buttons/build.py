"""Builds art-src/hud_buttons.png (HUD buttons: save, outfit, map, AP, bomb)
from art-src/hud_buttons_raw.jpg (Gemini sheet on magenta). The four framed
icons of the top row are cropped as they are; the bomb button is composed
from the save icon's gold frame with its inside refilled navy and the loose
bomb (bottom right of the sheet) placed in the middle. Each button is
box-downscaled to 96px. Prints the SRC crop table.
Run: python3 art-src/hud_buttons/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'hud_buttons_raw.jpg')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
BG = ((r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)) | ((r > g + 60) & (b > g + 60))
fg = ~BG
def runs(mask1d, minlen):
    idx = np.where(mask1d)[0]; out = []; s = idx[0]
    for a, c in zip(idx, idx[1:]):
        if c != a + 1: out.append((s, a)); s = c
    out.append((s, idx[-1]))
    return [(x0, x1) for x0, x1 in out if x1 - x0 >= minlen]
def bbox(x0, x1, y0, y1):
    m = fg[y0:y1, x0:x1]; ys = np.where(m.sum(1) > 2)[0]; xs = np.where(m.sum(0) > 2)[0]
    return x0 + xs[0], y0 + ys[0], x0 + xs[-1] + 1, y0 + ys[-1] + 1
def rgba(x0, y0, x1, y1):
    return np.dstack([A[y0:y1, x0:x1], fg[y0:y1, x0:x1] * 255.0])
top = runs(fg[:275].sum(0) > 5, 100)
assert len(top) == 4, top
S = 96
names = ['save', 'outfit', 'map', 'ap']
tiles = {}
for n, (x0, x1) in zip(names, top):
    tiles[n] = rgba(*bbox(x0, x1 + 1, 0, 275))
# bomb: frame of the save tile, inside refilled with the navy panel colour
fr = tiles['save'].copy(); h, w = fr.shape[:2]
navy = np.median(fr[int(h * 0.2):int(h * 0.26), int(w * 0.45):int(w * 0.55), :3].reshape(-1, 3), 0)
m0 = int(w * 0.13)
fr[m0:h - m0, m0:w - m0, :3] = navy; fr[m0:h - m0, m0:w - m0, 3] = 255
bx = bbox(760, 1024, 290, 559)
bomb = rgba(*bx)
bh, bw = bomb.shape[:2]
sc = (h * 0.66) / max(bh, bw)
bim = Image.fromarray(bomb.astype(np.uint8), 'RGBA').resize((int(bw * sc), int(bh * sc)), Image.LANCZOS)
fim = Image.fromarray(fr.astype(np.uint8), 'RGBA')
fim.alpha_composite(bim, ((w - bim.width) // 2, (h - bim.height) // 2 + int(h * 0.03)))
tiles['bomb'] = np.array(fim).astype(float)
# the framed bomb from its own sheet replaces the composed one when present
bp = os.path.join(HERE, '..', 'hud_bomb_raw.jpg')
if os.path.exists(bp):
    B = np.array(Image.open(bp).convert('RGB')).astype(float)
    r2, g2, b2 = B[..., 0], B[..., 1], B[..., 2]
    bfg = ~(((r2 > 150) & (b2 > 150) & (g2 < 130) & (np.abs(r2 - b2) < 90)) | ((r2 > g2 + 60) & (b2 > g2 + 60)))
    ys = np.where(bfg.sum(1) > 20)[0]; xs = np.where(bfg.sum(0) > 20)[0]
    y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
    tiles['bomb'] = np.dstack([B[y0:y1, x0:x1], bfg[y0:y1, x0:x1] * 255.0])
names.append('bomb')
out = Image.new('RGBA', ((S + 2) * len(names), S), (0, 0, 0, 0)); src = {}
for i, n in enumerate(names):
    im = Image.fromarray(tiles[n].astype(np.uint8), 'RGBA').resize((S, S), Image.BOX)
    a = np.array(im); a[..., 3] = np.where(a[..., 3] > 110, 255, 0)
    out.paste(Image.fromarray(a, 'RGBA'), (i * (S + 2), 0)); src[n] = [i * (S + 2), 0, S, S]
out.save(os.path.join(HERE, '..', 'hud_buttons.png'), optimize=True)
print(json.dumps(src))
