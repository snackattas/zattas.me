#!/bin/bash
# Transform gallery scripts for testing by replacing production domain with localhost

set -e

INPUT_SCRIPT=$1
OUTPUT_SCRIPT=$2
TARGET_URL=${3:-http://localhost:3000}

if [ -z "$INPUT_SCRIPT" ] || [ -z "$OUTPUT_SCRIPT" ]; then
  echo "Usage: $0 <input_script> <output_script> [target_url]"
  echo "Example: $0 scripts/gallery/selenium.js scripts/tests/temp/selenium.js http://localhost:3000"
  exit 1
fi

# Ensure output directory exists
mkdir -p "$(dirname "$OUTPUT_SCRIPT")"

# Copy gallery script to temp directory
cp "$INPUT_SCRIPT" "$OUTPUT_SCRIPT"

# Replace production domain with test domain
sed -i '' "s|https://zattas.me|$TARGET_URL|g" "$OUTPUT_SCRIPT"
sed -i '' "s|domain: 'zattas.me'|domain: 'localhost'|g" "$OUTPUT_SCRIPT"
sed -i '' "s|domain: \"zattas.me\"|domain: \"localhost\"|g" "$OUTPUT_SCRIPT"

# For python scripts, also update in string literals
sed -i '' "s|zattas\.me|localhost|g" "$OUTPUT_SCRIPT"

echo "✓ Transformed $INPUT_SCRIPT → $OUTPUT_SCRIPT"
echo "  Target URL: $TARGET_URL"
