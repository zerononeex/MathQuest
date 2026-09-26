"""Builds art-src/ow_props.png (overworld props: healing spring, lever x2,
cacti, desert rocks, ruin pillars, campfire, tree stump, wildflowers) from
art-src/ow_props_raw.jpg (Gemini sheet on magenta).

Magenta and its JPEG fringe keyed out (the art's own dark outline stays), every pixel
snapped to a 64-colour palette (small accents like the red lever knob and the flowers need their own entries), each piece downscaled by 4 (the tall
pillar by 5) with a palette mode filter so 1 art pixel = 1 game pixel.
Prints the SRC crop table (x, y, w, h) used by math-quest.html.
Run: python3 art-src/ow_props/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'ow_props_raw.jpg')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
BG = (r > 150) & (b > 150) & (g < 120) & (np.abs(r - b) < 90)
SP = ~BG & (r > g + 40) & (b > g + 40)          # magenta fringe (JPEG bleed)
px = A[~BG & ~SP]
rng = np.random.default_rng(0)
px = px[rng.choice(len(px), 60000, replace=False)]
K = 64
C = px[rng.choice(len(px), K, replace=False)]
for _ in range(40):
    lab = ((px[:, None] - C[None]) ** 2).sum(-1).argmin(1)
    for k in range(K):
        if (lab == k).any(): C[k] = px[lab == k].mean(0)
C = C[np.argsort(C.sum(1))]
IDX = ((A[:, :, None] - C[None, None]) ** 2).sum(-1).argmin(-1)
IDX[SP] = -1   # fringe is background: as outline it filled the gaps between thin stems with black
IDX[BG] = -1
PIECES = [  # name, crop box in the raw sheet, downscale factor
    ('spring', (17, 30, 167, 132), 4), ('leverUp', (239, 34, 90, 116), 4), ('leverDown', (439, 38, 99, 116), 4),
    ('cactus', (682, 13, 120, 158), 4), ('barrel', (892, 64, 81, 98), 4), ('pillar', (34, 230, 124, 304), 5),
    ('rocks', (204, 217, 154, 129), 4), ('sandstone', (674, 222, 133, 120), 4), ('pillarStump', (205, 401, 141, 133), 4),
    ('campfire', (418, 401, 137, 128), 4), ('stump', (666, 410, 149, 124), 8), ('flowers', (866, 414, 128, 107), 7.5),  # small next to a 32px tree
]
LUM = 0.3 * C[:, 0] + 0.59 * C[:, 1] + 0.11 * C[:, 2]
DARK = set(int(k) for k in np.where(LUM < 45)[0])
def ds_soft(x, y, w, h, f):
    # for delicate pieces (the wildflowers): colour wins a block when it has
    # a fair share, gaps between stems stay open, outline only when solid
    raw = IDX[y:y + h, x:x + w]
    W, H = int(round(w / f)), int(round(h / f))
    o = np.full((H, W), -1, int)
    for yy in range(H):
        for xx in range(W):
            blk = raw[int(yy * f):int((yy + 1) * f), int(xx * f):int((xx + 1) * f)].ravel()
            n = len(blk); bgc = (blk < 0).sum()
            col = [v for v in blk if v >= 0 and v not in DARK]
            if len(col) >= 0.35 * n: o[yy, xx] = np.bincount(col, minlength=K).argmax()
            elif bgc >= 0.3 * n: continue
            elif bgc + len(col) < 0.5 * n: o[yy, xx] = 0
            elif col: o[yy, xx] = np.bincount(col, minlength=K).argmax()
    ys, xs = np.where(o >= 0)
    return o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
def ds(x, y, w, h, f):
    c = IDX[y:y + h, x:x + w]
    W, H = int(round(w / f)), int(round(h / f))
    o = np.full((H, W), -1, int)
    for yy in range(H):
        for xx in range(W):
            blk = c[int(yy * f):int((yy + 1) * f), int(xx * f):int((xx + 1) * f)].ravel()
            if (blk >= 0).mean() < 0.5: continue
            v = blk[blk >= 0]
            cnt = np.bincount(v, minlength=K)
            o[yy, xx] = 0 if cnt[0] >= 0.3 * len(v) else cnt.argmax()
    ys, xs = np.where(o >= 0)
    return o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
outs = [(n, (ds_soft if n == 'flowers' else ds)(*box, f)) for n, box, f in PIECES]
def strip_thin_outline(o, passes=3):
    # the wildflowers' 1px stems come out as clumps of pure outline at this
    # scale: drop outline pixels that poke into empty space (2+ transparent
    # 4-neighbours), keeping the solid silhouette edge and the colours
    o = o.copy()
    for _ in range(passes):
        kill = []
        for (y, x), v in np.ndenumerate(o):
            if v not in DARK and v != 0: continue
            empty = sum(1 for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))
                        if not (0 <= y + dy < o.shape[0] and 0 <= x + dx < o.shape[1]) or o[y + dy, x + dx] < 0)
            if empty >= 2: kill.append((y, x))
        for y, x in kill: o[y, x] = -1
    return o
outs = [(n, strip_thin_outline(o) if n == 'flowers' else o) for n, o in outs]
Wt = sum(o.shape[1] + 2 for _, o in outs); Ht = max(o.shape[0] for _, o in outs)
atlas = np.zeros((Ht, Wt, 4), np.uint8)
src, x = {}, 0
for n, o in outs:
    h, w = o.shape
    m = o >= 0
    tile = np.zeros((h, w, 4), np.uint8); tile[m, :3] = C[o[m]].astype(np.uint8); tile[m, 3] = 255
    atlas[Ht - h:Ht, x:x + w] = tile          # bottom-aligned (feet on the last row)
    src[n] = [x, Ht - h, w, h]
    x += w + 2
Image.fromarray(atlas).save(os.path.join(HERE, '..', 'ow_props.png'), optimize=True)
print(json.dumps(src))
