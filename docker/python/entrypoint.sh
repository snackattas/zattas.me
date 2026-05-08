#!/bin/bash
# Docker entrypoint for Python automation tests

set -e

# Environment variables
TARGET_URL=${TARGET_URL:-http://localhost:3000}
GALLERY_SCRIPT_PATH=${GALLERY_SCRIPT_PATH:-}
EXPECTED_TOOL=${EXPECTED_TOOL:-}

if [ -z "$GALLERY_SCRIPT_PATH" ] || [ -z "$EXPECTED_TOOL" ]; then
  echo "Error: GALLERY_SCRIPT_PATH and EXPECTED_TOOL must be set"
  exit 1
fi

# Transform and run script
TEMP_SCRIPT="/tmp/test-$(date +%s).py"
/app/scripts/tests/transform.sh "$GALLERY_SCRIPT_PATH" "$TEMP_SCRIPT" "$EXPECTED_TOOL" "$TARGET_URL"

echo "[TEST] Running transformed script: $GALLERY_SCRIPT_PATH"
python "$TEMP_SCRIPT"
EXIT_CODE=$?

rm -f "$TEMP_SCRIPT"
exit $EXIT_CODE
