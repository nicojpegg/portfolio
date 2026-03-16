#!/usr/bin/env python3
"""
convert.py — Convert all images in raw/ to WebP in proxy/
Preserves subfolder structure. Skips files already converted.

Usage:
    python3 convert.py              # default quality (82)
    python3 convert.py --quality 90 # custom quality
    python3 convert.py --force      # reconvert existing files
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip install Pillow")

RAW_DIR   = Path(__file__).parent / "raw"
PROXY_DIR = Path(__file__).parent / "proxy"

SUPPORTED = {".jpg", ".jpeg", ".png", ".tiff", ".tif", ".bmp", ".heic", ".heif"}


def convert(quality: int = 82, force: bool = False) -> None:
    images = [p for p in RAW_DIR.rglob("*") if p.suffix.lower() in SUPPORTED]

    if not images:
        print(f"No images found in {RAW_DIR}")
        return

    converted = skipped = 0

    for src in sorted(images):
        rel       = src.relative_to(RAW_DIR)
        dest      = (PROXY_DIR / rel).with_suffix(".webp")

        if dest.exists() and not force:
            skipped += 1
            continue

        dest.parent.mkdir(parents=True, exist_ok=True)

        with Image.open(src) as img:
            img.save(dest, "WEBP", quality=quality, method=6)

        converted += 1
        print(f"  ✓  {rel}  →  {dest.relative_to(PROXY_DIR.parent)}")

    print(f"\nDone — {converted} converted, {skipped} skipped (already exist).")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert raw photos to WebP proxies.")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality 1–100 (default: 82)")
    parser.add_argument("--force",   action="store_true",  help="Reconvert files that already exist")
    args = parser.parse_args()

    convert(quality=args.quality, force=args.force)
