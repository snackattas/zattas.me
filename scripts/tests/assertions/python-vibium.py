# TEST: Check automation_detected cookie
cookies_str = page.evaluate('document.cookie')
cookies = {k: v for k, v in [c.split('=') for c in cookies_str.split('; ')]}
detected = cookies.get('automation_detected')
sys.exit(0 if detected == '{{EXPECTED_TOOL}}' else 1)
