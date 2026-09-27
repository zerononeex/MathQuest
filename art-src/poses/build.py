"""Builds art-src/boss_poses.png (pose sheets for Malrek, Puffling, Voltuga
and Grovak) and art-src/map_symbols.png from the Gemini sheets
art-src/<name>_raw.jpg (green or magenta backgrounds).

The background and its JPEG fringe are keyed out; the sheet is cut into
row bands and then into poses by gaps in the (lightly dilated) foreground,
so sparks and lightning stay with their pose. Bands too short to be art
(the Puffling sheet's text labels) are dropped. Every pose of one sheet is
scaled by the same factor so the poses keep their relative size, and its
crop is packed into the atlas with its foot line (bottom of the bbox).
Prints the crop tables (x, y, w, h) used by math-quest.html.
Run: python3 art-src/poses/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, '..')
SHEETS = [  # name, background, expected poses per band, target idle height (px)
    ('malrek', 'green', [4, 4], 150),
    ('puffling', 'green', [4, 3], 110),
    ('voltuga', 'magenta', [3, 3], 110),
    ('grovak', 'magenta', [4, 4], 140),
    ('map_symbols', 'magenta', [4, 4, 4], 64),
]
def key(A, bg):
    r, g, b = A[..., 0], A[..., 1], A[..., 2]
    if bg == 'green':
        BG = (g > 140) & (r < 140) & (b < 140) & (g > r + 50) & (g > b + 50)
        FR = (g > r + 45) & (g > b + 45)
    else:
        BG = (r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)
        FR = (r > g + 60) & (b > g + 60)
    return ~(BG | FR)
def runs(m, gap, minlen):
    idx = np.where(m)[0]; out = []; s = p = idx[0]
    for c in idx[1:]:
        if c - p > gap: out.append((s, p)); s = c
        p = c
    out.append((s, p))
    return [(a, b) for a, b in out if b - a >= minlen]
def dilate(m, k):
    o = m.copy()
    for d in range(1, k + 1):
        o[d:] |= m[:-d]; o[:-d] |= m[d:]; o[:, d:] |= m[:, :-d]; o[:, :-d] |= m[:, d:]
    return o
tables = {}
atl_rows = []
for name, bg, per, target in SHEETS:
    A = np.array(Image.open(os.path.join(ART, (name if name == 'map_symbols' else name + '_poses') + '_raw.jpg')).convert('RGB')).astype(float)
    fg = key(A, bg)
    fgd = dilate(fg, 3)
    bands = runs(fgd.sum(1) > 2, 6, 60 if name != 'map_symbols' else 40)
    # drop text-label bands (short, wide rows of letters)
    bands = [bd for bd in bands if bd[1] - bd[0] > (70 if name != 'map_symbols' else 40)]
    assert len(bands) == len(per), (name, bands)
    poses = []
    for (y0, y1), n in zip(bands, per):
        cols = runs(fgd[y0:y1 + 1].sum(0) > 1, 14, 30)
        if len(cols) > n: # merge the closest neighbours until the count fits
            while len(cols) > n:
                gaps = [cols[i + 1][0] - cols[i][1] for i in range(len(cols) - 1)]
                i = int(np.argmin(gaps)); cols[i:i + 2] = [(cols[i][0], cols[i + 1][1])]
        while len(cols) < n: # two poses touching: cut the widest run at its thinnest column
            i = int(np.argmax([c[1] - c[0] for c in cols])); c0, c1 = cols[i]
            prof = fg[y0:y1 + 1, c0:c1 + 1].sum(0).astype(float)
            lo, hi = int(len(prof) * 0.3), int(len(prof) * 0.7)
            cut = c0 + lo + int(np.argmin(prof[lo:hi]))
            cols[i:i + 1] = [(c0, cut - 1), (cut + 1, c1)]
        assert len(cols) == n, (name, y0, cols)
        for x0, x1 in cols:
            sub = fg[y0:y1 + 1, x0:x1 + 1]
            ys = np.where(sub.sum(1) > 0)[0]; xs = np.where(sub.sum(0) > 0)[0]
            bx0, by0, bx1, by1 = x0 + xs[0], y0 + ys[0], x0 + xs[-1] + 1, y0 + ys[-1] + 1
            poses.append((bx0, by0, bx1, by1))
    ih = poses[0][3] - poses[0][1]
    sc = target / ih if name != 'map_symbols' else None
    imgs = []
    for (x0, y0, x1, y1) in poses:
        rgba = np.dstack([A[y0:y1, x0:x1], fg[y0:y1, x0:x1] * 255.0]).astype(np.uint8)
        im = Image.fromarray(rgba, 'RGBA')
        s = sc if sc else target / max(x1 - x0, y1 - y0)
        im = im.resize((max(1, round((x1 - x0) * s)), max(1, round((y1 - y0) * s))), Image.BOX)
        a = np.array(im); a[..., 3] = np.where(a[..., 3] > 110, 255, 0)
        imgs.append(Image.fromarray(a, 'RGBA'))
    atl_rows.append((name, imgs))
# pack: boss poses in one atlas (a row per boss), map symbols in their own
def pack(rows, fname):
    W = max(sum(i.width + 2 for i in imgs) for _, imgs in rows)
    H = sum(max(i.height for i in imgs) + 2 for _, imgs in rows)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); y = 0; tab = {}
    for name, imgs in rows:
        x = 0; tab[name] = []
        for im in imgs:
            out.paste(im, (x, y)); tab[name].append([x, y, im.width, im.height]); x += im.width + 2
        y += max(i.height for i in imgs) + 2
    out.save(os.path.join(ART, fname), optimize=True)
    return tab
t1 = pack([r for r in atl_rows if r[0] != 'map_symbols'], 'boss_poses.png')
t2 = pack([r for r in atl_rows if r[0] == 'map_symbols'], 'map_symbols.png')
print(json.dumps(t1)); print(json.dumps(t2))
