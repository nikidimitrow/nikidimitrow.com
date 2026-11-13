#!/usr/bin/env python3
"""Download self-hosted woff2 subsets (Latin + Cyrillic) for Inter and JetBrains Mono."""

import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT / "assets" / "fonts"
FONTS_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

URLS = {
    "inter": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
    "jetbrains-mono": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap",
}


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8")


def download_binary(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        dest.write_bytes(resp.read())


def main() -> None:
    for name, css_url in URLS.items():
        css = fetch_text(css_url)
        # Keep only cyrillic and latin subsets
        blocks = re.findall(r"/\*\s*(cyrillic|latin)\s*\*/\s*@font-face\s*\{[^}]+\}", css)
        full_blocks = re.finditer(r"/\*\s*(cyrillic|latin)\s*\*/\s*(@font-face\s*\{[^}]+\})", css)
        for m in full_blocks:
            subset = m.group(1)
            block = m.group(2)
            weight_m = re.search(r"font-weight:\s*(\d+)", block)
            src_m = re.search(r"url\((https://[^)]+\.woff2)\)", block)
            if not weight_m or not src_m:
                continue
            weight = weight_m.group(1)
            font_url = src_m.group(1)
            out_file = FONTS_DIR / f"{name}-{weight}-{subset}.woff2"
            download_binary(font_url, out_file)
            print(f"Downloaded {out_file.name} ({out_file.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
