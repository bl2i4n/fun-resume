"""
Hand-authored pixel sprites as text grids.

Each sprite module calls render(name, GRID, PALETTE):
  GRID    : multi-line string, one character per pixel. '.' = transparent.
            Every row must have the same width.
  PALETTE : {char: '#rrggbb'}
Writes public/sprites/<name>.png at 1x and a nearest-neighbor 8x preview
(on a light checker) to tools/previews/<name>.png for eyeballing.
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, '..', 'public', 'sprites')
PREV = os.path.join(ROOT, 'previews')


def _rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def render(name, grid, palette, scale=8):
    rows = [r for r in grid.strip('\n').split('\n')]
    rows = [r.rstrip() for r in rows]
    w = max(len(r) for r in rows)
    bad = [i for i, r in enumerate(rows) if len(r) != w]
    if bad:
        # pad short rows with transparency but warn so the author can fix them
        print(f'[{name}] warning: rows {bad} shorter than {w}; padded', file=sys.stderr)
        rows = [r.ljust(w, '.') for r in rows]
    h = len(rows)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    px = im.load()
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in '. ':
                continue
            if ch not in palette:
                raise SystemExit(f'[{name}] unknown char {ch!r} at ({x},{y})')
            px[x, y] = _rgb(palette[ch]) + (255,)
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(PREV, exist_ok=True)
    im.save(os.path.join(OUT, f'{name}.png'))
    big = im.resize((w * scale, h * scale), Image.NEAREST)
    bg = Image.new('RGBA', big.size, (232, 240, 216, 255))
    bg.alpha_composite(big)
    bg.save(os.path.join(PREV, f'{name}.png'))
    print(f'[{name}] {w}x{h} -> public/sprites/{name}.png, preview tools/previews/{name}.png')
    return im
