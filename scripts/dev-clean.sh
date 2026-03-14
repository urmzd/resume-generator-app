#!/usr/bin/env bash
set -euo pipefail

rm -rf frontend/dist frontend/node_modules/.vite
cd frontend && npm install && npm run build
cd ..
wails dev
