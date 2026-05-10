#!/bin/bash

set -e

source /tmp/prepare-env

cd "$TEMP_DIR"
mvn compile -q 2>&1

CLASSPATH=$(mvn dependency:build-classpath -q -Dmdep.outputFile=/tmp/cp.txt 2>&1 && cat /tmp/cp.txt)
java -cp "target/classes:$CLASSPATH" "$JAVA_CLASS"
EXIT_CODE=$?

rm -rf "$TEMP_DIR" /tmp/prepare-env /tmp/cp.txt
exit $EXIT_CODE
