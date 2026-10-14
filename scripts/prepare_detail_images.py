from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path.cwd()
SOURCE = ROOT / "tmp-image-curation"
DESTINATION = ROOT / "dist" / "assets"

IMAGES = {
    "taian-table": {
        "oyster.webp": SOURCE / "taian" / "oyster.jpg",
        "agnolotti.webp": SOURCE / "taian" / "agnolotti.jpg",
        "venue.webp": SOURCE / "taian" / "venue.jpg",
        "hamachi.webp": SOURCE / "taian" / "hamachi.jpg",
        "king-crab.webp": SOURCE / "taian" / "king-crab.jpg",
        "scallop.webp": SOURCE / "taian" / "scallop.jpg",
    },
    "fu-he-hui": {
        "starter.webp": SOURCE / "fu" / "michelin-starter.webp",
        "main.webp": SOURCE / "fu" / "michelin-main.webp",
        "interior-bright.webp": SOURCE / "fu" / "michelin-interior.webp",
        "seasonal-bites.webp": SOURCE / "fu" / "cathay-dish.jpg",
        "tofu-skin.webp": SOURCE / "fu" / "the50-dish1.jpg",
        "interior-warm.webp": SOURCE / "fu" / "the50-dish3.jpg",
    },
    "sushi-oyama": {
        "nigiri.webp": SOURCE / "sushi" / "image-02.jpg",
        "counter.webp": SOURCE / "sushi" / "image-07.jpg",
        "sashimi.webp": SOURCE / "sushi" / "image-08.jpg",
        "crab-nigiri.webp": SOURCE / "sushi" / "image-11.jpg",
        "tuna-nigiri.webp": SOURCE / "sushi" / "image-15.jpg",
        "dessert.webp": SOURCE / "sushi" / "image-21.jpg",
    },
    "bombana": {
        "tuna-tartare.webp": SOURCE / "bombana" / "tuna-tartare.jpg",
        "lamb.webp": SOURCE / "bombana" / "lamb.jpg",
        "foie-gras.webp": SOURCE / "bombana" / "foie-gras.jpg",
        "raviolo.webp": SOURCE / "bombana" / "raviolo.jpg",
        "souffle.webp": SOURCE / "bombana" / "souffle.jpg",
        "champagne-bar.webp": SOURCE / "bombana" / "champagne-bar.jpg",
    },
    "yi-long-court": {
        "glazed-wings.webp": SOURCE / "yi" / "glazed-wings.jpg",
        "dim-sum.webp": SOURCE / "yi" / "independent-dimsum.webp",
        "peking-duck.webp": SOURCE / "yi" / "peking-duck.jpg",
        "cantonese-dish.webp": SOURCE / "yi" / "jpneazy-dish.jpg",
        "sweet-sour-shrimp.webp": SOURCE / "yi" / "qunar-shrimp.jpg",
        "private-room.webp": SOURCE / "yi" / "top25-space.jpg",
    },
}


def prepare(source: Path, destination: Path) -> None:
    image = ImageOps.exif_transpose(Image.open(str(source.absolute()))).convert("RGB")
    max_width = 1920
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.Resampling.LANCZOS)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(str(destination.absolute()), "WEBP", quality=84, method=6)


for restaurant, images in IMAGES.items():
    for filename, source in images.items():
        prepare(source, DESTINATION / restaurant / filename)
