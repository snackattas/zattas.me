# TEST: Check automation_detected cookie
sleep(2)
detected = driver.manage.all_cookies.find { |c| c[:name] == 'automation_detected' }&.fetch(:value)
driver.quit
if detected == '{{EXPECTED_TOOL}}'
  puts "✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}"
else
  warn "❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got #{detected}"
  exit(1)
end
