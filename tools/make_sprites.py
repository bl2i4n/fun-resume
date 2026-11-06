"""Generate the 4-shade Game Boy sprites for the resume game.

Every sprite is drawn with primitives on a small canvas, then an outline is
computed from the shape mask so merged shapes get one clean 1px edge.
Output goes to public/sprites/*.png as RGBA (shade 0 = transparent).
"""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sprites')
os.makedirs(OUT, exist_ok=True)

# DMG palette: 0 lightest (transparent in sprites), 1 light, 2 dark, 3 darkest
PAL = [(155, 188, 15, 0), (139, 172, 15, 255), (48, 98, 48, 255), (15, 56, 15, 255)]
# For sprites we want "white" areas to be the screen background, so shade 0 is
# transparent and we draw body fill in shade 0 opaque (= screen light color).
BG = (155, 188, 15, 255)


class Sprite:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.img = Image.new('P', (w, h), 255)  # 255 = empty/transparent
        self.d = ImageDraw.Draw(self.img)

    # shape helpers: shade 0..3, or 255 for transparent
    def ellipse(self, box, shade):
        self.d.ellipse(box, fill=shade)

    def rect(self, box, shade):
        self.d.rectangle(box, fill=shade)

    def poly(self, pts, shade):
        self.d.polygon(pts, fill=shade)

    def line(self, pts, shade, width=1):
        self.d.line(pts, fill=shade, width=width)

    def px(self, x, y, shade):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.img.putpixel((x, y), shade)

    def outline(self, shade=3):
        """Draw a 1px outline (in `shade`) around every non-transparent pixel."""
        src = self.img.copy()
        for y in range(self.h):
            for x in range(self.w):
                if src.getpixel((x, y)) == 255:
                    continue
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if nx < 0 or ny < 0 or nx >= self.w or ny >= self.h or src.getpixel((nx, ny)) == 255:
                        self.img.putpixel((x, y), shade)
                        break

    def save(self, name, scale=1):
        rgba = Image.new('RGBA', (self.w, self.h), (0, 0, 0, 0))
        for y in range(self.h):
            for x in range(self.w):
                v = self.img.getpixel((x, y))
                if v == 255:
                    continue
                rgba.putpixel((x, y), BG if v == 0 else PAL[v])
        if scale != 1:
            rgba = rgba.resize((self.w * scale, self.h * scale), Image.NEAREST)
        rgba.save(os.path.join(OUT, name))
        print('wrote', name, rgba.size)


# ---------------------------------------------------------------- LINKACHU
def linkachu():
    s = Sprite(56, 56)
    # ears (drawn first so head overlaps their base)
    s.poly([(13, 20), (24, 17), (8, 1)], 0)      # left ear
    s.poly([(32, 17), (43, 20), (49, 1)], 0)     # right ear
    # ear tips (dark)
    s.poly([(8, 1), (10, 9), (16, 8)], 3)
    s.poly([(49, 1), (47, 9), (41, 8)], 3)
    # head + body as one chubby blob
    s.ellipse((11, 13, 45, 41), 0)
    s.ellipse((13, 30, 43, 53), 0)
    # arms
    s.ellipse((10, 36, 18, 44), 0)
    s.ellipse((38, 36, 46, 44), 0)
    # feet
    s.ellipse((16, 48, 27, 55), 0)
    s.ellipse((29, 48, 40, 55), 0)
    # tail: lightning bolt from the right hip up to a briefcase
    s.poly([(42, 44), (50, 36), (46, 36), (54, 26), (49, 27), (53, 19), (48, 21), (48, 29), (52, 29), (46, 38), (49, 38)], 1)
    # briefcase at the tail tip
    s.rect((45, 12, 55, 19), 2)
    s.rect((48, 10, 52, 12), 2)
    s.rect((49, 11, 51, 11), 0)
    s.rect((46, 13, 54, 18), 0)
    s.rect((46, 15, 54, 15), 2)
    s.outline(3)
    # --- details on top of the outlined body ---
    # eyes
    s.ellipse((18, 23, 22, 27), 3)
    s.ellipse((33, 23, 37, 27), 3)
    s.px(19, 24, 0)
    s.px(34, 24, 0)
    # nose + mouth
    s.rect((27, 29, 28, 29), 3)
    s.line([(23, 32), (26, 34), (28, 32), (30, 34), (33, 32)], 3)
    # cheeks: LinkedIn "in" badges
    for cx in (13, 42):
        s.ellipse((cx - 5, 27, cx + 5, 37), 2)
        # "i"
        s.px(cx - 2, 29, 0)
        s.rect((cx - 2, 31, cx - 2, 34), 0)
        # "n"
        s.rect((cx, 31, cx, 34), 0)
        s.px(cx + 1, 31, 0)
        s.rect((cx + 2, 32, cx + 2, 34), 0)
    # tie
    s.rect((27, 41, 29, 42), 3)
    s.poly([(26, 43), (30, 43), (29, 50), (27, 50)], 2)
    # ear inner shading
    s.poly([(14, 18), (20, 17), (12, 6)], 1)
    s.poly([(36, 17), (42, 18), (45, 6)], 1)
    s.save('linkachu.png')


# ---------------------------------------------------------------- BRIAN (back, 28px drawn, shown 2x)
def brian_back():
    s = Sprite(28, 28)
    # shoulders / torso
    s.ellipse((2, 15, 25, 34), 1)
    s.rect((2, 22, 25, 27), 1)
    # neck
    s.rect((11, 12, 16, 16), 0)
    # head (back of head is mostly hair)
    s.ellipse((7, 1, 20, 14), 0)
    s.outline(3)
    # hair: short dark hair, covers most of the back of the head
    s.ellipse((8, 2, 19, 12), 3)
    s.rect((8, 6, 19, 11), 3)
    # hair edge highlight
    s.line([(9, 4), (12, 2)], 2)
    # shirt collar seam
    s.line([(13, 17), (13, 27)], 2)
    s.save('brian_back.png', scale=2)


# ---------------------------------------------------------------- BRIAN (front, title screen / intro)
def brian_front():
    s = Sprite(32, 40)
    # body
    s.rect((9, 20, 22, 33), 1)
    s.rect((6, 21, 9, 30), 1)   # arms
    s.rect((22, 21, 25, 30), 1)
    s.rect((10, 33, 14, 38), 2)  # legs
    s.rect((17, 33, 21, 38), 2)
    # head
    s.ellipse((8, 2, 23, 19), 0)
    s.outline(3)
    # hair
    s.ellipse((8, 1, 23, 10), 3)
    s.rect((8, 6, 23, 8), 3)
    s.rect((8, 8, 10, 11), 3)
    s.rect((21, 8, 23, 11), 3)
    # face
    s.px(12, 12, 3)
    s.px(19, 12, 3)
    s.line([(13, 15), (15, 16), (18, 15)], 3)  # smile
    # shirt neckline
    s.rect((14, 20, 17, 21), 0)
    s.save('brian_front.png')


# ---------------------------------------------------------------- HIRE BALL
def ball():
    s = Sprite(16, 16)
    s.ellipse((1, 1, 14, 14), 0)
    s.outline(3)
    # top half dark
    for y in range(2, 7):
        for x in range(2, 14):
            if s.img.getpixel((x, y)) == 0:
                s.px(x, y, 2)
    # band
    s.rect((2, 7, 13, 7), 3)
    # button
    s.ellipse((5, 5, 10, 10), 3)
    s.ellipse((6, 6, 9, 9), 0)
    s.save('ball.png')


# ---------------------------------------------------------------- GIANT HAND (kept for the bug gag later)
def hand():
    s = Sprite(32, 32)
    s.rect((6, 10, 26, 30), 0)
    for i, x in enumerate((7, 12, 17, 22)):
        s.rect((x, 2 + (2 if i in (0, 3) else 0), x + 3, 12), 0)
    s.outline(3)
    s.save('hand.png')


# ---------------------------------------------------------------- PROFESSOR (fallback, hand drawn)
def prof_fallback():
    s = Sprite(56, 56)
    # lab coat
    s.poly([(10, 55), (14, 34), (24, 30), (32, 30), (42, 34), (46, 55)], 0)
    # head
    s.ellipse((17, 6, 39, 32), 0)
    s.outline(3)
    # curly dark hair: a cluster of circles around the top of the head
    for (x, y) in ((17, 6), (22, 3), (28, 2), (34, 3), (39, 6), (15, 12), (41, 12)):
        s.ellipse((x - 3, y - 2, x + 4, y + 5), 3)
    s.rect((18, 7, 38, 12), 3)
    # eyes, brows, mouth
    s.rect((22, 17, 24, 18), 3)
    s.rect((32, 17, 34, 18), 3)
    s.line([(21, 15), (25, 15)], 3)
    s.line([(31, 15), (35, 15)], 3)
    s.line([(24, 25), (28, 27), (32, 25)], 3)
    # coat lapels + shirt
    s.line([(28, 30), (22, 55)], 2)
    s.line([(28, 30), (34, 55)], 2)
    s.rect((27, 31, 29, 40), 2)
    s.save('prof_fallback.png')  # prof.png is the pixelated photo, see tools/pixelate.py


if __name__ == '__main__':
    linkachu()
    brian_back()
    brian_front()
    ball()
    hand()
    prof_fallback()
