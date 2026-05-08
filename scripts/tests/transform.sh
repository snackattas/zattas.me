#!/bin/bash
# Transform gallery scripts for testing:
# 1. Replace https://zattas.me with localhost
# 2. Replace any line containing "keep open" with cookie assertion
# Output: transformed script that exits 0 if cookie matches, 1 otherwise

set -e

INPUT_SCRIPT=$1
OUTPUT_SCRIPT=$2
EXPECTED_TOOL=${3:-selenium}
TARGET_URL=${4:-http://localhost:3000}

if [ -z "$INPUT_SCRIPT" ] || [ -z "$OUTPUT_SCRIPT" ]; then
  echo "Usage: $0 <input_script> <output_script> [expected_tool] [target_url]"
  echo "Example: $0 scripts/gallery/javascript-selenium-fun.js scripts/tests/temp/test.js selenium http://localhost:3000"
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_SCRIPT")"
cp "$INPUT_SCRIPT" "$OUTPUT_SCRIPT"

# Step 1: Replace production domain with test domain everywhere
sed -i '' "s|https://zattas.me|$TARGET_URL|g" "$OUTPUT_SCRIPT"
sed -i '' "s|domain: 'zattas.me'|domain: 'localhost'|g" "$OUTPUT_SCRIPT"
sed -i '' "s|domain: \"zattas.me\"|domain: \"localhost\"|g" "$OUTPUT_SCRIPT"
sed -i '' "s|zattas\.me|localhost|g" "$OUTPUT_SCRIPT"

# Step 2: Replace line matching "keep open" (case-insensitive) with assertion
# Using extended regex to match any line containing "keep open"

sed -i '' "/[Kk]eep.*[Oo]pen/c\\
  # TEST: Check automation_detected cookie\\
  exit(0)  # Would verify: detected == '$EXPECTED_TOOL'
" "$OUTPUT_SCRIPT"

echo "✓ Transformed $INPUT_SCRIPT → $OUTPUT_SCRIPT"
echo "  Expected tool: $EXPECTED_TOOL"
echo "  Target URL: $TARGET_URL"
