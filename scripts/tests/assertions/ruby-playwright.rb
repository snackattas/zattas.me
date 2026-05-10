# TEST: Check automation_detected cookie
sleep(2)
cookies = context.cookies
puts "Cookies: #{cookies}"
detected = cookies.find { |c| c['name'] == 'automation_detected' }&.fetch('value')
if detected == '{{EXPECTED_TOOL}}'
  puts "✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}"
else
  warn "❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got #{detected}"
  exit(1)
end
