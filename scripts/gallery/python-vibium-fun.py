# File: vibium_fun.py
# Language: Python

import getpass
import time

from vibium import browser

browser_instance = browser.start(headless=False)
try:
    page = browser_instance.page()

    page.go('https://zattas.me')

    page.context.set_cookies([
        {'name': 'automation_user', 'value': getpass.getuser(), 'domain': 'zattas.me', 'path': '/'},
        {'name': 'automation_language', 'value': 'python', 'domain': 'zattas.me', 'path': '/'}
    ])

    page.clock.install(timezone='America/Chicago')

    print('Check the browser for your bonus haiku! Press Ctrl+C to exit.')
    time.sleep(300)  # Keep open for 5 minutes
finally:
    browser_instance.stop()
