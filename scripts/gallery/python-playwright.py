"""
Example Playwright automation script in Python
This script demonstrates detecting automation on zattas.me
"""

from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        try:
            # Add automation cookies before navigation
            context.add_cookies([
                {
                    "name": "automation_user",
                    "value": "playwright_user",
                    "url": "https://zattas.me"
                },
                {
                    "name": "automation_tool",
                    "value": "playwright",
                    "url": "https://zattas.me"
                },
                {
                    "name": "automation_language",
                    "value": "python",
                    "url": "https://zattas.me"
                }
            ])

            # Navigate to the target site
            page.goto("https://zattas.me")

            # Wait a bit for detection to trigger
            page.wait_for_timeout(2000)

            print("Python Playwright automation script completed successfully")

        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    main()
