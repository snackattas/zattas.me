# File: playwright_fun.py
# Language: Python

from playwright.sync_api import sync_playwright
import getpass, os

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False)
    context = browser.new_context()
    context.add_cookies([
        {"name": "automation_user", "value": getpass.getuser(), "url": "https://zattas.me"},
        {"name": "automation_language", "value": "python", "url": "https://zattas.me"}
    ])
    page = context.new_page()
    try:
        page.goto("https://zattas.me")
        page.set_viewport_size({"width": 1920, "height": 1080})
        input("Press Enter to close browser...")
    finally:
        browser.close()
        os._exit(0)
