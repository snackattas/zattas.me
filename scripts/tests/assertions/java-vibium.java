// TEST: Check automation_detected cookie
Thread.sleep(2000);
String cookies = (String) page.evaluate("document.cookie");
Map<String, String> cookieMap = new HashMap<>();
for (String cookie : cookies.split("; ")) {
  String[] parts = cookie.split("=");
  if (parts.length == 2) cookieMap.put(parts[0], parts[1]);
}
System.out.println("Cookies: " + cookieMap);
String detected = cookieMap.get("automation_detected");
if ("{{EXPECTED_TOOL}}".equals(detected)) {
  System.out.println("✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}");
} else {
  System.err.println("❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got " + detected);
  System.exit(1);
}
