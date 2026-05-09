# TEST: Check automation_detected cookie
time.sleep(2)
cookies = await browser.contexts()[0].cookies()
detected = next((c['value'] for c in cookies if c['name'] == 'automation_detected'), None)
if detected == '{{EXPECTED_TOOL}}':
    print('✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}')
else:
    print(f'❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got {detected}')
    sys.exit(1)
