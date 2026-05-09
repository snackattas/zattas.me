# File: selenium_fun.py
# Language: Python

from selenium import webdriver
import getpass, time

driver = webdriver.Chrome()
try:
    driver.get("https://zattas.me")
    driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
    driver.add_cookie({"name": "automation_language", "value": "python"})
    driver.maximize_window()
    print("Check the browser for your bonus haiku! Press Ctrl+C to exit.")
    time.sleep(300)  # Keep open for 5 minutes
except KeyboardInterrupt:
    pass
except Exception as e:
    print(f"Error: {e}")
finally:
    driver.quit()
