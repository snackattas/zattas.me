// TEST: Check automation_detected cookie
String cookies = (String) page.evaluate("document.cookie");
Map<String, String> cookieMap = new HashMap<>();
for (String cookie : cookies.split("; ")) {
  String[] parts = cookie.split("=");
  if (parts.length == 2) cookieMap.put(parts[0], parts[1]);
}
String detected = cookieMap.get("automation_detected");
System.exit("{{EXPECTED_TOOL}}".equals(detected) ? 0 : 1);
