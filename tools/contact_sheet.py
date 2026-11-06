import sys, os
from PIL import Image
files = sys.argv[2:]
scale = 5
imgs = [Image.open(f).convert('RGBA') for f in files]
w = sum(i.width for i in imgs) * scale + 10 * (len(imgs) + 1)
h = max(i.height for i in imgs) * scale + 20
sheet = Image.new('RGBA', (w, h), (155, 188, 15, 255))
x = 10
for i in imgs:
    sheet.paste(i.resize((i.width * scale, i.height * scale), Image.NEAREST), (x, 10), i.resize((i.width * scale, i.height * scale), Image.NEAREST))
    x += i.width * scale + 10
sheet.save(sys.argv[1])
