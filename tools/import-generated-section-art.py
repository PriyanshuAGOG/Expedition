#!/usr/bin/env python3
"""One-time importer for the generated Himalayan section-art atlas."""

from __future__ import annotations

import json
import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "generated" / "section-art"
MANIFEST_PATH = ASSET_DIR / "atlas-manifest.json"
ATLAS_PATH = ASSET_DIR / "section-art-atlas-source.png"

# Temporary Canva document-export URL. The workflow runs as soon as this file is
# introduced on the integration branch and commits permanent cropped assets.
DEFAULT_ATLAS_URL = (
    "https://s3.amazonaws.com/document-export.canva.com/pWriM/DAHRdKpWriM/1/thumbnail/0001.png"
    "?X-Amz-Algorithm=AWS4-HMAC-SHA256"
    "&X-Amz-Credential=AKIAQYCGKMUHYGFFNMW3%2F20260804%2Fus-east-1%2Fs3%2Faws4_request"
    "&X-Amz-Date=20260804T214908Z"
    "&X-Amz-Expires=83913"
    "&X-Amz-Signature=aa77d1db575fccc60a20ba30bd7f4ac2c51cee97eca37df53d1fe8d6505ed50d"
    "&X-Amz-SignedHeaders=host"
    "&response-expires=Wed%2C%2005%20Aug%202026%2021%3A07%3A41%20GMT"
)


def download(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers={"User-Agent": "ExpeditionAssetImporter/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        payload = response.read()
    if len(payload) < 10_000:
        raise RuntimeError(f"Downloaded atlas is unexpectedly small: {len(payload)} bytes")
    destination.write_bytes(payload)


def make_background_transparent(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    if alpha.getextrema()[0] < 250:
        return rgba

    # Canva may flatten transparency against a uniform page colour. Infer that
    # colour from the corners and create a soft distance-based alpha mask.
    corners = [
        rgba.getpixel((0, 0))[:3],
        rgba.getpixel((rgba.width - 1, 0))[:3],
        rgba.getpixel((0, rgba.height - 1))[:3],
        rgba.getpixel((rgba.width - 1, rgba.height - 1))[:3],
    ]
    background = tuple(sum(channel) // len(corners) for channel in zip(*corners))
    pixels = rgba.load()
    mask = Image.new("L", rgba.size, 0)
    mask_pixels = mask.load()

    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, _ = pixels[x, y]
            distance = ((red - background[0]) ** 2 + (green - background[1]) ** 2 + (blue - background[2]) ** 2) ** 0.5
            mask_pixels[x, y] = max(0, min(255, int((distance - 7) * 9)))

    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(0.6, rgba.width / 4200)))
    rgba.putalpha(mask)
    return rgba


def trim(image: Image.Image, padding: int = 6) -> Image.Image:
    bounds = image.getchannel("A").getbbox()
    if not bounds:
        return image
    left, top, right, bottom = bounds
    return image.crop((
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    ))


def target_width(filename: str) -> int:
    horizontal = {"01", "02", "03", "04", "05", "09", "12", "13", "19"}
    return 1000 if filename[:2] in horizontal else 560


def crop_assets(atlas: Image.Image, manifest: dict) -> list[Path]:
    scale_x = atlas.width / manifest["atlas"]["width"]
    scale_y = atlas.height / manifest["atlas"]["height"]
    outputs: list[Path] = []

    for filename, info in manifest["assets"].items():
        left = round(info["contentX"] * scale_x)
        top = round(info["contentY"] * scale_y)
        right = round((info["contentX"] + info["contentW"]) * scale_x)
        bottom = round((info["contentY"] + info["contentH"]) * scale_y)
        cropped = trim(atlas.crop((left, top, right, bottom)))

        width = target_width(filename)
        if cropped.width < width:
            height = max(1, round(cropped.height * width / cropped.width))
            cropped = cropped.resize((width, height), Image.Resampling.LANCZOS)
            cropped = cropped.filter(ImageFilter.UnsharpMask(radius=1.1, percent=70, threshold=3))

        destination = ASSET_DIR / filename
        cropped.save(destination, "WEBP", quality=82, method=4)
        outputs.append(destination)
        print(f"created {destination.relative_to(ROOT)} {cropped.width}x{cropped.height}")

    return outputs


def main() -> int:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    source = os.environ.get("ATLAS_SOURCE")
    if source and Path(source).exists():
        ATLAS_PATH.write_bytes(Path(source).read_bytes())
    else:
        download(os.environ.get("ATLAS_URL", DEFAULT_ATLAS_URL), ATLAS_PATH)

    with Image.open(ATLAS_PATH) as opened:
        atlas = make_background_transparent(opened)
        print(f"atlas {atlas.width}x{atlas.height}, alpha={atlas.getchannel('A').getextrema()}")
        outputs = crop_assets(atlas, manifest)

    if len(outputs) != 19:
        raise RuntimeError(f"Expected 19 generated assets, created {len(outputs)}")
    ATLAS_PATH.unlink(missing_ok=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
