#!/usr/bin/env python3
"""Render the dedicated portrait hero at representative scroll depths."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "mobile" / "png"
OUT = ROOT / "preview"
W, H = 390, 844
FONT = "/usr/share/fonts/opentype/urw-base35/NimbusSansNarrow-Bold.otf"


def clamp(value):
    return min(1.0, max(0.0, value))


def smoothstep(start, end, value):
    x = clamp((value - start) / (end - start))
    return x * x * (3 - 2 * x)


def layer(name, y_shift):
    source = Image.open(ASSETS / name).convert("RGBA")
    box_w, box_h = round(W * 1.06), round(H * 1.26)
    scale = max(box_w / source.width, box_h / source.height)
    resized = source.resize((round(source.width * scale), round(source.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - box_w) // 2)
    top = max(0, (resized.height - box_h) // 2)
    fitted = resized.crop((left, top, left + box_w, top + box_h))
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(fitted, (round(W * -.03), round(H * (-.14 + y_shift))))
    return canvas


def title(canvas, text, y, size, opacity):
    if opacity <= .01:
        return
    font = ImageFont.truetype(FONT, round(size))
    ink = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(ink)
    draw.text((W / 2 + 2, y + 3), text.upper(), font=font, anchor="mm", fill=(3, 12, 7, round(85 * opacity)))
    draw.text((W / 2, y), text.upper(), font=font, anchor="mm", fill=(244, 242, 223, round(245 * opacity)))
    canvas.alpha_composite(ink)


def render(progress):
    d = clamp(progress / .76)
    scene = Image.new("RGBA", (W, H), "#07100c")
    scene.alpha_composite(layer("17-mobile-background.png", d * -.022))
    scene.alpha_composite(layer("18-mobile-far-ridges.png", d * -.032))
    title(scene, "World Diabetes", H * (.245 + d * .48), W * .1015, 1 - smoothstep(.47, .72, progress))
    scene.alpha_composite(layer("19-mobile-mid-forest.png", -.02 + d * -.053))
    title(scene, "Day Expedition", H * (.31 + d * .56), W * .1045, 1 - smoothstep(.57, .82, progress))
    scene.alpha_composite(layer("20-mobile-near-forest.png", -.04 + d * -.064))
    title(scene, "2026", H * (.39 + d * .64), W * .218, 1 - smoothstep(.69, .93, progress))
    scene.alpha_composite(layer("21-mobile-foreground.png", -.01 + d * -.08))
    return scene.convert("RGB")


def main():
    OUT.mkdir(exist_ok=True)
    frames = []
    for index, progress in enumerate((0, .22, .45, .68), 1):
        frame = render(progress)
        frame.save(OUT / f"mobile-scroll-{index}-{round(progress * 100):02d}.jpg", quality=91)
        frames.append(frame)
    sheet = Image.new("RGB", (W * 2, H * 2), "#07100c")
    for index, frame in enumerate(frames):
        sheet.paste(frame, ((index % 2) * W, (index // 2) * H))
    sheet.save(OUT / "mobile-scroll-choreography.jpg", quality=91)
    print(OUT / "mobile-scroll-choreography.jpg")


if __name__ == "__main__":
    main()
