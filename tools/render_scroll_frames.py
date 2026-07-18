#!/usr/bin/env python3
"""Render representative stills of the hero's depth and scroll choreography."""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "png"
OUT = ROOT / "preview"
W, H = 1672, 941
FONT = "/usr/share/fonts/opentype/urw-base35/NimbusSansNarrow-Bold.otf"


def clamp(value: float) -> float:
    return min(1.0, max(0.0, value))


def smoothstep(start: float, end: float, value: float) -> float:
    x = clamp((value - start) / (end - start))
    return x * x * (3 - 2 * x)


def place(canvas: Image.Image, name: str, dx: float, dy: float) -> None:
    layer = Image.open(ASSETS / name).convert("RGBA")
    layer = layer.resize((round(W * 1.10), round(H * 1.10)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(layer, (round(-W * 0.05 + dx), round(-H * 0.05 + dy)))


def title(canvas: Image.Image, text: str, y: float, size: float, opacity: float) -> None:
    if opacity <= 0.01:
        return
    font = ImageFont.truetype(FONT, round(size))
    ink = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(ink)
    draw.text(
        (W / 2 + 3, y + 5), text.upper(), font=font,
        fill=(3, 12, 7, round(72 * opacity)), anchor="mm",
        stroke_width=2, stroke_fill=(3, 12, 7, round(42 * opacity)),
    )
    draw.text(
        (W / 2, y), text.upper(), font=font,
        fill=(244, 242, 223, round(246 * opacity)), anchor="mm",
    )
    canvas.alpha_composite(ink)


def render(progress: float) -> Image.Image:
    descent = smoothstep(0.055, 0.78, progress)
    back_opacity = 1 - smoothstep(0.47, 0.72, progress)
    middle_opacity = 1 - smoothstep(0.57, 0.82, progress)
    front_opacity = 1 - smoothstep(0.69, 0.93, progress)

    canvas = Image.new("RGBA", (W, H), "#07100c")
    place(canvas, "01-background-valley.png", 0, descent * -0.022 * H)
    place(canvas, "02-far-left-ridge.png", descent * 0.007 * W, descent * -0.024 * H)
    place(canvas, "03-far-right-ridge.png", descent * -0.007 * W, descent * -0.024 * H)

    title(canvas, "World Diabetes", H * (0.29 + descent * 0.52), W * 0.077, back_opacity)

    place(canvas, "04-mid-left-valley.png", descent * 0.012 * W, descent * -0.038 * H)
    place(canvas, "05-mid-right-valley.png", descent * -0.012 * W, descent * -0.038 * H)

    title(canvas, "Day Expedition", H * (0.455 + descent * 0.61), W * 0.085, middle_opacity)

    place(canvas, "06-near-left-pines.png", descent * 0.018 * W, descent * -0.05 * H)
    place(canvas, "07-near-right-pines.png", descent * -0.018 * W, descent * -0.05 * H)

    title(canvas, "2026", H * (0.64 + descent * 0.69), W * 0.138, front_opacity)
    place(canvas, "08-foreground-rocks-ferns.png", 0, descent * -0.048 * H)

    grade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grade)
    gdraw.rectangle((0, 0, W, H), fill=(3, 10, 7, round(32 + smoothstep(0.79, 1, progress) * 170)))
    canvas.alpha_composite(grade)
    return canvas.convert("RGB")


def main() -> None:
    OUT.mkdir(exist_ok=True)
    frames = []
    for index, progress in enumerate((0.0, 0.28, 0.52, 0.76), start=1):
        frame = render(progress)
        frame.save(OUT / f"scroll-{index}-{round(progress * 100):02d}.jpg", quality=92)
        thumb = frame.resize((836, 470), Image.Resampling.LANCZOS)
        draw = ImageDraw.Draw(thumb)
        draw.rectangle((22, 20, 176, 54), fill=(3, 10, 7, 178))
        draw.text((34, 28), f"SCROLL {round(progress * 100):02d}%", fill="#f2f0df", font=ImageFont.truetype(FONT, 15))
        frames.append(thumb)

    sheet = Image.new("RGB", (1672, 940), "#07100c")
    for index, frame in enumerate(frames):
        sheet.paste(frame, ((index % 2) * 836, (index // 2) * 470))
    sheet.save(OUT / "scroll-choreography.jpg", quality=92)
    print(f"Rendered {OUT / 'scroll-choreography.jpg'}")


if __name__ == "__main__":
    main()
