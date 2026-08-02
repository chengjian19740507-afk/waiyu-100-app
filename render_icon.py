#!/usr/bin/env python3
"""Render icon.html to icon-192.png + icon-512.png via Playwright."""
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
SRC  = ROOT / "icon.html"
SIZES = [192, 512]

async def shoot(browser, size):
    ctx = await browser.new_context(viewport={"width": size, "height": size},
                                    device_scale_factor=1)
    page = await ctx.new_page()
    await page.goto(f"file://{SRC.resolve()}")
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(1200)
    out = ROOT / f"icon-{size}.png"
    await page.screenshot(path=str(out), full_page=False, type="png",
                          omit_background=False,
                          clip={"x": 0, "y": 0, "width": size, "height": size})
    await ctx.close()
    print(f"OK → {out} ({out.stat().st_size} bytes, {size}x{size})")

async def main():
    if not SRC.exists():
        sys.exit(f"missing {SRC}")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for s in SIZES:
            await shoot(browser, s)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())