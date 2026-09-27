"""Builds art-src/guardian_poses.png (the Relic Vault guardians' pose
sheets) from art-src/<kind>_poses_raw.jpg: Gemini sheets on magenta laid
out as a 4x2 grid of poses with a text label under each. Each grid cell is
cut above its label, the magenta keyed from the cell border (dust, rocks
and rings stay), every pose of one sheet scaled by the same factor (the
idle pose -> 96px tall) and packed with its foot at the bottom of its box.
Prints GUARDIAN_POSES.
Run: python3 art-src/guardians/build.py   (needs pillow + numpy)
"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ART = os.path.join(HERE, '..')
KINDS = ['rubblejaw', 'flarewing', 'squallback', 'astral']
LABELLED = [(0.0, 0.455), (0.52, 0.93)] # 2 rows cut above their text label strips
LAYOUT = { # columns, row bands (fractions of the sheet height[, columns in that row])
  'rubblejaw': (4, LABELLED),
  'flarewing': (3, [(0.0, 0.5), (0.5, 1.0)]),
  'squallback': (4, [(0.0, 0.435, 4), (0.435, 1.0, 3)]), # (the lightning bolt reaches up between the rows)
}
def key(C):
    r, g, b = C[..., 0], C[..., 1], C[..., 2]
    K = ((r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)) | ((r > g + 70) & (b > g + 70))
    reach = np.zeros_like(K); reach[0, :] = K[0, :]; reach[-1, :] = K[-1, :]; reach[:, 0] = K[:, 0]; reach[:, -1] = K[:, -1]
    while True:
        gr = reach.copy(); gr[1:] |= reach[:-1]; gr[:-1] |= reach[1:]; gr[:, 1:] |= reach[:, :-1]; gr[:, :-1] |= reach[:, 1:]
        gr &= K
        if (gr == reach).all(): return ~(reach | ((r > 200) & (b > 200) & (g < 110))) # (+ pure magenta trapped inside rings / between legs)
        reach = gr
rows_out, tab = [], {}
for kind in KINDS:
    p = os.path.join(ART, kind + '_poses_raw.jpg')
    if not os.path.exists(p): continue
    A = np.array(Image.open(p).convert('RGB')).astype(float); H, W = A.shape[:2]
    cuts = []
    ncol, rows = LAYOUT.get(kind, (4, LABELLED))
    for row in rows:
        r0, r1 = row[0], row[1]; ncol = row[2] if len(row) > 2 else LAYOUT.get(kind, (4,))[0]
        for c in range(ncol):
            x0, x1, y0, y1 = round(c * W / ncol) + 3, round((c + 1) * W / ncol) - 3, round(r0 * H), round(r1 * H)
            C = A[y0:y1, x0:x1]; al = key(C)
            ys, xs = np.where(al.sum(1) > 1)[0], np.where(al.sum(0) > 1)[0]
            cuts.append((C[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1], al[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]))
    s = 96 / cuts[0][0].shape[0]
    imgs = []
    for C, al in cuts:
        h, w = al.shape; Wn, Hn = max(1, round(w * s)), max(1, round(h * s))
        rgba = np.dstack([C * al[..., None], al * 255.0])
        im = np.array(Image.fromarray(rgba.astype(np.uint8), 'RGBA').resize((Wn, Hn), Image.BOX)).astype(float)
        a = im[..., 3]
        im[..., :3] = np.where(a[..., None] > 0, im[..., :3] * 255.0 / np.maximum(a[..., None], 1), 0)
        im[..., 3] = np.where(a > 110, 255, 0)
        for _ in range(2):
            op = im[..., 3] > 0
            edge = op & ~(np.roll(op, 1, 0) & np.roll(op, -1, 0) & np.roll(op, 1, 1) & np.roll(op, -1, 1))
            im[..., 3][edge & (im[..., 0] > im[..., 1] + 70) & (im[..., 2] > im[..., 1] + 70)] = 0
        imgs.append(Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA'))
    rows_out.append((kind, imgs))
Wt = max(sum(i.width + 2 for i in imgs) for _, imgs in rows_out)
Ht = sum(max(i.height for i in imgs) + 2 for _, imgs in rows_out)
out = Image.new('RGBA', (Wt, Ht), (0, 0, 0, 0)); y = 0
for kind, imgs in rows_out:
    x = 0; tab[kind] = []
    for im in imgs:
        out.paste(im, (x, y)); tab[kind].append([x, y, im.width, im.height]); x += im.width + 2
    y += max(i.height for i in imgs) + 2
out.save(os.path.join(ART, 'guardian_poses.png'), optimize=True)
print(json.dumps(tab))
