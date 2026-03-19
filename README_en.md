# fba-cli

[中文](./README.md)

> **Main Project**: [fastapi-best-architecture](https://github.com/fastapi-practices/fastapi-best-architecture)  
> **Docs**: [https://fastapi-practices.github.io/fastapi_best_architecture_docs/](https://fastapi-practices.github.io/fastapi_best_architecture_docs/)

## Introduction

`fba-cli` is a CLI tool for [fastapi-best-architecture](https://github.com/fastapi-practices/fastapi-best-architecture). It provides a streamlined way to create, configure, manage, and run FBA projects with an interactive guided flow and a built-in plugin marketplace.

## Features

- 🚀 **Interactive Project Creation** — Guided flow for environment detection, repository cloning, infrastructure setup, and project initialization
- 🐳 **Dev Infrastructure Management** — Auto-generate and manage Docker Compose dev environments (PostgreSQL / Redis / RabbitMQ)
- 🔌 **Plugin Ecosystem** — Built-in plugin marketplace with search, install, create, and remove capabilities for both frontend and backend plugins
- 🌐 **Internationalization (i18n)** — Full Chinese and English language support
- 📦 **Multi-project Management** — Register, switch between, and manage multiple FBA projects

## Prerequisites

### Run the published CLI

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.10+
- [uv](https://github.com/astral-sh/uv)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (required for infrastructure management)

### Develop this repository

- [Bun](https://bun.sh)

## Installation

### Install with npm

```bash
npm install -g fba-cli
```

Then run:

```bash
fba-cli --help
```

### Develop from source

```bash
# Clone the repository
git clone https://github.com/fastapi-practices/fba-cli.git
cd fba-cli

# Install dependencies
bun install
```

## Quick Start

```bash
# Run the CLI (defaults to the create command)
bun run dev

# Or run directly
bun run src/index.ts
```

## Commands

### `fba-cli create` (Default Command)

Interactively create a new FBA project:

1. Detect environment dependencies (Python, pnpm, uv, npm) with optional auto-install
2. Enter project name and frontend/backend directory names
3. Clone frontend and backend repositories
4. Optionally create Docker dev infrastructure (PostgreSQL / Redis / RabbitMQ)
5. Configure database, Redis, RabbitMQ connection parameters and write to `.env`
6. Initialize frontend dependencies (`pnpm install`) and backend environment (`uv sync` + `uv run fba init`)
7. Optionally install third-party plugins from the marketplace

### `fba-cli dev`

Start the backend development server.

```bash
fba-cli dev [--host <host>] [--port <port>] [--no-reload] [--workers <n>]
```

- Automatically checks and starts infrastructure (infra) if needed
- Default port reads from project config `.fba.json` (`server_port`)

### `fba-cli dev:web`

Start the frontend development server.

```bash
fba-cli dev:web [--host <host>] [--port <port>]
```

### `fba-cli dev:celery <subcommand>`

Start Celery services.

```bash
fba-cli dev:celery worker   # Celery worker
fba-cli dev:celery beat     # Celery beat
fba-cli dev:celery flower   # Celery flower
```

### `fba-cli plugin`

Plugin management subcommands:

| Subcommand | Description |
|---|---|
| `plugin add` | Add a plugin from marketplace or local source (`-b` backend / `-f` frontend) |
| `plugin remove` | Remove an installed plugin |
| `plugin create` | Create a new plugin from template (frontend / backend / both) |
| `plugin list` | List installed frontend and backend plugins |

The **Plugin Marketplace** supports search and filtering, powered by [fastapi-practices/plugins](https://github.com/fastapi-practices/plugins).

### Project Management

| Command | Description |
|---|---|
| `list` | List all registered projects |
| `current` | Show the current default project |
| `use` | Switch the default project |
| `remove` | Remove a project from the registry |
| `edit` | Edit the global config file `~/.fba.json` |
| `go` | Navigate to the current project directory |

### Infrastructure Management

| Command | Description |
|---|---|
| `infra start` | Start Docker Compose dev infrastructure |
| `infra stop` | Stop Docker Compose dev infrastructure |

### Configuration Management

```bash
fba-cli config set   # Interactively set configuration options
```

## Global Options

```bash
-p, --project <dir>   Specify project directory (defaults to current project)
--lang <lang>          Switch language (zh/en)
-h, --help             Show help
-v, --version          Show version
```

## Configuration Files

- **Global config**: `~/.fba.json` — Stores language preference, project registry, and current default project
- **Project config**: `<project>/.fba.json` — Stores frontend/backend directory names, server ports, and other project-level settings

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) (Node.js compatible)
- **Language**: TypeScript
- **CLI Framework**: [Commander.js](https://github.com/tj/commander.js)
- **Interactive TUI**: [@clack/prompts](https://github.com/bombshell-dev/clack)
- **Subprocess**: [execa](https://github.com/sindresorhus/execa)
- **HTTP Client**: [ofetch](https://github.com/unjs/ofetch)
- **TOML Parsing**: [smol-toml](https://github.com/nicolo-ribaudo/smol-toml)

## License

MIT
