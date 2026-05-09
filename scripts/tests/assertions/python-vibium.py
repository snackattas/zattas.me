# TEST: Check automation_detected cookie
time.sleep(2)
cookies_str = page.evaluate('document.cookie')
cookies = {k: v for k, v in [c.split('=') for c in cookies_str.split('; ')]}
detected = cookies.get('automation_detected')
if detected == '{{EXPECTED_TOOL}}':
    print('✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}')
else:
    print(f'❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got {detected}')
    sys.exit(1)
