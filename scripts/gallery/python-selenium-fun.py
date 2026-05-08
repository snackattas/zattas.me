# File: selenium_fun.py
# Language: Python

from selenium import webdriver
import getpass
import os

driver = webdriver.Firefox()

try:
    driver.get("https://zattas.me")
    driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
    driver.add_cookie({"name": "automation_language", "value": "python"})
    driver.maximize_window()
    input("Press Enter to close browser...")
finally:
    try:
        driver.quit()
    except:
        pass
    os._exit(0)
