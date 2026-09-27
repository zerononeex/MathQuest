"""Builds art-src/great_fairy.png (the Great Fairy: 4 floating idle frames
+ 1 casting frame) from the top row of art-src/great_fairy_raw.jpg (a 5x2
grid of cells on magenta, black grid lines). Each cell is cut inside its
grid lines, magenta keyed from the cell border, all frames share one box
(so she does not jitter), box-downscaled to 54px tall. Prints the SRC list.
Run: python3 art-src/great_fairy/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'great_fairy_raw.jpg')).convert('RGB')).astype(float)
Hh, Ww = A.shape[:2]
y1 = Hh // 2                                   # (the sheet is an even 5x2 grid)
cells = [(round(i * Ww / 5) + 6, round((i + 1) * Ww / 5) - 6) for i in range(5)]
assert len(cells) == 5, cells
def key(C):
    r, g, b = C[..., 0], C[..., 1], C[..., 2]
    K = ((r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)) | ((r > g + 70) & (b > g + 70)) | (C.sum(2) < 60)
    reach = np.zeros_like(K); reach[0, :] = K[0, :]; reach[-1, :] = K[-1, :]; reach[:, 0] = K[:, 0]; reach[:, -1] = K[:, -1]
    while True:
        gr = reach.copy(); gr[1:] |= reach[:-1]; gr[:-1] |= reach[1:]; gr[:, 1:] |= reach[:, :-1]; gr[:, :-1] |= reach[:, 1:]
        gr &= K
        if (gr == reach).all(): return ~reach
        reach = gr
frames = []
for x0, x1 in cells:
    C = A[6:y1 - 6, x0:x1]
    frames.append((C, key(C)))
# one shared box (union of all frames), same cell size
ys = np.where(np.any([f[1].sum(1) > 2 for f in frames], axis=0))[0]
xs = np.where(np.any([f[1].sum(0) > 2 for f in frames if f[1].shape == frames[0][1].shape], axis=0))[0] if all(f[1].shape == frames[0][1].shape for f in frames) else None
out_frames = []
H = 54
for C, al in frames:
    rows = ys
    cols = np.where(al.sum(0) > 0)[0] if xs is None else xs
    by0, by1 = rows[0], rows[-1]; bx0, bx1 = cols[0], cols[-1]
    rgba = np.dstack([C[by0:by1 + 1, bx0:bx1 + 1], al[by0:by1 + 1, bx0:bx1 + 1] * 255.0])
    W = round(H * (bx1 - bx0 + 1) / (by1 - by0 + 1))
    pm = rgba.copy(); pm[..., :3] *= pm[..., 3:4] / 255.0
    im = np.array(Image.fromarray(pm.astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
    a = im[..., 3]
    im[..., :3] = np.where(a[..., None] > 0, im[..., :3] * 255.0 / np.maximum(a[..., None], 1), 0)
    im[..., 3] = np.where(a > 110, 255, 0)
    im[..., 3][(im[..., 0] > 215) & (im[..., 2] > 165) & (im[..., 1] < 125)] = 0
    for _ in range(2): # magenta-tinted rim pixels (the dress is a warmer pink and stays)
        op = im[..., 3] > 0
        edge = op & ~(np.roll(op, 1, 0) & np.roll(op, -1, 0) & np.roll(op, 1, 1) & np.roll(op, -1, 1))
        mag = (im[..., 0] > im[..., 1] + 60) & (im[..., 2] > im[..., 1] + 60)
        im[..., 3][edge & mag] = 0
    out_frames.append(Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA'))
out = Image.new('RGBA', (sum(f.width + 2 for f in out_frames), H), (0, 0, 0, 0))
src, x = [], 0
for f in out_frames:
    out.paste(f, (x, 0)); src.append([x, 0, f.width, H]); x += f.width + 2
out.save(os.path.join(HERE, '..', 'great_fairy.png'), optimize=True)
print(json.dumps(src))
