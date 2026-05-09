# TEST: Check automation_detected cookie
time.sleep(2)
cookies = {c['name']: c['value'] for c in driver.get_cookies()}
detected = cookies.get('automation_detected')
if detected == '{{EXPECTED_TOOL}}':
    print('✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}')
else:
    print(f'❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got {detected}')
    sys.exit(1)
