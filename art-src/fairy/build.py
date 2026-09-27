"""Builds art-src/fairy.png (the spring fairy's 4 wing-flap frames) from
art-src/fairy_raw.jpg (Gemini sheet on magenta). Magenta keyed, each fairy
isolated as the connected blob around its body (the loose sparkles are
dropped - the game draws its own), frames share one box so the body stays
put while the wings beat, box-downscaled to 28px tall. Prints FAIRY_SRC.
Run: python3 art-src/fairy/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'fairy_raw.jpg')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
BG = (r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)
FR = ~BG & (r > g + 70) & (b > g + 70)
M = ~(BG | FR)
cols = np.where(M.sum(0) > 6)[0]
runs, start = [], cols[0]
for a, c in zip(cols, cols[1:]):
    if c > a + 8: runs.append((start, a)); start = c
runs.append((start, cols[-1]))
runs = [(x0, x1) for x0, x1 in runs if x1 - x0 > 120]
assert len(runs) == 4, runs
def blob(x0, x1):
    sub = M[:, x0:x1 + 1]
    rows = np.where(sub.sum(1) > 20)[0]
    cy, cx = (rows[0] + rows[-1]) // 2, (x1 - x0) // 2
    seed = np.zeros_like(sub); seed[cy - 3:cy + 4, cx - 3:cx + 4] = sub[cy - 3:cy + 4, cx - 3:cx + 4]
    while True:
        gr = seed.copy()
        for dy in (-2, -1, 0, 1, 2):
            for dx in (-2, -1, 0, 1, 2): gr |= np.roll(np.roll(seed, dy, 0), dx, 1)
        gr &= sub
        if (gr == seed).all(): return gr
        seed = gr
blobs = [blob(x0, x1) for x0, x1 in runs]
boxes = []
for (x0, x1), bl in zip(runs, blobs):
    ys, xs = np.where(bl)
    hy = ys.min() + (ys.max() - ys.min()) * 0.25         # centre on the head, not the wing/sparkle spread
    head = xs[(ys > hy - 6) & (ys < hy + 6)]
    boxes.append((xs.min() + x0, xs.max() + x0, ys.min(), ys.max(), (head.min() + head.max()) / 2 + x0))
W = 2 * int(max(max(bx[4] - bx[0], bx[1] - bx[4]) for bx in boxes)) + 4
y0 = min(bx[2] for bx in boxes); y1 = max(bx[3] for bx in boxes)
H = 28; OW = round(W * H / (y1 - y0 + 1))
out = Image.new('RGBA', ((OW + 2) * 4, H), (0, 0, 0, 0)); src = []
for i, ((x0, x1), bl, bx) in enumerate(zip(runs, blobs, boxes)):
    cx = int(round(bx[4])); lx = cx - W // 2
    full = np.zeros(M.shape, bool); full[:, x0:x1 + 1] = bl
    a = full[y0:y1 + 1, lx:lx + W].astype(float) * 255
    rgb = A[y0:y1 + 1, lx:lx + W] * (a[..., None] / 255)
    im = np.array(Image.fromarray(np.dstack([rgb, a]).astype(np.uint8), 'RGBA').resize((OW, H), Image.BOX)).astype(float)
    al = im[..., 3]
    im[..., :3] = np.where(al[..., None] > 0, im[..., :3] * 255 / np.maximum(al[..., None], 1), 0)
    im[..., 3] = np.where(al > 110, 255, 0)
    out.paste(Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA'), (i * (OW + 2), 0))
    src.append([i * (OW + 2), 0, OW, H])
out.save(os.path.join(HERE, '..', 'fairy.png'), optimize=True)
print(json.dumps(src))
