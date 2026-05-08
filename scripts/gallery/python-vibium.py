"""
Example Vibium automation script in Python
This script demonstrates detecting automation on zattas.me
Vibium provides advanced browser automation with page_clock support
"""

from playwright.sync_api import sync_playwright
import getpass

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
                    "value": getpass.getuser(),
                    "url": "https://zattas.me"
                },
                {
                    "name": "automation_tool",
                    "value": "selenium",  # Start as selenium for initial detection
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

            # Install Vibium's page_clock for advanced timing control
            try:
                page.evaluate("""
                    if (window.__vibium) {
                        window.__vibium.page_clock_install?.();
                    }
                """)
            except:
                pass

            # Wait for detection to trigger
            page.wait_for_timeout(2000)

            # Verify detection was triggered
            detected = page.evaluate("() => window.__automationDetected?.tool")
            print(f"Detected tool: {detected}")

            # Check if upgraded to Vibium
            is_vibium = page.evaluate("() => !!window.__vibiumClock")
            if is_vibium:
                print("Upgraded to Vibium detection")

            print("Python Vibium automation script completed successfully")

        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    main()
