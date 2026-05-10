#!/bin/bash

set -e

source /tmp/prepare-env

cd "$TEMP_DIR"
mvn compile exec:java -Dexec.mainClass="$JAVA_CLASS" -q 2>&1
EXIT_CODE=$?

rm -rf "$TEMP_DIR" /tmp/prepare-env
exit $EXIT_CODE
