# Resume Generator App

default:
    @just --list

# Initialize dev environment: git hooks, Go deps, frontend deps, Playwright
init:
    git config core.hooksPath .githooks
    go mod download
    cd frontend && npm install
    cd e2e/desktop && npm install && npx playwright install chromium

# Start Wails dev server with hot reload
dev:
    wails dev

# Clean frontend caches and start dev server
dev-clean:
    rm -rf frontend/dist frontend/node_modules/.vite
    cd frontend && npm install && npm run build
    wails dev

# Build production binary with version info
build version="dev" commit="none" date="unknown":
    wails build -trimpath -ldflags "-X main.version={{version}} -X main.commit={{commit}} -X main.date={{date}}"

# Run desktop e2e demo: start Wails dev, run Playwright, copy artifacts
demo-desktop:
    #!/usr/bin/env bash
    set -euo pipefail

    wails dev &
    WAILS_PID=$!
    trap 'kill $WAILS_PID 2>/dev/null; wait $WAILS_PID 2>/dev/null' EXIT

    echo "Waiting for Wails dev server on :34115..."
    for i in $(seq 1 120); do
      if curl -sf http://localhost:34115 > /dev/null 2>&1; then
        echo "Dev server ready."
        break
      fi
      if [ "$i" -eq 120 ]; then
        echo "Timeout: dev server did not start within 120s."
        exit 1
      fi
      sleep 1
    done

    cd e2e/desktop && npx playwright test

    mkdir -p assets
    SCREENSHOT=$(find assets/playwright-results -name '*.png' 2>/dev/null | head -1)
    if [ -n "$SCREENSHOT" ]; then
      cp "$SCREENSHOT" assets/demo-desktop.png
      echo "Screenshot saved to assets/demo-desktop.png"
    fi
    VIDEO=$(find assets/playwright-results -name 'video.webm' 2>/dev/null | head -1)
    if [ -n "$VIDEO" ]; then
      cp "$VIDEO" assets/demo-desktop.webm
      echo "Video saved to assets/demo-desktop.webm"
    fi
