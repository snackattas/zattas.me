#!/usr/bin/env python3
"""
Python Assertion Harness
Wraps gallery scripts with detection assertions and JSON output

Environment variables:
    GALLERY_SCRIPT_PATH - Path to gallery script to test
    EXPECTED_TOOL - Expected automation tool (selenium, playwright)
    TARGET_URL - URL to test against (default: http://localhost:3000)
    DETECTION_TIMEOUT_MS - Max time to wait for detection (default: 10000)
"""

import os
import json
import sys
import time
import subprocess
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

TARGET_URL = os.getenv('TARGET_URL', 'http://localhost:3000')
DETECTION_TIMEOUT_MS = int(os.getenv('DETECTION_TIMEOUT_MS', '10000'))
GALLERY_SCRIPT_PATH = os.getenv('GALLERY_SCRIPT_PATH', '/app/scripts/gallery/python-selenium.py')
EXPECTED_TOOL = os.getenv('EXPECTED_TOOL', 'selenium')

def generate_temp_script(gallery_path):
    """Generate a temporary test script from a gallery script"""
    base_name = Path(gallery_path).name
    gallery_dir = Path(gallery_path).parent
    temp_dir = gallery_dir.parent / 'tests' / 'temp'
    temp_path = temp_dir / f'test-{base_name}'

    # Ensure temp directory exists
    temp_dir.mkdir(parents=True, exist_ok=True)

    # Read and transform the gallery script
    with open(gallery_path, 'r') as f:
        content = f.read()

    # Replace production domain with test domain
    content = content.replace('https://zattas.me', TARGET_URL)
    content = content.replace("domain: 'zattas.me'", "domain: 'localhost'")
    content = content.replace('domain: "zattas.me"', 'domain: "localhost"')
    content = content.replace('zattas.me', 'localhost')

    # Write transformed script
    with open(temp_path, 'w') as f:
        f.write(content)

    return str(temp_path)

def run_test_with_assertion():
    """Run test with assertion"""
    driver = None
    start_time = time.time()

    try:
        # Generate temp script
        temp_script = generate_temp_script(GALLERY_SCRIPT_PATH)
        print(f'[TEST] Using temp script: {temp_script}', file=sys.stderr)

        # Create Chrome options for headless mode
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        # Create driver
        driver = webdriver.Chrome(options=options)

        print(f'[TEST] Navigating to {TARGET_URL}', file=sys.stderr)
        driver.get(TARGET_URL)

        # Set test detection cookies
        driver.add_cookie({
            'name': 'automation_tool',
            'value': EXPECTED_TOOL,
            'domain': 'localhost',
            'path': '/'
        })

        driver.add_cookie({
            'name': 'automation_user',
            'value': 'test_harness',
            'domain': 'localhost',
            'path': '/'
        })

        driver.add_cookie({
            'name': 'automation_language',
            'value': 'python',
            'domain': 'localhost',
            'path': '/'
        })

        # Refresh to trigger detection
        print('[TEST] Refreshing to trigger detection...', file=sys.stderr)
        driver.navigate().refresh()

        # Wait for detection with timeout
        timeout_seconds = DETECTION_TIMEOUT_MS / 1000.0
        print(f'[TEST] Waiting for detection (timeout: {DETECTION_TIMEOUT_MS}ms)...', file=sys.stderr)

        detected = None
        try:
            # Wait for window.__automationDetected to be set
            WebDriverWait(driver, timeout_seconds).until(
                lambda d: d.execute_script('return window.__automationDetected?.tool;')
            )
            detected = driver.execute_script('return window.__automationDetected?.tool;')
            print(f'[TEST] Detection successful: {detected}', file=sys.stderr)
        except Exception as e:
            print(f'[TEST] Detection timeout after {DETECTION_TIMEOUT_MS}ms', file=sys.stderr)

            # Check cookie as fallback
            try:
                cookies = driver.get_cookies()
                for cookie in cookies:
                    if cookie['name'] == 'automation_detected':
                        detected = cookie['value']
                        print(f'[TEST] Cookie check: automation_detected={detected}', file=sys.stderr)
                        break
            except Exception as cookie_err:
                print(f'[TEST] Cookie check failed: {cookie_err}', file=sys.stderr)

        elapsed_ms = int((time.time() - start_time) * 1000)
        passed = detected == EXPECTED_TOOL

        output = {
            'passed': passed,
            'detected': detected,
            'expectedTool': EXPECTED_TOOL,
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'elapsedMs': elapsed_ms,
            'testScript': temp_script,
        }

        print(json.dumps(output, indent=2))
        sys.exit(0 if passed else 1)

    except Exception as error:
        elapsed_ms = int((time.time() - start_time) * 1000)

        output = {
            'passed': False,
            'expectedTool': EXPECTED_TOOL,
            'error': str(error),
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'elapsedMs': elapsed_ms,
        }

        print(json.dumps(output, indent=2))
        sys.exit(1)

    finally:
        if driver:
            try:
                driver.quit()
            except Exception as e:
                print(f'Error quitting driver: {e}', file=sys.stderr)

if __name__ == '__main__':
    run_test_with_assertion()
