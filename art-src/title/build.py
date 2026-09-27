"""Builds the animated title screen from the Gemini vista (art-src/title_raw.jpg)
and embeds it in math-quest.html:
  - ATLAS_SRC.title_bg  : the vista with the hero's cape and hair painted out
                          (a clean plate, JPEG)
  - ATLAS_SRC.title_fx  : the cape and the hair as transparent cut-outs (PNG)
  - const TITLE_FX      : where the cut-outs sit on the vista and where the
                          animated bits live (grass, castle windows, lake,
                          bird flock), in vista pixels
The game draws the plate, then the cape rippling and the hair stirring on
top, sways the cliff grass and adds petals, fireflies, birds, window glow
and lake glints (see drawTitleVista in math-quest.html).
Run: python3 art-src/title/build.py   (MQ_FILE=... to embed into a copy)"""
import base64, io, json, os, re
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..')
raw = next(p for p in (os.path.join(HERE, '..', 'title_raw.' + e) for e in ('jpg', 'jpeg', 'png', 'webp')) if os.path.exists(p))
src = Image.open(raw).convert('RGB')
im = np.asarray(src).astype(float)
H, W, _ = im.shape
r, g, b = im[..., 0], im[..., 1], im[..., 2]
mx, mn = im.max(-1), im.min(-1)
v = mx / 255
s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
d = np.maximum(mx - mn, 1e-6)
hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60

# where things are on the 1024x572 vista (scaled if the art is another size)
K = W / 1024.0
def R(x0, y0, x1, y1): return [round(x0 * K), round(y0 * K), round(x1 * K), round(y1 * K)]
CAPE, HAIR = R(751, 346, 878, 399), R(735, 288, 816, 360)
GRASS = R(600, 405, 1024, 572)          # the cliff-top grass that sways
HERO = R(735, 285, 830, 490)            # (kept still inside the grass sway)
ROCK = R(922, 392, 1024, 458)           # the mossy rock right of the hero (kept still too)
WINDOWS = [[round(x * K), round(y * K)] for x, y in [(836, 150), (852, 128), (872, 160), (896, 140), (913, 170), (860, 188)]]
LAKE = R(470, 300, 700, 335)
BIRDS = R(470, 140, 760, 200)

def box(bb):
    m = np.zeros((H, W), bool); m[bb[1]:bb[3], bb[0]:bb[2]] = True; return m
def shift(m, dx, dy):
    o = np.zeros_like(m)
    o[max(0, dy):H + min(0, dy), max(0, dx):W + min(0, dx)] = m[max(0, -dy):H + min(0, -dy), max(0, -dx):W + min(0, -dx)]
    return o
def dilate(m, n=1):
    for _ in range(n): m = m | shift(m, 1, 0) | shift(m, -1, 0) | shift(m, 0, 1) | shift(m, 0, -1)
    return m
def erode(m, n=1): return ~dilate(~m, n)
def largest(m):  # keep the biggest 4-connected blob
    lab = np.zeros(m.shape, int); best, bn, n = 0, 0, 0
    ys, xs = np.nonzero(m)
    for y0, x0 in zip(ys, xs):
        if lab[y0, x0]: continue
        n += 1; st = [(y0, x0)]; lab[y0, x0] = n; c = 0
        while st:
            y, x = st.pop(); c += 1
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < H and 0 <= xx < W and m[yy, xx] and not lab[yy, xx]: lab[yy, xx] = n; st.append((yy, xx))
        if c > bn: bn, best = c, n
    return lab == best

green = (hue > 60) & (hue < 220) & (s > 0.15) & (v > 0.1)
# the cape: everything warm (tan to dark brown) in its box, plus its dark outline
hairish = ((hue < 28) | (hue > 340)) & (s > 0.45) | (hue < 45) & (s > 0.6) & (v > 0.55)  # red hair + its sunlit strands
warm = box(CAPE) & ~green & (hue > 12) & (hue < 60) & (s > 0.2) & ~(box(HAIR) & hairish)
warm = largest(erode(dilate(warm, 1), 1))
cape = warm | (dilate(warm, 3) & box(CAPE) & ~green & (v < 0.33))  # + its dark folds and outline (only near it)
cape = erode(dilate(cape, 1), 1) & box(CAPE)
# the hair: saturated red-orange, holes closed
hair = box(HAIR) & hairish & (v > 0.3)
hair = largest(erode(dilate(hair, 2), 2)) & box(HAIR) & ~green
hair = hair | (dilate(hair, 1) & (v < 0.2) & box(HAIR))  # its outline
cut = cape | hair

# clean plate: behind the cut-outs use the hero-free vista if there is one
# (art-src/title_plate_raw.jpg, the same picture without the hero), else
# paint them away by diffusing the colours around them in
plate = im.copy(); known = ~dilate(cut, 1)
alt = next((q for q in (os.path.join(HERE, '..', 'title_plate_raw.' + e) for e in ('jpg', 'jpeg', 'png', 'webp')) if os.path.exists(q)), None)
if alt:
    ap = np.asarray(Image.open(alt).convert('RGB').resize((W, H), Image.LANCZOS)).astype(float)
    hole = dilate(cut, 1); plate[hole] = ap[hole]; known = known | hole
for _ in range(400):
    if known.all(): break
    acc = np.zeros_like(plate); cnt = np.zeros((H, W))
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        k = shift(known, dx, dy); acc += shift(plate * known[..., None], dx, dy); cnt += k
    fill = ~known & (cnt > 0)
    plate[fill] = acc[fill] / cnt[fill][:, None]; known = known | fill

def cutout(mask, bb):
    x0, y0, x1, y1 = bb
    rgba = np.zeros((y1 - y0, x1 - x0, 4), 'uint8')
    rgba[..., :3] = im[y0:y1, x0:x1].astype('uint8'); rgba[..., 3] = mask[y0:y1, x0:x1] * 255
    return Image.fromarray(rgba)
capeI, hairI = cutout(cape, CAPE), cutout(hair, HAIR)
# flapping birds (art-src/title_birds_raw.jpg: 4 frames in a row on magenta),
# keyed, shrunk to 1/4 and anchored at the beak so the flap doesn't wobble
birds = []
braw = os.path.join(HERE, '..', 'title_birds_raw.jpg')
if os.path.exists(braw):
    bi = np.asarray(Image.open(braw).convert('RGB')).astype(int)
    br, bg_, bb = bi[..., 0], bi[..., 1], bi[..., 2]
    bmag = (br - bg_ > 60) & (bb - bg_ > 60)
    bfg = ~bmag; bfg[:30] = False; bfg[-30:] = False
    cols = np.where(bfg.any(0))[0]; runs = []; st = pv = cols[0]
    for c in cols[1:]:
        if c - pv > 6: runs.append((st, pv)); st = c
        pv = c
    runs.append((st, pv))
    for x0, x1 in runs[:4]:
        ys = np.where(bfg[:, x0:x1 + 1].any(1))[0]; y0, y1 = ys[0], ys[-1]
        beak = np.where(bfg[:, x1 - 2:x1 + 1].any(1))[0].mean()
        rgba = np.zeros((y1 - y0 + 1, x1 - x0 + 1, 4), 'uint8')
        rgba[..., :3] = bi[y0:y1 + 1, x0:x1 + 1]; rgba[..., 3] = bfg[y0:y1 + 1, x0:x1 + 1] * 255
        fr = Image.fromarray(rgba); q = 4
        fr = fr.resize((max(1, fr.width // q), max(1, fr.height // q)), Image.LANCZOS)
        birds.append((fr, (x1 - x0) / q, (beak - y0) / q))
bw = sum(f.width + 2 for f, _, _ in birds)
sheet = Image.new('RGBA', (capeI.width + hairI.width + 4 + bw, max([capeI.height, hairI.height] + [f.height for f, _, _ in birds])), (0, 0, 0, 0))
sheet.paste(capeI, (0, 0)); sheet.paste(hairI, (capeI.width + 2, 0))
birdFx, bx = [], capeI.width + hairI.width + 4
for f, ax, ay in birds:
    sheet.paste(f, (bx, 0)); birdFx.append({'sx': bx, 'sy': 0, 'w': f.width, 'h': f.height, 'ax': round(ax, 1), 'ay': round(ay, 1)}); bx += f.width + 2

def data_url(img, fmt, **kw):
    buf = io.BytesIO(); img.save(buf, fmt, **kw)
    return 'data:image/' + fmt.lower() + ';base64,' + base64.b64encode(buf.getvalue()).decode()
plateI = Image.fromarray(np.clip(plate, 0, 255).astype('uint8'))
plateI.save(os.path.join(HERE, '..', 'title_bg.jpg'), quality=90)
sheet.save(os.path.join(HERE, '..', 'title_fx.png'))
fx = {'w': W, 'h': H,
      'cape': {'sx': 0, 'sy': 0, 'w': capeI.width, 'h': capeI.height, 'x': CAPE[0], 'y': CAPE[1]},
      'hair': {'sx': capeI.width + 2, 'sy': 0, 'w': hairI.width, 'h': hairI.height, 'x': HAIR[0], 'y': HAIR[1]},
      'grass': GRASS, 'still': [HERO, ROCK], 'windows': WINDOWS, 'lake': LAKE, 'birds': BIRDS, 'birdFrames': birdFx}

p = os.environ.get('MQ_FILE') or os.path.join(ROOT, 'math-quest.html')
html = open(p, encoding='utf-8').read()
def put(key, url):
    global html
    line = '  ' + key + ': "' + url + '",\n'
    if re.search(r'^  ' + key + r': "data:', html, re.M): html = re.sub(r'^  ' + key + r': "data:[^"]*",\n', lambda m: line, html, count=1, flags=re.M)
    else: html = html.replace('  mirage_hall: "data:', line + '  mirage_hall: "data:', 1)
put('title_bg', data_url(plateI, 'JPEG', quality=90))
put('title_fx', data_url(sheet, 'PNG', optimize=True))
line = 'const TITLE_FX = ' + json.dumps(fx, separators=(',', ':')) + '; // (art-src/title/build.py)\n'
if re.search(r'^const TITLE_FX = ', html, re.M): html = re.sub(r'^const TITLE_FX = .*\n', lambda m: line, html, count=1, flags=re.M)
else: html = html.replace('function imgReady(key) {', line + 'function imgReady(key) {', 1)
open(p, 'w', encoding='utf-8').write(html)
print('title vista', W, 'x', H, '- cape', int(cape.sum()), 'px, hair', int(hair.sum()), 'px')
