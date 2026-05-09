#!/bin/bash

set -e

echo "===== PREPARE ====="
/app/docker/ruby/prepare.sh

echo ""
echo "===== RUN ====="
/app/docker/ruby/run.sh
