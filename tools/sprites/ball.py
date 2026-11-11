"""HIRE BALL: an original capture ball styled like a little briefcase/offer.
Navy top shell, gold latch clasp on a dark seam, white bottom shell."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from pixelgrid import render

GRID = """
................
.....OOOOOO.....
...OOHHNNNNOO...
..OHhHNNNNNNnO..
..OhHNNNNNNNnO..
.ONHNNNNNNNNnnO.
.ONNNDDDDDDnnnO.
.OsssDYYGGDsssO.
.OWWWDGDDyDwwgO.
.OWWWDDDDDDwwgO.
.OWWWWWWWWwwwgO.
..oWWWWWWwwwgo..
..owWWWwwwwggo..
...oowwwgggoo...
.....oooooo.....
................
"""

PALETTE = {
    'O': '#141c4a',  # navy outline
    'H': '#4f6fd0',  # navy highlight
    'h': '#c8d8ff',  # specular
    'N': '#2a4498',  # navy base
    'n': '#1c2f72',  # navy shadow
    's': '#0e1434',  # seam
    'D': '#6a3c0c',  # gold outline
    'Y': '#fff2a0',  # gold highlight
    'G': '#f0c030',  # gold base
    'y': '#b87a18',  # gold shadow
    'W': '#fafafa',  # white
    'w': '#d8dce8',  # white shade
    'g': '#a4aac0',  # white shadow
    'o': '#4a5070',  # bottom outline
}

render('ball', GRID, PALETTE)
