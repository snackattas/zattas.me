#!/bin/bash
# Docker entrypoint for Java automation tests

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
TEMP_SCRIPT="/tmp/test-$(date +%s).java"
/app/scripts/tests/transform.sh "$GALLERY_SCRIPT_PATH" "$TEMP_SCRIPT" "$EXPECTED_TOOL" "$TARGET_URL"

echo "[TEST] Running transformed script: $GALLERY_SCRIPT_PATH"

# For Java, we need to compile first
JAVA_CLASS=$(grep -oP 'public class \K\w+' "$TEMP_SCRIPT" | head -1)
cd /tmp
javac "$TEMP_SCRIPT"
java -cp /tmp "$JAVA_CLASS"
EXIT_CODE=$?

rm -f "$TEMP_SCRIPT" "/tmp/${JAVA_CLASS}.class"
exit $EXIT_CODE
