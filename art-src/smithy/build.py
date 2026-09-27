"""Builds art-src/smithy_building.png (Brannoc's smithy, Gemini art on
magenta): background keyed from the border, cropped, box-downscaled to
166px wide (drawn at 83 game px, 2x for crisp retina). Prints its draw size
and where its door sits (fractions), for SMITHY_ART.
Run: python3 art-src/smithy/build.py"""
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
A = np.array(Image.open(os.path.join(HERE, '..', 'smithy_building_raw.jpg')).convert('RGB')).astype(float)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
K = ((r > 150) & (b > 150) & (g < 130) & (np.abs(r - b) < 90)) | ((r > g + 70) & (b > g + 70))
reach = np.zeros_like(K); reach[0, :] = K[0, :]; reach[-1, :] = K[-1, :]; reach[:, 0] = K[:, 0]; reach[:, -1] = K[:, -1]
while True:
    gr = reach.copy(); gr[1:] |= reach[:-1]; gr[:-1] |= reach[1:]; gr[:, 1:] |= reach[:, :-1]; gr[:, :-1] |= reach[:, 1:]
    gr &= K
    if (gr == reach).all(): break
    reach = gr
al = ~(reach | ((r > 200) & (b > 200) & (g < 110)))  # (+ magenta trapped inside the sign bracket)
ys, xs = np.where(al.sum(1) > 2)[0], np.where(al.sum(0) > 2)[0]
C = A[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]; al = al[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]
W = 166; H = round(W * al.shape[0] / al.shape[1])  # (drawn at 83 game px: its walls ~ the other houses')
im = np.array(Image.fromarray(np.dstack([C * al[..., None], al * 255.0]).astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
a = im[..., 3]
im[..., :3] = np.where(a[..., None] > 0, im[..., :3] * 255.0 / np.maximum(a[..., None], 1), 0)
im[..., 3] = np.where(a > 110, 255, 0)
for _ in range(2): # magenta-tinted rim pixels
    op = im[..., 3] > 0
    edge = op & ~(np.roll(op, 1, 0) & np.roll(op, -1, 0) & np.roll(op, 1, 1) & np.roll(op, -1, 1))
    im[..., 3][edge & (im[..., 0] > im[..., 1] + 60) & (im[..., 2] > im[..., 1] + 60)] = 0
Image.fromarray(np.clip(im, 0, 255).astype(np.uint8), 'RGBA').save(os.path.join(HERE, '..', 'smithy_building.png'), optimize=True)
DOOR = (512, 700) # door centre / bottom in the raw sheet
print(json.dumps({'w': W // 2, 'h': H / 2, 'doorX': round((DOOR[0] - xs[0]) / (xs[-1] - xs[0]), 3), 'doorY': round((DOOR[1] - ys[0]) / (ys[-1] - ys[0]), 3)}))
