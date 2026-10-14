from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path.cwd()
ARTIFACTS = ROOT / "artifacts" / "image-curation"

RESTAURANTS = {
    "taian": "泰安门 / Taian Table",
    "fu": "福和慧 / Fu He Hui",
    "sushi": "鮨 大山 / Sushi Oyama",
    "bombana": "8½ Otto e Mezzo BOMBANA",
    "yi": "逸龙阁 / Yi Long Court",
}

TITLE_FONT = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 22)
LABEL_FONT = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 14)

for key, name in RESTAURANTS.items():
    files = [
        ("HERO", ARTIFACTS / f"{key}-hero-cdp.png"),
        ("VISUAL STORY", ARTIFACTS / f"{key}-visual-story.png"),
        ("FOOD VISUAL", ARTIFACTS / f"{key}-food-visual.png"),
    ]
    width = 1440
    label_height = 54
    images = [Image.open(str(path.absolute())).convert("RGB") for _, path in files]
    sheet = Image.new(
        "RGB",
        (width, 58 + sum(label_height + image.height for image in images)),
        "#0f0f10",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((24, 16), name, fill="#f5f1ea", font=TITLE_FONT)
    y = 58
    for (label, _), image in zip(files, images):
        draw.rectangle((0, y, width, y + label_height), fill="#191a1d")
        draw.text((24, y + 17), label, fill="#cfc7bd", font=LABEL_FONT)
        y += label_height
        sheet.paste(image, (0, y))
        y += image.height
    sheet.save(str((ARTIFACTS / f"{key}-review.png").absolute()), quality=92)
