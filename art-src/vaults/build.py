"""Builds art-src/vaults.png (Relic Vault entrances + the Great Fairy's
grotto mound) from art-src/vaults_raw.jpg (5 vaults in a row: v1, v2, v3,
v4 sealed, v4 open) and, when present, art-src/grotto_raw.jpg (mound
closed, open). Magenta keyed from the border, each piece cropped and
box-downscaled to its in-game width. Prints VAULT_SRC.
Run: python3 art-src/vaults/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
SHEETS = [('vaults_raw.jpg', ['v1', 'v2', 'v3', 'v4', 'v4open'], 44), ('grotto_raw.jpg', ['grotto', 'grottoOpen'], 84)]
def key(A):
    r, g, b = A[..., 0], A[..., 1], A[..., 2]
    KEY = ((r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)) | ((r > g + 70) & (b > g + 70))
    reach = np.zeros_like(KEY); reach[0, :] = KEY[0, :]; reach[-1, :] = KEY[-1, :]; reach[:, 0] = KEY[:, 0]; reach[:, -1] = KEY[:, -1]
    while True:
        gr = reach.copy(); gr[1:] |= reach[:-1]; gr[:-1] |= reach[1:]; gr[:, 1:] |= reach[:, :-1]; gr[:, :-1] |= reach[:, 1:]
        gr &= KEY
        if (gr == reach).all(): return ~reach
        reach = gr
def shrink(A, alpha, W):
    rows, cols = np.where(alpha.sum(1) > 14)[0], np.where(alpha.sum(0) > 14)[0]  # (loose sparks and specks do not widen the crop)
    y0, y1, x0, x1 = rows[0], rows[-1], cols[0], cols[-1]
    rgba = np.dstack([A[y0:y1 + 1, x0:x1 + 1], alpha[y0:y1 + 1, x0:x1 + 1] * 255.0])
    H = round(W * (y1 - y0 + 1) / (x1 - x0 + 1))
    pm = rgba.copy(); pm[..., :3] *= pm[..., 3:4] / 255.0
    im = np.array(Image.fromarray(pm.astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
    a = im[..., 3]
    im[..., :3] = np.where(a[..., None] > 0, im[..., :3] * 255.0 / np.maximum(a[..., None], 1), 0)
    im[..., 3] = np.where(a > 120, 255, 0)
    im[..., 3][(im[..., 0] > 215) & (im[..., 2] > 165) & (im[..., 1] < 125)] = 0
    return Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA')
pieces = []
for fn, names, W in SHEETS:
    p = os.path.join(HERE, '..', fn)
    if not os.path.exists(p): continue
    A = np.array(Image.open(p).convert('RGB')).astype(float)
    alpha = key(A)
    cols = np.where(alpha.sum(0) > 6)[0]
    runs, start = [], cols[0]
    for a, c in zip(cols, cols[1:]):
        if c > a + 6: runs.append((start, a)); start = c
    runs.append((start, cols[-1]))
    runs = [r for r in runs if r[1] - r[0] > 40]
    assert len(runs) == len(names), (fn, runs)
    for name, (x0, x1) in zip(names, runs):
        al = np.zeros_like(alpha); al[:, x0:x1 + 1] = alpha[:, x0:x1 + 1]
        pieces.append((name, shrink(A, al, W)))
out = Image.new('RGBA', (sum(t.width + 2 for _, t in pieces), max(t.height for _, t in pieces)), (0, 0, 0, 0))
src, x = {}, 0
for name, t in pieces:
    out.paste(t, (x, 0)); src[name] = [x, 0, t.width, t.height]; x += t.width + 2
out.save(os.path.join(HERE, '..', 'vaults.png'), optimize=True)
print(json.dumps(src))
