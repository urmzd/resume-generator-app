#!/usr/bin/env bash
set -euo pipefail

git config core.hooksPath .githooks
go mod download
cd frontend && npm install
cd ../e2e/desktop && npm install && npx playwright install chromium
