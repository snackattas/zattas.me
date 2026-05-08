# File: selenium_fun.py
# Language: Python

from selenium import webdriver
import getpass, os, time

driver = webdriver.Chrome()
try:
    driver.get("https://zattas.me")
    driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
    driver.add_cookie({"name": "automation_language", "value": "python"})
    driver.maximize_window()
    print("Browser open. Press Ctrl+C to close.")
    time.sleep(300)  # Keep open for 5 minutes
finally:
    driver.quit()
    os._exit(0)
