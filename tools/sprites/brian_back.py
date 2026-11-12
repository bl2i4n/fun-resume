"""Brian, 3/4 back view (64x64, waist-up, battle player sprite).

Over-the-shoulder pose facing up-right toward the opponent: curly dark hair,
right ear, cheek, jaw and a glimpse of eye/nose in profile; orange hoodie with
the hood bunched on the upper back; bag strap running down to a left-hip bag.
Built from shapes, then outlined per material and emitted as a text grid.
"""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from pixelgrid import render

W = H = 64
CHARS = '.hdHDSsKkoOgGbBNw'           # index in this string = palette index on the canvas
IDX = {c: i for i, c in enumerate(CHARS)}

img = Image.new('P', (W, H), 0)
d = ImageDraw.Draw(img)
ell = lambda box, c: d.ellipse(box, fill=IDX[c])
poly = lambda pts, c: d.polygon(pts, fill=IDX[c])
line = lambda pts, c, w=1: d.line(pts, fill=IDX[c], width=w)
rect = lambda box, c: d.rectangle(box, fill=IDX[c])
def px(x, y, c):
    if 0 <= x < W and 0 <= y < H:
        img.putpixel((x, y), IDX[c])

# ---- torso: hoodie, turned so the right shoulder (screen right) sits a bit higher and narrower
poly([(3, 64), (5, 48), (10, 40), (20, 35), (32, 33), (44, 33), (53, 36), (59, 43), (61, 52), (62, 64)], 'o')
# light from upper-left: highlight the near shoulder, shade the far side
poly([(6, 50), (10, 41), (18, 37), (14, 44), (10, 52)], 'O')
poly([(55, 40), (59, 44), (61, 52), (62, 64), (56, 64), (55, 50)], 'g')
# arm seams
line([(14, 41), (12, 50), (11, 64)], 'g')
line([(53, 38), (54, 48), (55, 64)], 'g')
# hood bunched on the upper back
ell((17, 29, 47, 43), 'o')
d.arc((17, 29, 47, 43), 20, 160, fill=IDX['g'])
d.arc((21, 31, 43, 40), 200, 340, fill=IDX['O'])
line([(26, 41), (38, 41)], 'g')

# ---- neck
rect((31, 24, 41, 33), 's')
rect((36, 24, 41, 31), 'S')

# ---- head: skin first, hair over the back and top, leaving the right cheek/jaw visible
ell((27, 7, 50, 31), 'S')
ell((18, 3, 41, 28), 'h')
# hair tufts along the crown so the silhouette reads curly
for (x, y) in [(23, 2), (28, 1), (33, 1), (38, 3), (42, 6), (19, 6)]:
    ell((x - 2, y, x + 2, y + 3), 'h')
ell((36, 4, 47, 12), 'h')  # front of the hair, over the forehead
# sideburn/hairline running down in front of the ear
poly([(38, 10), (42, 11), (41, 16), (38, 16)], 'h')
# ear
ell((34, 14, 40, 23), 'K')
px(36, 17, 's'); px(36, 18, 's'); px(37, 19, 's'); px(36, 20, 's')
# profile hints: brow, eye, nose tip, cheek blush
line([(45, 13), (48, 13)], 'h')
px(47, 15, 'D'); px(47, 16, 'D'); px(46, 16, 'D')
px(50, 18, 'S'); px(50, 19, 'S'); px(51, 19, 'S')
px(44, 21, 'K'); px(45, 21, 'K'); px(46, 21, 'K')
line([(47, 24), (49, 24)], 's')  # mouth corner
# jaw shading where it meets the neck
line([(38, 28), (45, 28)], 's')

# ---- bag strap over the right shoulder, down to the left hip
line([(51, 35), (12, 58)], 'b', 3)
line([(52, 37), (13, 60)], 'B')
# ---- bag (left hip, cropped by the text box)
rect((0, 54, 12, 63), 'b')
rect((0, 54, 12, 56), 'B')
rect((4, 59, 5, 59), 'w')

# ---- per-material outlines
grid = [[CHARS[img.getpixel((x, y))] for x in range(W)] for y in range(H)]
OUTLINE = {'h': 'D', 'd': 'D', 'H': 'D', 'S': 'k', 's': 'k', 'K': 'k', 'o': 'G', 'O': 'G', 'g': 'G', 'b': 'N', 'B': 'N', 'w': 'N'}
MATERIAL = {'h': 'hair', 'd': 'hair', 'H': 'hair', 'D': 'hair', 'S': 'skin', 's': 'skin', 'K': 'skin', 'k': 'skin',
            'o': 'cloth', 'O': 'cloth', 'g': 'cloth', 'G': 'cloth', 'b': 'bag', 'B': 'bag', 'w': 'bag', 'N': 'bag'}
src = [row[:] for row in grid]
for y in range(H):
    for x in range(W):
        c = src[y][x]
        if c == '.' or c not in OUTLINE:
            continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if not (0 <= nx < W and 0 <= ny < H):
                continue  # canvas edge (bottom crop) gets no outline
            n = src[ny][nx]
            # outline against empty space; skin also gets a line where it meets hair or cloth
            if n == '.' or (MATERIAL[c] == 'skin' and MATERIAL.get(n) in ('hair', 'cloth')) \
                    or (MATERIAL[c] == 'cloth' and MATERIAL.get(n) == 'skin' and dy == -1):
                grid[y][x] = OUTLINE[c]
                break

# curly hair texture and a rim highlight, applied after outlining so the edge stays clean
CURLS = [(24, 5), (29, 4), (34, 5), (39, 7), (43, 8), (21, 10), (26, 9), (31, 10), (35, 12), (23, 15), (28, 14),
         (32, 17), (20, 19), (25, 20), (30, 22), (34, 24), (22, 24), (27, 26)]
for (x, y) in CURLS:
    if grid[y][x] == 'h':
        grid[y][x] = 'd'
        if grid[y + 1][x + 1] == 'h':
            grid[y + 1][x + 1] = 'd'
        if grid[y - 1][x - 1] == 'h':
            grid[y - 1][x - 1] = 'H'
for (x, y) in [(23, 5), (21, 8), (20, 12), (27, 3), (32, 3)]:
    if grid[y][x] == 'h':
        grid[y][x] = 'H'

GRID = '\n'.join(''.join(r) for r in grid)

PALETTE = {
    'B': '#30323e',
    'D': '#140c10',
    'G': '#6a2a10',
    'H': '#5a4450',
    'K': '#eebc94',
    'N': '#16203a',
    'O': '#ffc060',
    'S': '#cf9466',
    'b': '#4a4e5e',
    'd': '#24181e',
    'g': '#c85e1a',
    'h': '#3a2a32',
    'k': '#5e3220',
    'o': '#f58c2a',
    's': '#a8693f',
    'w': '#d4dce8',
}

if __name__ == '__main__':
    render('brian_back', GRID, PALETTE)
