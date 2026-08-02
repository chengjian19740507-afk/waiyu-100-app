#!/usr/bin/env python3
"""Render og-cover.html to og-image.png via Playwright."""
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
SRC  = ROOT / "og-cover.html"
OUT  = ROOT / "og-image.png"

async def main():
    if not SRC.exists():
        sys.exit(f"missing {SRC}")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 800, "height": 800},
                                        device_scale_factor=1)
        page = await ctx.new_page()
        await page.goto(f"file://{SRC.resolve()}")
        # 等字体落地
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(1200)
        await page.screenshot(path=str(OUT), full_page=False, type="png",
                              omit_background=False, clip={"x": 0, "y": 0, "width": 800, "height": 800})
        await browser.close()
    print(f"OK → {OUT} ({OUT.stat().st_size} bytes)")

if __name__ == "__main__":
    asyncio.run(main())