# TEST: Check automation_detected cookie
detected = context.cookies.find { |c| c['name'] == 'automation_detected' }&.fetch('value')
browser.close
exit(detected == '{{EXPECTED_TOOL}}' ? 0 : 1)
