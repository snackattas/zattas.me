# Assertions

Code snippets injected by `transform.sh` into gallery scripts at CI time to verify automation detection is working. Each file corresponds to a gallery script by the same `{language}-{tool}` naming pattern.

## How injection works

`transform.sh` finds the "Keep open for 5 minutes" comment in a transformed gallery script and replaces it with the contents of the matching assertion file. The assertion runs at the same indentation level and has access to the same variables the gallery script set up (browser, page, driver, context, etc.).

## Assertion contract

- Print `✅ AUTOMATION_DETECTED_VERIFIED: {tool}` on success
- Exit non-zero on failure (the CI grep checks for the verified string)
- Print all cookies before filtering so failures are diagnosable

## Exit strategy by language

| Language | On failure |
|----------|-----------|
| JavaScript (non-Cypress) | `process.exit(1)` |
| JavaScript (Cypress) | `throw new Error(...)` — lets Cypress control the runner exit |
| Python | `sys.exit(1)` |
| Java | `System.exit(1)` |
| Ruby | `exit(1)` |
