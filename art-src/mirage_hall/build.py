"""Builds art-src/mirage_hall.jpg: the Mirage Keep grand hall floor (Gemini
art) fitted to the 24x14-tile hall at 2x (768x448), drawn over the whole
room. Prints nothing; embed with the snippet in the session notes.
Run: python3 art-src/mirage_hall/build.py"""
import os
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(HERE, '..', 'mirage_hall_raw.jpg')).convert('RGB')
im.resize((768, 448), Image.LANCZOS).save(os.path.join(HERE, '..', 'mirage_hall.jpg'), quality=90)
