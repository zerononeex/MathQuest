"""Builds art-src/town_buildings.png: the Gemini town buildings (homes,
shops) cut from their magenta sheets, each with its door position so the
game can stand the drawn door on the real door tile. Every piece of a sheet
shares one scale (k = game px per raw px, stored at 2x). Prints TOWN_ART.
Run: python3 art-src/town/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ART = os.path.join(HERE, '..')
# sheet, [(name, (door centre x, door bottom y) in the raw sheet)], game px per raw px
SHEETS = [
    ('homes_raw.jpg', [('home1', (205, 398)), ('home2', (483, 398)), ('home3', (817, 405))], 0.24),
    ('shop_raw.jpg', [('shop', (705, 636))], 0.099),
    ('desert_buildings_raw.jpg', [('desert_shop', (378, 445)), ('desert_hut', (785, 468))], 0.16),
    ('regional_shops_raw.jpg', [('shop_forest', (112, 338)), ('shop_lakes', (362, 292)), ('shop_mountain', (612, 335)), ('shop_darkness', (868, 345))], 0.3),
]
def key(A):
    r, g, b = A[..., 0], A[..., 1], A[..., 2]
    K = ((r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)) | ((r > g + 70) & (b > g + 70))
    reach = np.zeros_like(K); reach[0, :] = K[0, :]; reach[-1, :] = K[-1, :]; reach[:, 0] = K[:, 0]; reach[:, -1] = K[:, -1]
    while True:
        gr = reach.copy(); gr[1:] |= reach[:-1]; gr[:-1] |= reach[1:]; gr[:, 1:] |= reach[:, :-1]; gr[:, :-1] |= reach[:, 1:]
        gr &= K
        if (gr == reach).all(): return ~(reach | ((r > 200) & (b > 200) & (g < 110)))
        reach = gr
pieces, info = [], {}
for fn, names, k in SHEETS:
    p = os.path.join(ART, fn)
    if not os.path.exists(p): continue
    A = np.array(Image.open(p).convert('RGB')).astype(float); al = key(A)
    cols = np.where(al.sum(0) > 6)[0]
    runs, st = [], cols[0]
    for a, c in zip(cols, cols[1:]):
        if c > a + 12: runs.append((st, a)); st = c
    runs.append((st, cols[-1]))
    runs = [r for r in runs if r[1] - r[0] > 60]
    assert len(runs) == len(names), (fn, runs)
    for (name, (dx, dy)), (x0, x1) in zip(names, runs):
        if name == 'shop_lakes': # the painted pond under its dock would sit on grass: cut the water away
            band = A[:, x0:x1 + 1]; hy = int(A.shape[0] * 0.44)
            water = (band[..., 2] > 140) & (band[..., 0] < 130) & (band[..., 2] > band[..., 0] + 60)
            water[:hy] = False; al[:, x0:x1 + 1] &= ~water
        sub = al[:, x0:x1 + 1]; ys = np.where(sub.sum(1) > 1)[0]; y0, y1 = ys[0], ys[-1]
        C = A[y0:y1 + 1, x0:x1 + 1]; a = al[y0:y1 + 1, x0:x1 + 1]
        W, H = round((x1 - x0 + 1) * k * 2), round((y1 - y0 + 1) * k * 2)
        im = np.array(Image.fromarray(np.dstack([C * a[..., None], a * 255.0]).astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
        aa = im[..., 3]
        im[..., :3] = np.where(aa[..., None] > 0, im[..., :3] * 255.0 / np.maximum(aa[..., None], 1), 0)
        im[..., 3] = np.where(aa > 110, 255, 0)
        for _ in range(2):
            op = im[..., 3] > 0
            edge = op & ~(np.roll(op, 1, 0) & np.roll(op, -1, 0) & np.roll(op, 1, 1) & np.roll(op, -1, 1))
            im[..., 3][edge & (im[..., 0] > im[..., 1] + 60) & (im[..., 2] > im[..., 1] + 60)] = 0
        pieces.append((name, Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA')))
        info[name] = {'w': W / 2, 'h': H / 2, 'doorX': round((dx - x0) / (x1 - x0 + 1), 3), 'doorY': round((dy - y0) / (y1 - y0 + 1), 3)}
out = Image.new('RGBA', (sum(i.width + 2 for _, i in pieces), max(i.height for _, i in pieces)), (0, 0, 0, 0)); x = 0
for name, im in pieces:
    out.paste(im, (x, 0)); info[name]['src'] = [x, 0, im.width, im.height]; x += im.width + 2
out.save(os.path.join(ART, 'town_buildings.png'), optimize=True)
print(json.dumps(info))
