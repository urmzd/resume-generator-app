#!/usr/bin/env bash
set -euo pipefail

REPO="urmzd/resume-generator-app"
INSTALL_DIR="$HOME/.local/bin"

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Darwin) PLATFORM="darwin" ;;
  Linux)  PLATFORM="linux" ;;
  *)
    echo "Error: Unsupported OS '$OS'. This script supports macOS and Linux." >&2
    echo "Windows users: download from https://github.com/$REPO/releases" >&2
    exit 1
    ;;
esac

# Check dependencies
if ! command -v curl &>/dev/null; then
  echo "Error: curl is required but not installed." >&2
  exit 1
fi

if [ "$PLATFORM" = "darwin" ] && ! command -v unzip &>/dev/null; then
  echo "Error: unzip is required on macOS but not installed." >&2
  exit 1
fi

# Fetch latest release tag
echo "Fetching latest release..."
RELEASE_JSON="$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest")"
TAG="$(echo "$RELEASE_JSON" | grep '"tag_name"' | head -1 | sed 's/.*: *"//;s/".*//')"

if [ -z "$TAG" ]; then
  echo "Error: Could not determine latest release tag." >&2
  exit 1
fi

echo "Latest release: $TAG"

# Download and install
TMPDIR_INSTALL="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_INSTALL"' EXIT

if [ "$PLATFORM" = "darwin" ]; then
  ASSET_URL="https://github.com/$REPO/releases/download/$TAG/resume-generator-app-darwin.zip"
  echo "Downloading $ASSET_URL..."
  curl -fsSL -o "$TMPDIR_INSTALL/resume-generator-app-darwin.zip" "$ASSET_URL"
  unzip -q "$TMPDIR_INSTALL/resume-generator-app-darwin.zip" -d "$TMPDIR_INSTALL"

  APP_BUNDLE="$(find "$TMPDIR_INSTALL" -name '*.app' -maxdepth 2 | head -1)"
  if [ -z "$APP_BUNDLE" ]; then
    echo "Error: .app bundle not found in archive." >&2
    exit 1
  fi

  DEST="/Applications/$(basename "$APP_BUNDLE")"
  echo "Installing to $DEST..."
  rm -rf "$DEST"
  cp -R "$APP_BUNDLE" "$DEST"
  echo "Installed resume-generator-app ($TAG) to $DEST"
else
  ASSET_URL="https://github.com/$REPO/releases/download/$TAG/resume-generator-app-gnu"
  echo "Downloading $ASSET_URL..."
  curl -fsSL -o "$TMPDIR_INSTALL/resume-generator-app" "$ASSET_URL"
  BINARY="$TMPDIR_INSTALL/resume-generator-app"

  if [ ! -f "$BINARY" ]; then
    echo "Error: Binary not found after download." >&2
    exit 1
  fi

  mkdir -p "$INSTALL_DIR"
  cp "$BINARY" "$INSTALL_DIR/resume-generator-app"
  chmod +x "$INSTALL_DIR/resume-generator-app"
  echo "Installed resume-generator-app ($TAG) to $INSTALL_DIR/resume-generator-app"

  # Check PATH
  case ":$PATH:" in
    *":$INSTALL_DIR:"*) ;;
    *)
      echo ""
      echo "WARNING: $INSTALL_DIR is not in your PATH."
      echo "Add it by appending this line to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
      echo ""
      echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
      echo ""
      ;;
  esac
fi
