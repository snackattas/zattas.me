#!/bin/bash

set -e

echo "===== PREPARE ====="
/app/docker/python/prepare.sh

echo ""
echo "===== RUN ====="
/app/docker/python/run.sh
