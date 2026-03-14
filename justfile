# Resume Generator App

default:
    @just --list

# Initialize dev environment: git hooks, Go deps, frontend deps, Playwright
init:
    ./scripts/init.sh

# Start Wails dev server with hot reload
dev:
    wails dev

# Clean frontend caches and start dev server
dev-clean:
    ./scripts/dev-clean.sh

# Build production binary with version info
build version="dev" commit="none" date="unknown":
    wails build -trimpath -ldflags "-X main.version={{version}} -X main.commit={{commit}} -X main.date={{date}}"

# Run desktop e2e demo: start Wails dev, run Playwright, copy artifacts
demo-desktop:
    ./scripts/demo-desktop.sh
