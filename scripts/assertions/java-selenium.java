// TEST: Check automation_detected cookie
Thread.sleep(2000);
Set<Cookie> cookies = driver.manage().getCookies();
System.out.println("Cookies: " + cookies);
String detectedTool = cookies.stream()
  .filter(c -> c.getName().equals("automation_detected"))
  .map(Cookie::getValue)
  .findFirst()
  .orElse(null);
if ("{{EXPECTED_TOOL}}".equals(detectedTool)) {
  System.out.println("✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}");
} else {
  System.err.println("❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got " + detectedTool);
  System.exit(1);
}
