# File: vibium_fun.py
# Language: Python
# Vibium is built on Playwright, so the syntax is similar

from playwright.sync_api import sync_playwright
import getpass
import os

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Set cookies before first navigation
        context.add_cookies([
            {
                "name": "automation_user",
                "value": getpass.getuser(),
                "url": "https://zattas.me"
            },
            {
                "name": "automation_language",
                "value": "python",
                "url": "https://zattas.me"
            }
        ])

        page.goto("https://zattas.me")
        page.set_viewport_size({"width": 1920, "height": 1080})
        input("Press Enter to close browser...")
    finally:
        try:
            browser.close()
        except:
            pass
        os._exit(0)
