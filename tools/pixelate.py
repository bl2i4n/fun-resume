"""Turn a photo into a 4-shade Game Boy sprite.

usage: pixelate.py <in.jpg> <out.png> [--size 56] [--crop l,t,r,b] [--dither] [--levels a,b,c]
The dark background (connected to the image border) becomes transparent and the
silhouette gets a 1px darkest outline, like a Gen 1 sprite.
"""
import sys, argparse
from PIL import Image, ImageOps, ImageEnhance

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--size', type=int, default=56)
ap.add_argument('--crop', default=None, help='fractions l,t,r,b of the source')
ap.add_argument('--dither', action='store_true')
ap.add_argument('--levels', default='0.30,0.55,0.80', help='luminance thresholds between shades')
ap.add_argument('--contrast', type=float, default=1.3)
ap.add_argument('--bg', type=int, default=38, help='luminance below which border-connected pixels are background')
a = ap.parse_args()

PAL = [(155, 188, 15, 255), (139, 172, 15, 255), (48, 98, 48, 255), (15, 56, 15, 255)]

im = Image.open(a.src).convert('RGB')
if a.crop:
    l, t, r, b = [float(v) for v in a.crop.split(',')]
    W, H = im.size
    im = im.crop((int(l * W), int(t * H), int(r * W), int(b * H)))
im = ImageOps.fit(im, (a.size, a.size), Image.LANCZOS)
g = ImageOps.grayscale(im)
g = ImageOps.autocontrast(g, cutoff=1)
g = ImageEnhance.Contrast(g).enhance(a.contrast)

# background: flood from the border over dark pixels
w, h = g.size
bg = [[False] * w for _ in range(h)]
stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
while stack:
    x, y = stack.pop()
    if x < 0 or y < 0 or x >= w or y >= h or bg[y][x]:
        continue
    if g.getpixel((x, y)) > a.bg:
        continue
    bg[y][x] = True
    stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

th = [float(v) * 255 for v in a.levels.split(',')]
bayer = [[0, 2], [3, 1]]  # 2x2 ordered dither
out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
shade = [[None] * w for _ in range(h)]
for y in range(h):
    for x in range(w):
        if bg[y][x]:
            continue
        v = g.getpixel((x, y))
        if a.dither:
            v += (bayer[y % 2][x % 2] - 1.5) * 18
        s = 3 if v < th[0] else 2 if v < th[1] else 1 if v < th[2] else 0
        shade[y][x] = s
# outline: any foreground pixel touching background becomes darkest
for y in range(h):
    for x in range(w):
        if shade[y][x] is None:
            continue
        edge = False
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and shade[ny][nx] is None:
                edge = True
        out.putpixel((x, y), PAL[3] if edge else PAL[shade[y][x]])
out.save(a.dst)
print('wrote', a.dst, out.size)
