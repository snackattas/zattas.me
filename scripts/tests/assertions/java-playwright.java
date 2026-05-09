// TEST: Check automation_detected cookie
List<BrowserContext.Cookie> cookies = context.cookies();
String detectedTool = cookies.stream()
  .filter(c -> c.name.equals("automation_detected"))
  .map(c -> c.value)
  .findFirst()
  .orElse(null);
browser.close();
System.exit("{{EXPECTED_TOOL}}".equals(detectedTool) ? 0 : 1);
