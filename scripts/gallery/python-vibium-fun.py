# File: vibium_fun.py
# Language: Python

import getpass
import time
from datetime import datetime

from vibium import browser

try:
    # Start browser in headed mode with single page
    browser_instance = browser.start(headless=False)
    page = browser_instance.page()

    # Navigate to site first
    page.go('https://zattas.me')

    # Set cookies on the page
    page.context.set_cookies([
        {'name': 'automation_user', 'value': getpass.getuser(), 'domain': 'zattas.me', 'path': '/'},
        {'name': 'automation_language', 'value': 'python', 'domain': 'zattas.me', 'path': '/'}
    ])

    # Install page clock with IANA timezone
    page.clock.install(timezone='America/Chicago')

    print('\n✅ Done! Check the browser for your haiku.')
    print('Press Ctrl+C to exit.')

    time.sleep(300)  # Keep open for 5 minutes
except KeyboardInterrupt:
    print('\nClosing...')
finally:
    browser_instance.stop()
