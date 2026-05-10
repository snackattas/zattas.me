#!/bin/bash

set -e

source /tmp/prepare-env

python3 "$TEMP_SCRIPT"
EXIT_CODE=$?

rm -f "$TEMP_SCRIPT" /tmp/prepare-env
exit $EXIT_CODE
