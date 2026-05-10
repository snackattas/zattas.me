# File: selenium_fun.py
# Language: Python

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import getpass, time

options = Options()
options.add_argument('--headless=false')
driver = webdriver.Chrome(options=options)
driver.get("https://zattas.me")
driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
driver.add_cookie({"name": "automation_language", "value": "python"})
driver.maximize_window()
print("Check the browser for your bonus haiku! Press Ctrl+C to exit.")
try:
    time.sleep(300)  # Keep open for 5 minutes
except KeyboardInterrupt:
    pass
finally:
    driver.quit()
