"""Builds art-src/sword_icons.png (sword, Sharp Sword, Hero Sword) from
art-src/sword_icons_raw.jpg (Gemini sheet on magenta: three framed tiles).
Each tile's gold frame is trimmed off and its navy panel keyed out, so only
the blade is left (the weapon slot draws its own frame); each sword is
fitted into a 96px square. Prints the SRC crop table.
Run: python3 art-src/sword_icons/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'sword_icons_raw.jpg')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
BG = (r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)
cols = np.where((~BG).sum(0) > 40)[0]
tiles, s = [], cols[0]
for a, c in zip(cols, cols[1:]):
    if c - a > 4: tiles.append((s, a)); s = c
tiles.append((s, cols[-1]))
tiles = [t for t in tiles if t[1] - t[0] > 100]
assert len(tiles) == 3, tiles
S = 96
out = Image.new('RGBA', ((S + 2) * 3, S), (0, 0, 0, 0)); src = {}
for i, (name, (x0, x1)) in enumerate(zip(['sword', 'sharpSword', 'heroSword'], tiles)):
    rows = np.where((~BG[:, x0:x1 + 1]).sum(1) > 40)[0]
    y0, y1 = rows[0], rows[-1]
    m = int((x1 - x0) * 0.13)  # trim the gold frame and its corner scrolls
    sub = A[y0 + m:y1 - m, x0 + m:x1 - m]
    sr, sg, sb = sub[..., 0], sub[..., 1], sub[..., 2]
    # the navy panel: flood-filled from the edges, only through pixels close
    # to the panel's own colour, so the blue blade is never eaten
    ref = np.median(sub[2:8, 2:8].reshape(-1, 3), 0)
    close = np.sqrt(((sub - ref) ** 2).sum(-1)) < 30
    navy = np.zeros(close.shape, bool); H, W = close.shape
    st = [(y, x) for y in range(H) for x in (0, W - 1) if close[y, x]] + [(y, x) for x in range(W) for y in (0, H - 1) if close[y, x]]
    for y, x in st: navy[y, x] = True
    while st:
        y, x = st.pop()
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= yy < H and 0 <= xx < W and close[yy, xx] and not navy[yy, xx]: navy[yy, xx] = True; st.append((yy, xx))
    alpha = ~navy
    ys, xs = np.where(alpha)
    sub, alpha = sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1], alpha[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    im = Image.fromarray(np.dstack([sub, alpha * 255.0]).astype(np.uint8), 'RGBA')
    k = S / max(im.width, im.height)
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.BOX)
    a = np.array(im); a[..., 3] = np.where(a[..., 3] > 110, 255, 0)
    tile = Image.new('RGBA', (S, S), (0, 0, 0, 0)); tile.paste(Image.fromarray(a, 'RGBA'), ((S - im.width) // 2, (S - im.height) // 2))
    out.paste(tile, (i * (S + 2), 0)); src[name] = [i * (S + 2), 0, S, S]
out.save(os.path.join(HERE, '..', 'sword_icons.png'), optimize=True)
print(json.dumps(src))
