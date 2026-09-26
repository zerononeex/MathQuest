"""Builds art-src/elev_tiles.png (overworld cliff / stairs / cave / ledge /
boulder tiles) from art-src/elevation_kit.webp.

The kit's pixel art is ~4 source px per art pixel, so every piece is
downscaled by 4 with a palette mode filter (magenta keyed out, fringe
despilled to the outline colour): 1 art pixel = 1 game pixel on 16px tiles.
Flat plateau grass is made transparent so the game's own ground tile shows
through; grass tufts and rock are recoloured per theme:
  row 0 grass (brown rock), row 1 dark (Darkness: grey-violet rock),
  row 2 sand (Desert: sandstone).
Atlas layout per 32px theme row (x offsets):
  0-63 face x4 (16x32) | 64 capL | 80 capR | 96 stairs | 112-159 cave (48x32)
  160 ledge (top 16) + rim (bottom 16) | 176 sideW (top) + sideE (bottom)
  192 rimNW (top) + rimNE (bottom) | 208 boulder 32x32 | 240 cracked 32x32
Run: python3 art-src/elevation/build.py   (needs pillow + numpy)
"""
import os
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'elevation_kit.webp')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
BG = (r > 170) & (b > 170) & (g < 120)
SP = (b > g * 1.25 + 10) & (r > g * 1.25) & ~BG
px = A[~BG & ~SP]
rng = np.random.default_rng(0)
px = px[rng.choice(len(px), 50000, replace=False)]
K = 20
C = px[rng.choice(len(px), K, replace=False)]
for _ in range(40):
    lab = ((px[:, None] - C[None]) ** 2).sum(-1).argmin(1)
    for k in range(K):
        if (lab == k).any(): C[k] = px[lab == k].mean(0)
C = C[np.argsort(C.sum(1))]
IDX = ((A[:, :, None] - C[None, None]) ** 2).sum(-1).argmin(-1)
IDX[SP] = 0
IDX[BG] = -1

def ds(x, y, w, h, f=4.0):
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
    return o

P = {k: ds(*v) for k, v in {
    'strip': (68, 16, 316, 121), 'stairs': (16, 144, 172, 129), 'cave': (520, 285, 193, 130),
    'ledge': (750, 285, 206, 127), 'boulder': (17, 431, 120, 111), 'cracked': (162, 435, 120, 107)}.items()}

def lum(c): return 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]
GREEN = [k for k in range(K) if C[k][1] > C[k][0] + 12 and C[k][1] > C[k][2] + 8]
GREY = [k for k in range(K) if max(C[k]) - min(C[k]) < 22 and k != 0]
ROCK = [k for k in range(1, K) if k not in GREEN and k not in GREY]
# the flat plateau-top green (most common green in the strip's top rows)
top = P['strip'][2:6].ravel(); top = top[np.isin(top, GREEN)]
FLAT = np.bincount(top, minlength=K).argmax()
THEMES = {
    'grass': {'green': [(34, 74, 40), (52, 106, 46), (70, 136, 52), (77, 149, 58), (88, 170, 66), (116, 192, 80)],
              'rock': None},
    'dark': {'green': [(34, 48, 44), (48, 66, 58), (58, 79, 68), (62, 86, 73), (69, 97, 80), (84, 111, 92)],
             'rock': [(30, 26, 38), (52, 48, 64), (70, 66, 84), (88, 84, 104), (108, 104, 124), (132, 128, 146)]},
    'sand': {'green': [(150, 128, 84), (176, 160, 110), (200, 197, 151), (212, 208, 160), (223, 219, 168), (237, 233, 182)],
             'rock': [(70, 34, 22), (120, 62, 34), (156, 90, 48), (188, 118, 64), (214, 150, 88), (236, 184, 120)]},
}
def ramp_map(keys, ramp):
    ks = sorted(keys, key=lambda k: lum(C[k]))
    return {k: ramp[min(len(ramp) - 1, int(i * len(ramp) / len(ks)))] for i, k in enumerate(ks)}
def render(o, theme, clear_flat=True):
    t = THEMES[theme]
    gm = ramp_map(GREEN, t['green'])
    rm = ramp_map(ROCK, t['rock']) if t['rock'] else None
    out = np.zeros(o.shape + (4,), np.uint8)
    for (y, x), k in np.ndenumerate(o):
        if k < 0: continue
        if clear_flat and k == FLAT: continue
        if k in GREEN: c = gm[k]
        elif rm and k in ROCK: c = rm[k]
        else: c = tuple(C[k].astype(int))
        out[y, x] = (*c, 255)
    return out

OUT = 0  # outline index
def cap_top_outline(o):
    """drop the kit's outline row(s) across the top of a plateau piece"""
    o = o.copy()
    for x in range(o.shape[1]):
        y = 0
        while y < o.shape[0] and o[y, x] in (-1, OUT): o[y, x] = -1 if o[y, x] == OUT else o[y, x]; y += 1
    return o

atlas = np.zeros((96, 272, 4), np.uint8)
def put(arr, x, y):
    h, w = arr.shape[:2]
    atlas[y:y + h, x:x + w] = arr

strip = cap_top_outline(P['strip'])           # 30 x 79
def face_piece(x0):
    o = np.full((32, 16), -1, int); o[0:30] = strip[0:30, x0:x0 + 16]
    # the kit's top highlight row would draw a line across the plateau top
    for (y, x), k in np.ndenumerate(o[:5]):
        if k in GREEN: o[y, x] = -1
    return o
stairs = cap_top_outline(P['stairs'])          # 32 x 43
sx = 13
cave = cap_top_outline(P['cave'])              # 32 x 48
ledge = P['ledge']                             # 32 x 52
for ti, theme in enumerate(['grass', 'dark', 'sand']):
    Y = ti * 32
    for i, x0 in enumerate([8, 24, 40, 56]): put(render(face_piece(x0), theme), i * 16, Y)
    put(render(face_piece(0), theme), 64, Y)
    put(render(face_piece(strip.shape[1] - 16), theme), 80, Y)
    st = np.full((32, 16), -1, int); st[:stairs.shape[0]] = stairs[:32, sx:sx + 16]
    put(render(st, theme), 96, Y)
    cv = np.full((32, 48), -1, int); cv[:cave.shape[0], :cave.shape[1]] = cave[:32, :48]
    put(render(cv, theme), 112, Y)
    # ledge: a short 1-tile face (grass tufts on top, rounded rock below)
    lg = ledge[13:29, 18:34]
    put(render(lg, theme), 160, Y)
    # rim: north edge of a plateau (walk-blocking lip): outline + rock + tufts
    rim = np.full((16, 16), -1, int)
    rock = [k for k in ROCK if lum(C[k]) > 60]
    tex = strip[14:20, 8:24]
    rim[0, :] = OUT; rim[1:3, :] = tex[0:2]; rim[3, :] = OUT
    tuft = strip[6:9, 8:24]
    for (y, x), k in np.ndenumerate(tuft):
        if k in GREEN and k != FLAT: rim[4 + y, x] = k
    put(render(rim, theme), 160, Y + 16)
    # side walls: a 6px rock band against the plateau with an outline
    tex = strip[10:26, 20:26]
    sw = np.full((16, 16), -1, int); sw[:, 10:16] = tex; sw[:, 9] = OUT
    se = np.full((16, 16), -1, int); se[:, 0:6] = tex[:, ::-1]; se[:, 6] = OUT
    put(render(sw, theme), 176, Y); put(render(se, theme), 176, Y + 16)
    # rim corners: rim with the side outline turned down
    nw = rim.copy(); nw[:, 0] = OUT; nw[1:3, 1] = rim[1:3, 1]
    ne = rim.copy(); ne[:, 15] = OUT
    put(render(nw, theme), 192, Y); put(render(ne, theme), 192, Y + 16)
    for key, x in (('boulder', 208), ('cracked', 240)):
        o = P[key]; bb = np.full((32, 32), -1, int)
        h, w = o.shape; oy, ox = 32 - h, (32 - w) // 2
        bb[oy:, ox:ox + w] = o
        put(render(bb, theme, clear_flat=False), x, Y)
Image.fromarray(atlas).save(os.path.join(HERE, '..', 'elev_tiles.png'), optimize=True)
print('wrote elev_tiles.png', atlas.shape, 'green', GREEN, 'flat', FLAT)
