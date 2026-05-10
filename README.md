# rs-docs

A unified documentation website for all Rust libraries in this repository, built as a single-page application with
markdown rendering.

## Covered Libraries

| Library | Description |
|---------|-------------|
| [rslog](https://github.com/Cnkrru/rslog) | A lightweight, zero-dependency logging library |
| [rscsv](https://github.com/Cnkrru/rust-package) | A simple CSV library with RFC 4180 support |
| [rstime](https://github.com/Cnkrru/rust-package) | A zero-dependency enhanced time library |
| [rserror](https://github.com/Cnkrru/rust-package) | A simplified error handling library |

## Project Structure

```
rs-docs/
├── index.html          # Entry point - single page application
├── style.css           # Stylesheet with sidebar accordion and project themes
├── main.js             # JavaScript for navigation, markdown rendering, PJAX routing
├── rslog/              # rslog documentation (Markdown)
│   ├── 1-INDEX.md      # Home page / overview
│   ├── 2-README.md     # Quick start guide
│   └── 3-API_GUIDE.md  # API reference
├── rscsv/              # rscsv documentation (Markdown)
│   ├── 1-INDEX.md
│   ├── 2-README.md
│   └── 3-API_GUIDE.md
└── rstime/             # rstime documentation (Markdown)
    ├── 1-INDEX.md
    ├── 2-README.md
    └── 3-API_GUIDE.md
└── rserror/            # rserror documentation (Markdown)
    ├── 1-INDEX.md
    ├── 2-README.md
    └── 3-API_GUIDE.md
```

## Features

- **Single Page Application**: All content loaded dynamically via PJAX-style navigation
- **Collapsible Sidebar**: Accordion-style project navigation
- **Markdown Rendering**: Uses [marked.js](https://marked.js.org/) for markdown-to-HTML conversion
- **Syntax Highlighting**: Uses [highlight.js](https://highlightjs.org/) for code block highlighting
- **Hash-based Routing**: Page state is preserved in the URL hash for bookmarking and sharing
- **Loading Indicator**: Visual progress bar for content loading
- **Project Themes**: Each project has its own accent color (rslog: orange, rscsv: blue, rstime: purple, rserror: red)

## Usage

Open `index.html` in any modern browser, or serve via any HTTP server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .
```

Then navigate to `http://localhost:8080`.

## Technology

- Pure HTML, CSS, and JavaScript — no build tools required
- CDN-hosted dependencies: [marked.js](https://www.jsdelivr.com/package/npm/marked) and [highlight.js](https://www.jsdelivr.com/package/npm/highlight.js)

## License

MIT License