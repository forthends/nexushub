# Developer Toolbox

A desktop developer toolbox application built with Tauri + React + TypeScript + TailwindCSS.

![Dark/Light Theme](https://img.shields.io/badge/theme-light%2Fdark-blue?style=for-the-badge)

## Features

### Included Tools

| Tool | Description |
|------|-------------|
| **JSON Formatter** | Format, validate and beautify JSON data with syntax highlighting |
| **Timestamp Converter** | Convert between Unix timestamps and human-readable dates |
| **SQL Formatter** | Format and beautify SQL queries with keyword uppercasing and indentation |
| **API Client** | Test and debug HTTP APIs with support for GET/POST/PUT/DELETE/PATCH |
| **Todos** | Task management with localStorage persistence |

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | TailwindCSS 3 + bits-ui |
| State/Data | TanStack React Query |
| Forms | React Hook Form + Zod |
| Desktop Runtime | Tauri 2 (Rust) |
| Internationalization | i18next + react-i18next |

### Project Structure

```
├── src/
│   ├── components/
│   │   └── ui/              # Reusable UI components (Button, Card, Input, Tabs, etc.)
│   ├── tools/                # Tool implementations
│   │   ├── json-formatter/
│   │   ├── timestamp/
│   │   ├── sql-formatter/
│   │   ├── api-client/
│   │   └── todos/
│   ├── lib/                  # Utilities (i18n, query-client, utils)
│   ├── App.tsx               # Root component with tool routing
│   └── main.tsx              # Entry point
├── src-tauri/
│   ├── src/
│   │   ├── main.rs           # Rust entry point
│   │   └── lib.rs            # Tauri plugin configuration
│   ├── capabilities/         # Tauri 2 permission capabilities
│   └── tauri.conf.json       # Tauri app configuration
└── tailwind.config.js        # TailwindCSS + color system configuration
```

### Design System

The app uses a CSS variable-based color system defined in `src/index.css`:

| Variable | Purpose |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Text color |
| `--primary` | Primary accent color |
| `--secondary` | Secondary color |
| `--muted` | Muted/disabled elements |
| `--border` | Border color |
| `--card` | Card background |
| `--destructive` | Error/danger color |

Light theme is the default. Dark mode can be enabled via Tailwind's `darkMode: "class"`.

### Data Persistence

- **Todos**: Persisted via localStorage (`toolbox-todos` key)
- **API Client**: No persistence (ephemeral requests)
- **JSON/SQL Formatter**: No persistence (clipboard-based workflow)
- **Timestamp**: Uses system time only

## Development

### Prerequisites

- Node.js 18+
- Rust 1.70+ (for Tauri)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start dev server (Vite + Tauri)
npm run tauri dev

# Or start frontend only (http://localhost:1420)
npm run dev

# Build for production
npm run tauri build
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build frontend with TypeScript |
| `npm run preview` | Preview production build |
| `npm run tauri dev` | Start Tauri app in dev mode |
| `npm run tauri build` | Build Tauri app for distribution |

## Tauri Plugins

The app uses these Tauri 2 plugins:

- `tauri-plugin-opener` - Open URLs in browser
- `tauri-plugin-updater` - Auto-update functionality
- `tauri-plugin-process` - Process management
- `tauri-plugin-dialog` - Native dialogs
- `tauri-plugin-store` - Persistent key-value storage
- `tauri-plugin-log` - Logging

## License

MIT
