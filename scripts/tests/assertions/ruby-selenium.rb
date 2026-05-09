# TEST: Check automation_detected cookie
detected = driver.manage.all_cookies.find { |c| c[:name] == 'automation_detected' }&.fetch(:value)
driver.quit
exit(detected == '{{EXPECTED_TOOL}}' ? 0 : 1)
