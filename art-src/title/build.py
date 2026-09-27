"""Builds the title-screen vista (Gemini art) and embeds it in math-quest.html
as ATLAS_SRC.title_bg. The game draws it full screen behind the menus with a
slow push-in (see draw(): 'the painted intro vista').
Put the image at art-src/title_raw.jpg (or .png), then run:
  python3 art-src/title/build.py"""
import base64, io, os, re
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..')
raw = next(p for p in (os.path.join(HERE, '..', 'title_raw.' + e) for e in ('jpg', 'jpeg', 'png', 'webp')) if os.path.exists(p))
im = Image.open(raw).convert('RGB')
W, H = 1280, 720  # 16:9, 2x the 640x360 game screen
s = max(W / im.width, H / im.height)  # cover, then centre-crop to 16:9
im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
l, t = (im.width - W) // 2, (im.height - H) // 2
im = im.crop((l, t, l + W, t + H))
im.save(os.path.join(HERE, '..', 'title_bg.jpg'), quality=86)
buf = io.BytesIO(); im.save(buf, 'JPEG', quality=86)
line = '  title_bg: "data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode() + '",\n'
p = os.environ.get('MQ_FILE') or os.path.join(ROOT, 'math-quest.html'); src = open(p, encoding='utf-8').read()
if re.search(r'^  title_bg: "data:', src, re.M): src = re.sub(r'^  title_bg: "data:[^"]*",\n', lambda m: line, src, count=1, flags=re.M)
else: src = src.replace('  mirage_hall: "data:', line + '  mirage_hall: "data:', 1)
open(p, 'w', encoding='utf-8').write(src)
print('embedded title_bg', W, 'x', H, len(line) // 1024, 'KB')
