# Contributing

## Overview

`fba-cli` is the CLI for `fastapi-best-architecture`. This document collects development, usage, and command details that are intentionally kept out of the main README files.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.10+
- [uv](https://github.com/astral-sh/uv)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) for infrastructure management
- [pnpm](https://pnpm.io/) or [Bun](https://bun.sh) for developing this repository

## Develop From Source

```bash
git clone https://github.com/fastapi-practices/fba-cli.git
cd fba-cli
```

Install dependencies with either package manager:

```bash
pnpm install
```

```bash
bun install
```

Run the CLI in development:

```bash
pnpm dev
```

```bash
bun run dev
```

## Command Overview

- `create`: create a new project, default command
- `dev`: start backend dev server
- `dev:web`: start frontend dev server
- `dev:celery <worker|beat|flower>`: start Celery services
- `plugin add|remove|create|list`: plugin management
- `list|current|use|remove|edit|go`: project management
- `infra start|stop`: infrastructure management
- `config set`: update global config

## Global Options

```text
-p, --project <dir>   Specify project directory (defaults to current project)
--lang <lang>         Switch language (zh/en)
-h, --help            Show help
-v, --version         Show version
```

## Configuration Files

- Global config: `~/.fba.json`
- Project config: `<project>/.fba.json`

## Development Scripts

Use `pnpm`:

```bash
pnpm dev
pnpm typecheck
pnpm build
```

Use `bun`:

```bash
bun run dev
bun run typecheck
bun run build
```
