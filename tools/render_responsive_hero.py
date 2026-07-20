#!/usr/bin/env python3
"""Render opening hero frames and measure foreground coverage by viewport."""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "png"
MOBILE_ASSETS = ROOT / "assets" / "mobile" / "png"
OUT = ROOT / "preview"
FONT = "/usr/share/fonts/opentype/urw-base35/NimbusSansNarrow-Bold.otf"


def fitted_layer(path: Path, viewport: tuple[int, int], mobile: bool, shift_x: float = 0, shift_y: float = 0) -> Image.Image:
    width, height = viewport
    mobile_background = mobile and path.name.startswith("01-")
    box_w = round(width * (1.36 if mobile_background else 2.20 if mobile else 1.14))
    box_h = round(height * (1.14 if mobile else 1.12))
    box_left = round(width * (-0.18 if mobile_background else -0.60 if mobile else -0.07) + shift_x)
    box_top = round(height * (-0.07 if mobile_background else -0.11 if mobile else -0.06) + shift_y)

    source = Image.open(path).convert("RGBA")
    scale = max(box_w / source.width, box_h / source.height)
    resized = source.resize((round(source.width * scale), round(source.height * scale)), Image.Resampling.LANCZOS)
    crop_left = max(0, (resized.width - box_w) // 2)
    crop_top = max(0, (resized.height - box_h) // 2)
    fitted = resized.crop((crop_left, crop_top, crop_left + box_w, crop_top + box_h))

    canvas = Image.new("RGBA", viewport, (0, 0, 0, 0))
    canvas.alpha_composite(fitted, (box_left, box_top))
    return canvas


def text_layer(viewport: tuple[int, int], text: str, y: float, size: float) -> Image.Image:
    width, height = viewport
    layer = Image.new("RGBA", viewport, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    font = ImageFont.truetype(FONT, round(size))
    draw.text((width / 2 + 2, y + 4), text.upper(), font=font, anchor="mm", fill=(3, 12, 7, 90))
    draw.text((width / 2, y), text.upper(), font=font, anchor="mm", fill=(244, 242, 223, 245))
    return layer


def fitted_mobile_layer(path: Path, viewport: tuple[int, int], shift_y: float = 0) -> Image.Image:
    width, height = viewport
    box_w, box_h = round(width * 1.04), round(height * 1.18)
    box_left, box_top = round(width * -0.02), round(height * -0.12 + shift_y)
    source = Image.open(path).convert("RGBA")
    scale = max(box_w / source.width, box_h / source.height)
    resized = source.resize((round(source.width * scale), round(source.height * scale)), Image.Resampling.LANCZOS)
    crop_left = max(0, (resized.width - box_w) // 2)
    crop_top = max(0, (resized.height - box_h) // 2)
    fitted = resized.crop((crop_left, crop_top, crop_left + box_w, crop_top + box_h))
    canvas = Image.new("RGBA", viewport, (0, 0, 0, 0))
    canvas.alpha_composite(fitted, (box_left, box_top))
    return canvas


def render(viewport: tuple[int, int], mobile: bool) -> tuple[Image.Image, float]:
    width, height = viewport
    if mobile:
        layers = {
            "bg": fitted_mobile_layer(MOBILE_ASSETS / "17-mobile-background.png", viewport),
            "far": fitted_mobile_layer(MOBILE_ASSETS / "18-mobile-far-ridges.png", viewport),
            "mid": fitted_mobile_layer(MOBILE_ASSETS / "19-mobile-mid-forest.png", viewport, height * -.02),
            "near": fitted_mobile_layer(MOBILE_ASSETS / "20-mobile-near-forest.png", viewport, height * -.04),
            "foreground": fitted_mobile_layer(MOBILE_ASSETS / "21-mobile-foreground.png", viewport, height * -.01),
        }
        scene = Image.new("RGBA", viewport, "#07100c")
        scene.alpha_composite(layers["bg"])
        scene.alpha_composite(layers["far"])
        scene.alpha_composite(text_layer(viewport, "World Diabetes", height * .245, width * .1015))
        scene.alpha_composite(layers["mid"])
        scene.alpha_composite(text_layer(viewport, "Day Expedition", height * .31, width * .1045))
        scene.alpha_composite(layers["near"])
        scene.alpha_composite(text_layer(viewport, "2026", height * .39, width * .218))
        scene.alpha_composite(layers["foreground"])
        coverage = Image.new("L", viewport, 0)
        for key in ("far", "mid", "near", "foreground"):
            coverage = ImageChops.lighter(coverage, layers[key].getchannel("A"))
        covered = sum(coverage.histogram()[32:])
        return scene.convert("RGB"), covered / (width * height)

    shifts = {
        "far_left": width * (0.12 if mobile else 0),
        "far_right": width * (-0.12 if mobile else 0),
        "mid_left": width * (0.15 if mobile else 0),
        "mid_right": width * (-0.15 if mobile else 0),
        "near_left": width * (0.18 if mobile else 0),
        "near_right": width * (-0.18 if mobile else 0),
    }

    names = {
        "bg": "01-background-valley.png",
        "far_left": "02-far-left-ridge.png",
        "far_right": "03-far-right-ridge.png",
        "mid_left": "04-mid-left-valley.png",
        "mid_right": "05-mid-right-valley.png",
        "near_left": "06-near-left-pines.png",
        "near_right": "07-near-right-pines.png",
        "foreground": "08-foreground-rocks-ferns.png",
    }

    layers: dict[str, Image.Image] = {}
    for key, name in names.items():
        y = 0
        if key.startswith("mid_"):
            y = height * (-0.02 if mobile else -0.02)
        elif key.startswith("near_"):
            y = height * (-0.04 if mobile else -0.04)
        elif key == "foreground":
            y = height * (-0.01 if mobile else -0.01)
        layers[key] = fitted_layer(ASSETS / name, viewport, mobile, shifts.get(key, 0), y)

    scene = Image.new("RGBA", viewport, "#07100c")
    scene.alpha_composite(layers["bg"])
    scene.alpha_composite(layers["far_left"])
    scene.alpha_composite(layers["far_right"])

    scene.alpha_composite(text_layer(viewport, "World Diabetes", height * 0.32, width * 0.077))

    scene.alpha_composite(layers["mid_left"])
    scene.alpha_composite(layers["mid_right"])

    scene.alpha_composite(text_layer(viewport, "Day Expedition", height * 0.44, width * 0.085))

    scene.alpha_composite(layers["near_left"])
    scene.alpha_composite(layers["near_right"])

    scene.alpha_composite(text_layer(viewport, "2026", height * 0.60, width * 0.138))

    scene.alpha_composite(layers["foreground"])

    coverage = Image.new("L", viewport, 0)
    for key in ("mid_left", "mid_right", "near_left", "near_right", "foreground"):
        coverage = ImageChops.lighter(coverage, layers[key].getchannel("A"))
    histogram = coverage.histogram()
    covered = sum(histogram[32:])
    coverage_ratio = covered / (width * height)

    return scene.convert("RGB"), coverage_ratio


def main() -> None:
    OUT.mkdir(exist_ok=True)
    desktop, desktop_coverage = render((1440, 900), False)
    mobile, mobile_coverage = render((390, 844), True)
    desktop.save(OUT / "hero-desktop-responsive.jpg", quality=92)
    mobile.save(OUT / "hero-mobile-responsive.jpg", quality=92)

    mobile_preview = Image.new("RGB", (1440, 900), "#07100c")
    scaled = mobile.resize((416, 900), Image.Resampling.LANCZOS)
    mobile_preview.paste(scaled, (512, 0))
    mobile_preview.save(OUT / "hero-mobile-framed.jpg", quality=92)

    print(f"Desktop green-layer coverage: {desktop_coverage:.1%}")
    print(f"Mobile green-layer coverage: {mobile_coverage:.1%}")


if __name__ == "__main__":
    main()
