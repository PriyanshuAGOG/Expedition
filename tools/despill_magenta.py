#!/usr/bin/env python3
"""Remove residual magenta contamination from chroma-keyed photographic edges."""

from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image


def clean(path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue

            spill = min(red, blue) - green
            if spill <= 10:
                continue

            # Magenta key light raises red and blue together. Real sunrise rim
            # light remains intact because it is red/gold without a blue lift.
            amount = min(1.0, (spill - 10) / 110.0)
            cap = green + 6
            red = round(red + (min(red, cap) - red) * amount)
            blue = round(blue + (min(blue, cap) - blue) * amount)
            alpha = round(alpha * (1.0 - 0.9 * amount))
            pixels[x, y] = (red, green, blue, alpha)

    image.save(path, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="+", type=Path)
    args = parser.parse_args()
    for path in args.paths:
        clean(path)
        print(f"Cleaned {path}")


if __name__ == "__main__":
    main()
