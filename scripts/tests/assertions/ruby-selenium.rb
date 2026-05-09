# TEST: Check automation_detected cookie
sleep(2)
cookies = driver.manage.all_cookies.map { |c| [c[:name], c[:value]] }.to_h
puts "Cookies: #{cookies}"
detected = cookies['automation_detected']
if detected == '{{EXPECTED_TOOL}}'
  puts '✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}'
else
  warn "❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got #{detected}"
  exit(1)
end
