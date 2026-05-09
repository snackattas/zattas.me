# TEST: Check automation_detected cookie
cookies = await browser.contexts()[0].cookies()
detected = next((c['value'] for c in cookies if c['name'] == 'automation_detected'), None)
sys.exit(0 if detected == '{{EXPECTED_TOOL}}' else 1)
