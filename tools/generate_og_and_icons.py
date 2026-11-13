#!/usr/bin/env python3
"""Generate optimized logo variants, favicons, and 1200x630 OG images from SVG."""

from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "assets" / "images"
SRC_LOGO = IMAGES_DIR / "logo.png"


def generate_icons() -> None:
    img = Image.open(SRC_LOGO).convert("RGBA")

    # 2x of 38px display size = 76px (preserve aspect ratio)
    w, h = img.size
    target_h = 76
    target_w = round(w * (target_h / h))
    logo_76 = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    logo_76.save(IMAGES_DIR / "logo-76.png", format="PNG", optimize=True)
    logo_76.save(IMAGES_DIR / "logo-76.webp", format="WEBP", quality=90, method=6)

    # Square padded helper for favicon-32 and apple-touch-icon (180x180)
    def make_square(size: int, bg=(9, 13, 18, 255)) -> Image.Image:
        canvas = Image.new("RGBA", (size, size), bg)
        pad = round(size * 0.1)
        inner = size - 2 * pad
        scale = min(inner / w, inner / h)
        nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
        resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
        canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
        return canvas

    make_square(32, bg=(9, 13, 18, 0)).save(IMAGES_DIR / "favicon-32.png", format="PNG", optimize=True)
    make_square(180, bg=(9, 13, 18, 255)).save(IMAGES_DIR / "apple-touch-icon.png", format="PNG", optimize=True)


def build_og_svg(lang: str) -> str:
    if lang == "bg":
        eyebrow = "АРХИТЕКТ НА SAFETY-CRITICAL СИСТЕМИ · СОФИЯ"
        h1_line1 = "Edge AI за полеви сензори —"
        h1_line2 = "от недрата до въздуха."
        sub = "Евтини измервания. Решения с доверие."
        n1 = "Сензори (Магнитометрия · GPR)"
        n2 = "Edge (Jetson Orin / MCU)"
        n3 = "Мисия A: Полезни изкопаеми"
        n4 = "Мисия B: Откриване на UXO"
    else:
        eyebrow = "SAFETY-CRITICAL SYSTEMS ARCHITECT · SOFIA"
        h1_line1 = "Edge AI for field sensing —"
        h1_line2 = "from subsurface to airspace."
        sub = "Cheap measurements. Confident decisions."
        n1 = "Sensors (Magnetometry · GPR)"
        n2 = "Edge (Jetson Orin / MCU)"
        n3 = "Mission A: Mineral exploration"
        n4 = "Mission B: UXO &amp; hazard detection"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#090d12"/>
  <g stroke="#1e293b" stroke-width="1" opacity="0.35">
    <line x1="0" y1="120" x2="1200" y2="120"/>
    <line x1="0" y1="240" x2="1200" y2="240"/>
    <line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="0" y1="480" x2="1200" y2="480"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="400" y1="0" x2="400" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="800" y1="0" x2="800" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>
  <rect x="64" y="56" width="1072" height="518" rx="16" fill="#0f151d" stroke="#1e293b" stroke-width="1.5"/>

  <text x="112" y="128" fill="#94a3b8" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="18" letter-spacing="2">{eyebrow}</text>
  <text x="112" y="210" fill="#f1f5f9" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="50" font-weight="700">{h1_line1}</text>
  <text x="112" y="272" fill="#f1f5f9" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="50" font-weight="700">{h1_line2}</text>
  <text x="112" y="330" fill="#38bdf8" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="28" font-weight="600">{sub}</text>

  <!-- Thin stack diagram -->
  <g transform="translate(112, 392)" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="16">
    <rect x="0" y="22" width="270" height="52" rx="8" fill="#131b26" stroke="#2b3c54" stroke-width="1.5"/>
    <text x="135" y="53" fill="#f1f5f9" text-anchor="middle">{n1}</text>

    <line x1="270" y1="48" x2="320" y2="48" stroke="#38bdf8" stroke-width="1.5"/>

    <rect x="320" y="22" width="250" height="52" rx="8" fill="#131b26" stroke="#2b3c54" stroke-width="1.5"/>
    <text x="445" y="53" fill="#f1f5f9" text-anchor="middle">{n2}</text>

    <path d="M 570 48 L 620 48 L 650 22 L 690 22" fill="none" stroke="#10b981" stroke-width="1.5"/>
    <path d="M 570 48 L 620 48 L 650 76 L 690 76" fill="none" stroke="#38bdf8" stroke-width="1.5"/>

    <rect x="690" y="-2" width="286" height="44" rx="8" fill="#131b26" stroke="#10b981" stroke-width="1.5"/>
    <text x="833" y="25" fill="#10b981" text-anchor="middle">{n3}</text>

    <rect x="690" y="54" width="286" height="44" rx="8" fill="#131b26" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="833" y="81" fill="#38bdf8" text-anchor="middle">{n4}</text>
  </g>

  <text x="112" y="540" fill="#94a3b8" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="18">nikidimitrow.com · Nikolay Dimitrow</text>
</svg>"""


def generate_og_images() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        for lang in ("en", "bg"):
            svg_code = build_og_svg(lang)
            svg_path = IMAGES_DIR / f"og-{lang}.svg"
            svg_path.write_text(svg_code, encoding="utf-8")
            html = f"<!DOCTYPE html><html><body style='margin:0;padding:0;background:#090d12;'>{svg_code}</body></html>"
            page.set_content(html)
            page.screenshot(path=str(IMAGES_DIR / f"og-{lang}.png"))
        browser.close()


if __name__ == "__main__":
    generate_icons()
    generate_og_images()
    print("Generated icons and OG images successfully.")
