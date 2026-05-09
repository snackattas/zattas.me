// TEST: Check automation_detected cookie
Thread.sleep(2000);
List<BrowserContext.Cookie> cookies = context.cookies();
String detectedTool = cookies.stream()
  .filter(c -> c.name.equals("automation_detected"))
  .map(c -> c.value)
  .findFirst()
  .orElse(null);
browser.close();
if ("{{EXPECTED_TOOL}}".equals(detectedTool)) {
  System.out.println("✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}");
} else {
  System.err.println("❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got " + detectedTool);
  System.exit(1);
}
