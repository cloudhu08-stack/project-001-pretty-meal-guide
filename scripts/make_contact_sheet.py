from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("folder", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    files = sorted(
        path
        for path in args.folder.iterdir()
        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        and path != args.output
    )
    width, height, columns = 300, 220, 4
    rows = (len(files) + columns - 1) // columns
    sheet = Image.new("RGB", (width * columns, height * rows), (25, 25, 25))
    draw = ImageDraw.Draw(sheet)

    for index, path in enumerate(files):
        image = Image.open(str(path.absolute())).convert("RGB")
        thumb = ImageOps.fit(
            image,
            (width, height - 24),
            method=Image.Resampling.LANCZOS,
        )
        x = index % columns * width
        y = index // columns * height
        sheet.paste(thumb, (x, y))
        draw.text((x + 8, y + height - 20), path.name, fill="white")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(str(args.output.absolute()), quality=88)


if __name__ == "__main__":
    main()
