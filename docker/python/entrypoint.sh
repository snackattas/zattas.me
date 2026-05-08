#!/bin/bash
# Docker entrypoint for Python automation tests

set -e

# Default values
TARGET_URL=${TARGET_URL:-http://localhost:3000}
DETECTION_TIMEOUT_MS=${DETECTION_TIMEOUT_MS:-10000}
AUTOMATION_TOOL=${AUTOMATION_TOOL:-selenium}

# Run test harness
if [ -n "$GALLERY_SCRIPT_PATH" ] && [ -n "$EXPECTED_TOOL" ]; then
  # Using explicit environment variables
  python /app/scripts/tests/assertion-harness/python.py
else
  # Default behavior: run all test harnesses
  echo "Running Python automation detection tests..."
  python /app/scripts/tests/assertion-harness/python.py
fi
