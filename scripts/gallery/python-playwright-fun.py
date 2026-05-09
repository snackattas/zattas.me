# File: playwright_fun.py
# Language: Python

from playwright.sync_api import sync_playwright
import getpass, time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    try:
        context = browser.new_context()
        page = context.new_page()
        page.goto("https://zattas.me")
        context.add_cookies([
            {"name": "automation_user", "value": getpass.getuser(), "url": "https://zattas.me"},
            {"name": "automation_language", "value": "python", "url": "https://zattas.me"}
        ])
        page.set_viewport_size({"width": 1920, "height": 1080})
        print("Check the browser for your bonus haiku! Press Ctrl+C to exit.")
        time.sleep(300)  # Keep open for 5 minutes
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()
