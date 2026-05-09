// TEST: Check automation_detected cookie
Set<Cookie> cookies = driver.manage().getCookies();
String detectedTool = cookies.stream()
  .filter(c -> c.getName().equals("automation_detected"))
  .map(Cookie::getValue)
  .findFirst()
  .orElse(null);
driver.quit();
System.exit("{{EXPECTED_TOOL}}".equals(detectedTool) ? 0 : 1);
