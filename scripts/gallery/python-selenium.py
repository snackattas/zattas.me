"""
Example Selenium automation script in Python
This script demonstrates detecting automation on zattas.me
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import getpass

def main():
    driver = webdriver.Chrome()

    try:
        # Navigate to the target site
        driver.get("https://zattas.me")

        # Set automation cookies for detection
        driver.add_cookie({
            "name": "automation_user",
            "value": getpass.getuser(),
            "domain": "zattas.me",
            "path": "/"
        })

        driver.add_cookie({
            "name": "automation_tool",
            "value": "selenium",
            "domain": "zattas.me",
            "path": "/"
        })

        driver.add_cookie({
            "name": "automation_language",
            "value": "python",
            "domain": "zattas.me",
            "path": "/"
        })

        # Refresh to trigger detection
        driver.refresh()

        # Wait for detection to complete
        try:
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "automation-fun-modal"))
            )
        except:
            # Modal may not always appear, continue anyway
            pass

        print("Python Selenium automation script completed successfully")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
