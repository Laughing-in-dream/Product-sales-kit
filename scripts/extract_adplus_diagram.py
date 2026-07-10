from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "North America Sales List-FILE" / "AD Plus 2_0" / "Image" / "1--image.png"
OUTPUT = ROOT / "assets" / "diagram-parts"


PARTS = {
    "host-dual": (185, 575, 590, 835),
    "video-breakout": (760, 340, 1700, 690),
    "power-box": (125, 835, 790, 1025),
    "rwatch-chain": (810, 760, 1350, 860),
    "acc-harness": (700, 860, 1220, 1000),
    "obd-16pin": (1510, 855, 2060, 980),
    "obd-9pin": (1510, 1145, 2060, 1310),
}


def make_transparent(image: Image.Image, threshold: int = 245) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    for x in range(width):
        for y in range(height):
            red, green, blue, alpha = pixels[x, y]
            if red >= threshold and green >= threshold and blue >= threshold:
                pixels[x, y] = (255, 255, 255, 0)
    return rgba


def trim_alpha(image: Image.Image, padding: int = 10) -> Image.Image:
    bbox = image.getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.size[0], bbox[2] + padding)
    bottom = min(image.size[1], bbox[3] + padding)
    return image.crop((left, top, right, bottom))


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE)
    for name, box in PARTS.items():
        cropped = source.crop(box)
        transparent = trim_alpha(make_transparent(cropped))
        transparent.save(OUTPUT / f"{name}.png")


if __name__ == "__main__":
    main()
