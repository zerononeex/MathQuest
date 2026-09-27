"""Builds art-src/aurora_parts.png (the four Aurora Sword parts, the whole
sword, and the brighter weapon-slot sword) from art-src/aurora_parts_raw.jpg
(7 panels on magenta: top row hilt, crossguard, blade, starstone; bottom
row starstone (big, unused), sword, glowing sword). Each panel's backdrop is
keyed from its border; each item is fitted into a 48px square. Prints SRC.
Run: python3 art-src/aurora_parts/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'aurora_parts_raw.jpg')).convert('RGB')).astype(float)
PANELS = {'hilt': (39, 29, 241, 208), 'guard': (286, 29, 491, 208), 'blade': (532, 29, 738, 208), 'star': (781, 29, 986, 208),
          'sword': (372, 249, 661, 528), 'swordSlot': (701, 249, 986, 528)}
S = 48
def key(C):
    r, g, b = C[..., 0], C[..., 1], C[..., 2]
    K = (g < 80) & (r > 120) & (b > 120) & (np.abs(r - b) < 70)
    reach = np.zeros_like(K); reach[0, :] = K[0, :]; reach[-1, :] = K[-1, :]; reach[:, 0] = K[:, 0]; reach[:, -1] = K[:, -1]
    while True:
        gr = reach.copy(); gr[1:] |= reach[:-1]; gr[:-1] |= reach[1:]; gr[:, 1:] |= reach[:, :-1]; gr[:, :-1] |= reach[:, 1:]
        gr &= K
        if (gr == reach).all(): return ~reach
        reach = gr
out = Image.new('RGBA', ((S + 2) * len(PANELS), S), (0, 0, 0, 0)); src = {}
for i, (name, (x0, y0, x1, y1)) in enumerate(PANELS.items()):
    C = A[y0:y1, x0:x1]; al = key(C)
    rows, cols = np.where(al.sum(1) > 1)[0], np.where(al.sum(0) > 1)[0]
    C = C[rows[0]:rows[-1] + 1, cols[0]:cols[-1] + 1]; al = al[rows[0]:rows[-1] + 1, cols[0]:cols[-1] + 1]
    h, w = al.shape; k = S / max(h, w); W, H = max(1, round(w * k)), max(1, round(h * k))
    rgba = np.dstack([C * al[..., None], al * 255.0])
    im = np.array(Image.fromarray(rgba.astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
    a = im[..., 3]
    im[..., :3] = np.where(a[..., None] > 0, im[..., :3] * 255.0 / np.maximum(a[..., None], 1), 0)
    im[..., 3] = np.where(a > 110, 255, 0)
    for _ in range(2): # magenta-tinted rim pixels
        op = im[..., 3] > 0
        edge = op & ~(np.roll(op, 1, 0) & np.roll(op, -1, 0) & np.roll(op, 1, 1) & np.roll(op, -1, 1))
        im[..., 3][edge & (im[..., 0] > im[..., 1] + 70) & (im[..., 2] > im[..., 1] + 70) & (np.abs(im[..., 0] - im[..., 2]) < 60)] = 0
    tile = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    tile.paste(Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA'), ((S - W) // 2, (S - H) // 2))
    out.paste(tile, (i * (S + 2), 0)); src[name] = [i * (S + 2), 0, S, S]
out.save(os.path.join(HERE, '..', 'aurora_parts.png'), optimize=True)
print(json.dumps(src))
