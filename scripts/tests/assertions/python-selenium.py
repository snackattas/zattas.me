# TEST: Check automation_detected cookie
cookies = {c['name']: c['value'] for c in driver.get_cookies()}
sys.exit(0 if cookies.get('automation_detected') == '{{EXPECTED_TOOL}}' else 1)
