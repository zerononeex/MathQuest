"""Builds art-src/boss_poses.png (pose sheets for Malrek (two sheets), Puffling,
Voltuga, Grovak and Cindermaw), art-src/map_symbols.png and art-src/castle_props.png from the Gemini sheets
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
    ('malrek2', 'green', [4, 4], 150),       # second Malrek sheet (orbs, ground slam, nova aura)
    ('castle_props', 'green', [6, 6], 64),   # crystals on pedestals, red/blue barrier pegs, brazier
    ('cindermaw', 'green', [3, 3], 90),      # walk, lunge, spit, rear + fire ring, stunned, hurt
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
def scale_poses(A, fg, poses, name, target):
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
    return imgs
def blob_poses(fg, n):
    # connected components on a 4x-downsampled dilated mask; the n biggest
    # are the poses, smaller bits (sparks, steam, a fireball) join the nearest
    H, W = fg.shape; f = 4
    m = dilate(fg, 2)[:H // f * f, :W // f * f].reshape(H // f, f, W // f, f).any(axis=(1, 3))
    lab = np.zeros(m.shape, int); cur = 0; boxes = []
    for sy, sx in zip(*np.where(m)):
        if lab[sy, sx]: continue
        cur += 1; st = [(sy, sx)]; lab[sy, sx] = cur; bx = [sx, sy, sx, sy, 0]
        while st:
            y, x = st.pop(); bx[0] = min(bx[0], x); bx[1] = min(bx[1], y); bx[2] = max(bx[2], x); bx[3] = max(bx[3], y); bx[4] += 1
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < m.shape[0] and 0 <= xx < m.shape[1] and m[yy, xx] and not lab[yy, xx]: lab[yy, xx] = cur; st.append((yy, xx))
        boxes.append(bx)
    boxes.sort(key=lambda b: -b[4])
    big, small = [list(b) for b in boxes[:n]], boxes[n:]
    for b in small:
        cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
        t = min(big, key=lambda g: max(0, g[0] - cx, cx - g[2]) + max(0, g[1] - cy, cy - g[3]))
        t[0] = min(t[0], b[0]); t[1] = min(t[1], b[1]); t[2] = max(t[2], b[2]); t[3] = max(t[3], b[3])
    rows = sorted(big, key=lambda b: (b[1] + b[3]) / 2)
    top, bot = sorted(rows[:n // 2], key=lambda b: b[0]), sorted(rows[n // 2:], key=lambda b: b[0])
    out = []
    for b in top + bot:
        x0, y0, x1, y1 = b[0] * f, b[1] * f, (b[2] + 1) * f, (b[3] + 1) * f
        sub = fg[y0:y1, x0:x1]; ys = np.where(sub.sum(1) > 0)[0]; xs = np.where(sub.sum(0) > 0)[0]
        out.append((x0 + xs[0], y0 + ys[0], x0 + xs[-1] + 1, y0 + ys[-1] + 1))
    return out
tables = {}
atl_rows = []
for name, bg, per, target in SHEETS:
    A = np.array(Image.open(os.path.join(ART, (name if name == 'map_symbols' else name + '_poses') + '_raw.jpg')).convert('RGB')).astype(float)
    fg = key(A, bg)
    fgd = dilate(fg, 3)
    if name in ('cindermaw', 'grovak'): # rows overlap vertically: split by connected blobs instead
        poses = blob_poses(fg, sum(per))
        atl_rows.append((name, scale_poses(A, fg, poses, name, target)))
        continue
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
    atl_rows.append((name, scale_poses(A, fg, poses, name, target)))
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
t1 = pack([r for r in atl_rows if r[0] not in ('map_symbols', 'castle_props')], 'boss_poses.png')
t3 = pack([r for r in atl_rows if r[0] == 'castle_props'], 'castle_props.png')
t2 = pack([r for r in atl_rows if r[0] == 'map_symbols'], 'map_symbols.png')
print(json.dumps(t1)); print(json.dumps(t2)); print(json.dumps(t3))
