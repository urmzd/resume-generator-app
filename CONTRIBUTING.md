# Contributing

Thanks for your interest in contributing to **resume-generator-app**.

## Prerequisites

- **Go 1.24+**
- **Node.js 22+**
- **[Wails CLI](https://wails.io/docs/gettingstarted/installation)**
- **[just](https://github.com/casey/just)** — command runner
- **[GH_TOKEN](https://cli.github.com/)** — GitHub CLI authentication (for releases)

## Getting Started

```sh
git clone https://github.com/urmzd/resume-generator-app.git
cd resume-generator-app
just init
```

## Development

| Command | What it does |
|---------|-------------|
| `just dev` | Start Wails dev server with hot reload |
| `just dev-clean` | Clean caches, rebuild frontend, then dev |
| `just build` | Build production binary |
| `just demo-desktop` | Run e2e tests and capture screenshots |

### Go Backend

- `gofmt` for formatting
- `go test ./...` for testing
- `go vet ./...` for static analysis

### React Frontend

- `npm install` in `frontend/`
- Standard React + TypeScript + Tailwind CSS tooling

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced via [gitit](https://github.com/urmzd/gitit):

| Prefix | Purpose |
|--------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Refactoring |
| `test` | Tests |
| `chore` | Maintenance |
| `ci` | CI changes |

Format: `type(scope): description`

## Pull Requests

1. Fork the repository
2. Create a feature branch (`feat/your-feature`)
3. Make your changes and ensure tests pass
4. Push to your fork and open a Pull Request
5. Keep PRs focused — one logical change per PR

## Code Style

- **Go**: `gofmt`, `go vet`, standard Go conventions
- **Frontend**: React + TypeScript + Tailwind CSS
- Wails bindings auto-generated from exported Go methods
