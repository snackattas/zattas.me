#!/bin/bash
# Docker entrypoint for JavaScript automation tests

set -e

# Default values
TARGET_URL=${TARGET_URL:-http://localhost:3000}
DETECTION_TIMEOUT_MS=${DETECTION_TIMEOUT_MS:-10000}
AUTOMATION_TOOL=${AUTOMATION_TOOL:-selenium}
BROWSER=${BROWSER:-chrome}

# Run test harness
if [ -n "$GALLERY_SCRIPT_PATH" ] && [ -n "$EXPECTED_TOOL" ]; then
  # Using explicit environment variables
  node /app/scripts/tests/assertion-harness/javascript.js
else
  # Default behavior: run all test harnesses
  echo "Running JavaScript automation detection tests..."
  node /app/scripts/tests/assertion-harness/javascript.js
fi
