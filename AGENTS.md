# AGENTS.md

## Identity

You are an agent working on **resume-generator-app** — a native desktop app for building polished resumes with live PDF preview, template gallery, and inline editing. Built with Wails (Go backend) + React/TypeScript/Tailwind CSS frontend.

## Architecture

Wails desktop app with Go backend and React frontend:

| Layer | Path | Role |
|-------|------|------|
| Entry | `main.go` | Wails app (no args) or CLI fallback (with args) |
| Backend | `app.go` | Go backend: file I/O, template listing, PDF generation, validation |
| Templates | `templates.go`, `templates/` | Embedded template filesystem |
| Frontend | `frontend/src/` | React + TypeScript + Tailwind UI |
| E2E Tests | `tests/e2e/` | Playwright tests + demo recording |

```
resume-generator-app
├── main.go              # Entry point: Wails app or CLI fallback
├── app.go               # Go backend (Wails-bound methods)
├── templates.go         # Embedded template FS
├── templates/           # Resume templates (html, latex, docx, markdown)
├── frontend/
│   └── src/
│       ├── pages/       # DropPage, GalleryPage
│       ├── components/  # PdfViewer, ThumbnailStrip, AppHeader, ThemeToggle
│       │   └── editor/  # Contact, Experience, Education, Skills, Projects,
│       │                # Certifications, Languages, Layout, Summary editors
│       ├── containers/  # GalleryContainer (PDF caching, background generation)
│       ├── hooks/       # useResumeEditor (draft state, validation, save)
│       └── lib/         # Theme provider, PDF cache, utilities
├── tests/e2e/           # Playwright e2e tests
└── scripts/             # Shell scripts for dev tasks
```

## Key Files

- `main.go` — Entry point; routes to Wails GUI or CLI
- `app.go` — Go backend with Wails-bound methods (OpenFile, GeneratePDF, ListTemplates, etc.)
- `templates.go` — `//go:embed` for template filesystem
- `frontend/src/pages/GalleryPage.tsx` — Main gallery view with template browsing
- `frontend/src/pages/DropPage.tsx` — File drop/open page
- `frontend/src/containers/GalleryContainer.tsx` — PDF caching and background generation
- `frontend/src/hooks/useResumeEditor.ts` — Draft state, validation, save logic
- `frontend/src/components/editor/` — Inline resume field editors
- `wails.json` — Wails project configuration
- `justfile` — Task runner

## Commands

| Task | Command |
|------|---------|
| Init | `just init` (git hooks, Go deps, frontend deps, Playwright) |
| Dev | `just dev` (Wails dev server with hot reload) |
| Dev (clean) | `just dev-clean` (clean caches, rebuild frontend, then dev) |
| Build | `just build` (production binary) |
| Demo | `just demo-desktop` (e2e tests + screenshots) |

## Code Style

- **Go**: standard `gofmt`, `go vet` conventions; Apache-2.0 license
- **Frontend**: React + TypeScript strict mode + Tailwind CSS
- Wails auto-generates TypeScript bindings from exported Go methods
- Depends on `github.com/urmzd/resume-generator` for all generation logic
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
