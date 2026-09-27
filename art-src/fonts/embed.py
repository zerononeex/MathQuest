"""Embeds the title-screen fonts in math-quest.html as @font-face data URLs
(the game is one offline file): Cinzel Decorative (the logo) and Cinzel
(buttons and text), bold. Both SIL OFL 1.1, from the @fontsource npm
packages; licences next to this file.
Run: python3 art-src/fonts/embed.py"""
import base64, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(HERE, '..', '..', 'math-quest.html')
FACES = [('Cinzel Decorative', 700, 'cinzel-decorative-latin-700-normal.woff2'),
         ('Cinzel', 700, 'cinzel-latin-700-normal.woff2')]
css = '/* title fonts (art-src/fonts/embed.py; SIL OFL 1.1) */\n' + ''.join(
    "@font-face { font-family: '%s'; font-weight: %d; font-style: normal; font-display: block; src: url(data:font/woff2;base64,%s) format('woff2'); }\n"
    % (fam, w, base64.b64encode(open(os.path.join(HERE, f), 'rb').read()).decode()) for fam, w, f in FACES) + '/* end title fonts */\n'
html = open(p, encoding='utf-8').read()
if '/* title fonts' in html: html = re.sub(r'/\* title fonts.*?/\* end title fonts \*/\n', lambda m: css, html, count=1, flags=re.S)
else: html = html.replace('<style>\n', '<style>\n' + css, 1)
open(p, 'w', encoding='utf-8').write(html)
print('embedded', len(FACES), 'font faces')
