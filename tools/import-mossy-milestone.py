#!/usr/bin/env python3
"""One-time importer for the generated mossy milestone cluster."""

from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "generated" / "section-art"
SOURCE = ASSET_DIR / ".mossy-milestone-source.png"
DESTINATION = ASSET_DIR / "20-mossy-milestone-cluster.webp"
URL = (
    "https://s3.amazonaws.com/document-export.canva.com/TVc2k/DAHRdLTVc2k/1/thumbnail/0001.png"
    "?X-Amz-Algorithm=AWS4-HMAC-SHA256"
    "&X-Amz-Credential=AKIAQYCGKMUHYGFFNMW3%2F20260805%2Fus-east-1%2Fs3%2Faws4_request"
    "&X-Amz-Date=20260805T154354Z"
    "&X-Amz-Expires=20202"
    "&X-Amz-Signature=6ec4c51b5c71056c95c3b7e6ec74a590fce1ab9be9b84915f8c2327f80efa2b1"
    "&X-Amz-SignedHeaders=host"
    "&response-expires=Wed%2C%2005%20Aug%202026%2021%3A20%3A36%20GMT"
)


def download() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(URL, headers={"User-Agent": "ExpeditionAssetImporter/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        payload = response.read()
    if len(payload) < 10_000:
        raise RuntimeError(f"Downloaded milestone is unexpectedly small: {len(payload)} bytes")
    SOURCE.write_bytes(payload)


def transparent_cutout(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    if rgba.getchannel("A").getextrema()[0] < 250:
        return rgba

    corners = [
        rgba.getpixel((0, 0))[:3],
        rgba.getpixel((rgba.width - 1, 0))[:3],
        rgba.getpixel((0, rgba.height - 1))[:3],
        rgba.getpixel((rgba.width - 1, rgba.height - 1))[:3],
    ]
    background = tuple(sum(channel) // len(corners) for channel in zip(*corners))
    source_pixels = rgba.load()
    alpha = Image.new("L", rgba.size, 0)
    alpha_pixels = alpha.load()

    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, _ = source_pixels[x, y]
            distance = ((red - background[0]) ** 2 + (green - background[1]) ** 2 + (blue - background[2]) ** 2) ** 0.5
            alpha_pixels[x, y] = max(0, min(255, int((distance - 7) * 9)))

    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=max(0.7, rgba.width / 1800)))
    rgba.putalpha(alpha)
    return rgba


def main() -> int:
    download()
    with Image.open(SOURCE) as opened:
        image = transparent_cutout(opened)
        bounds = image.getchannel("A").getbbox()
        if bounds:
            left, top, right, bottom = bounds
            padding = max(6, round(image.width * 0.012))
            image = image.crop((
                max(0, left - padding),
                max(0, top - padding),
                min(image.width, right + padding),
                min(image.height, bottom + padding),
            ))

        target_width = 640
        if image.width != target_width:
            target_height = max(1, round(image.height * target_width / image.width))
            image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
            image = image.filter(ImageFilter.UnsharpMask(radius=1.1, percent=65, threshold=3))

        image.save(DESTINATION, "WEBP", quality=84, method=4)
        print(f"created {DESTINATION.relative_to(ROOT)} {image.width}x{image.height}")

    SOURCE.unlink(missing_ok=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
