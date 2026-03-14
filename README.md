<p align="center">
  <h1 align="center">Resume Generator App</h1>
  <p align="center">
    A native desktop app for building polished resumes with live PDF preview, template gallery, and inline editing.
    <br />
    Built with <a href="https://wails.io">Wails</a>, <a href="https://react.dev">React</a>, and <a href="https://tailwindcss.com">Tailwind CSS</a>.
    <br /><br />
    <a href="https://github.com/urmzd/resume-generator-app/releases">Download</a>
    &middot;
    <a href="https://github.com/urmzd/resume-generator-app/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/urmzd/resume-generator">CLI Version</a>
  </p>
</p>

<br />

<p align="center">
  <img src="assets/demo-desktop.png" alt="Resume Generator App — gallery view with live PDF preview" width="90%">
</p>

<br />

## Features

- **Live PDF Preview** — see your resume rendered in real time as you switch templates
- **Template Gallery** — browse and compare LaTeX, HTML, DOCX, and Markdown templates side by side
- **Inline Editor** — edit resume content directly in the app with instant validation
- **Native File Picker** — open YAML, JSON, TOML, or Markdown resume files via drag-and-drop or system dialog
- **Export** — save as PDF, DOCX, HTML, or LaTeX with a single click
- **Dark Mode** — toggle between light and dark themes
- **Cross-Platform** — runs on macOS, Linux, and Windows

## Template Showcase

<p align="center">
  <img src="assets/example_results/modern-html.png" alt="Modern HTML" width="30%">
  &nbsp;
  <img src="assets/example_results/modern-latex.png" alt="Modern LaTeX" width="30%">
  &nbsp;
  <img src="assets/example_results/modern-cv.png" alt="Modern CV" width="30%">
</p>
<p align="center">
  <em>Modern HTML &nbsp;&middot;&nbsp; Modern LaTeX &nbsp;&middot;&nbsp; Modern CV</em>
</p>

## Install

### Pre-built Binaries

Download the latest release for your platform from the [Releases](https://github.com/urmzd/resume-generator-app/releases) page.

### Build from Source

**Prerequisites:** Go 1.24+, Node.js 22+, [Wails CLI](https://wails.io/docs/gettingstarted/installation)

```bash
git clone https://github.com/urmzd/resume-generator-app.git
cd resume-generator-app
just init    # install deps + Playwright
just build   # production binary → build/bin/
```

## Usage

Launch the app (no arguments) to open the GUI:

```bash
./build/bin/resume-generator-app
```

1. **Open** a resume file (YAML, JSON, TOML, or Markdown) via drag-and-drop or the file picker
2. **Browse** templates in the gallery strip at the bottom
3. **Edit** resume content inline with the editor panel
4. **Export** as PDF, DOCX, HTML, or LaTeX

## Development

```bash
just dev          # Wails dev server with hot reload
just dev-clean    # clean caches, rebuild frontend, then dev
just demo-desktop # run e2e tests and capture screenshots
```

## Data Format

Resume data is defined in YAML, JSON, or TOML. See [`assets/example_resumes/software_engineer.yml`](assets/example_resumes/software_engineer.yml) for a complete example.

The data model is provided by the [resume-generator](https://github.com/urmzd/resume-generator) library, which this app depends on for all generation logic.

## Architecture

```
resume-generator-app
├── main.go          # Entry point — Wails app + CLI fallback
├── app.go           # Go backend: file I/O, template listing, PDF generation
├── templates.go     # Embedded template FS
├── templates/       # Resume templates (html, latex, docx, markdown)
├── frontend/        # React + TypeScript + Tailwind UI
│   └── src/
│       ├── pages/         # DropPage, GalleryPage
│       ├── components/    # PdfViewer, ThumbnailStrip, editor panels
│       └── containers/    # GalleryContainer (state management)
├── e2e/desktop/     # Playwright e2e tests
└── scripts/         # Shell scripts for dev tasks
```

## Related

- [resume-generator](https://github.com/urmzd/resume-generator) — the CLI tool and Go library that powers resume generation

## License

Apache 2.0
