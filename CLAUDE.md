# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Existing guidance to keep

- Default to Bun for local development in this repo.
- Prefer `bun run ...`, `bun test`, and `bun install` over Node/npm/yarn/pnpm commands when operating on this CLI itself.

## Common commands

- Install dependencies: `bun install`
- Run the CLI entrypoint directly: `bun run src/index.ts`
- Run via package script: `bun run dev`
- Show CLI help: `bun run src/index.ts --help`
- Show help for a subcommand: `bun run src/index.ts plugin --help`
- Typecheck this repo: `bunx tsc --noEmit`

There is currently no dedicated test script in `package.json` and no in-repo test suite yet. If tests are added with Bun, run them with `bun test`.

## High-level architecture

This repository is a Bun/TypeScript CLI for creating and managing FastAPI Best Architecture projects. The CLI itself is implemented in `src/`, while generated plugin scaffolds live in `templates/`.

### CLI entry and command routing

- `src/index.ts` is the single Commander entrypoint. It wires global flags (`--project`, `--lang`) and lazily imports command handlers for each subcommand.
- Command groups are organized around user workflows rather than technical layers:
  - project lifecycle: `create`, `list`, `remove`, `current`, `use`, `edit`, `go`
  - development helpers: `dev`, `dev:web`, `dev:celery`
  - plugin management: `plugin add|remove|create|list`
  - infrastructure helpers: `infra start|stop`
  - config mutation: `config set`

### State and config model

The CLI persists two JSON config layers:

- global config in `~/.fba.json`, managed by `src/lib/config.ts`
  - stores language, current project, registered projects, and optional shell preference
- per-project config in `<project>/.fba.json`, also managed by `src/lib/config.ts`
  - stores backend/frontend directory names, ports, and whether infra was provisioned

Most commands resolve the active project through `resolveProjectDir()`/`requireProjectDir()` semantics: explicit `--project` wins, otherwise the current project from global config is used.

### Create flow

`src/commands/create.ts` is the largest orchestration path and defines the mental model for the product:

1. interactive onboarding and first-run language selection
2. local environment checks (`python3`, `uv`, `pnpm`, optional `docker`) via `src/lib/env-check.ts`
3. cloning the canonical backend and frontend starter repositories
4. optional infra generation under `<project>/infra` via `src/lib/infra.ts`
5. backend/frontend initialization and env file generation
6. registration of the created project into `~/.fba.json`

The create flow also includes rollback cleanup logic; if provisioning fails after the project directory is created, it removes the partially created project and tears down compose services if needed.

### Process execution boundary

All shelling out is funneled through `src/lib/process.ts`:

- `run()` wraps `execa` for buffered commands, optional spinners, and truncated error output
- `runInherited()` is used when the child process should own stdio, such as `fba dev`
- tool/environment detection also uses this layer

If you need to add a new command that invokes external tools, follow this pattern instead of calling `execa` ad hoc.

### Plugin system

Plugin support is split across three concerns:

- marketplace fetch/filter logic in `src/lib/plugin-market.ts`
  - downloads a TypeScript data file from the upstream `fastapi-practices/plugins` repo and extracts `pluginDataList`
- local install/remove/scan logic in `src/lib/plugin-install.ts`
  - frontend plugins are copied into the generated frontend under `apps/web-antdv-next/src/plugins`
  - backend plugins live under `backend/plugin`
  - backend plugin install/remove delegates to the generated backend's own `uv run fba ...` commands
- local plugin scaffolding in `src/commands/plugin/create.ts` + `src/lib/template.ts`
  - templates are copied from `templates/server` or `templates/web`
  - `{{var}}` placeholders are replaced in both filenames and file contents
  - server templates choose between `plugin.app.toml` and `plugin.ext.toml`, then rename the selected file to `plugin.toml`

Plugin metadata contracts are defined in `src/types/plugin.ts`; `plugin.toml` is the source of truth for installed plugin metadata.

### Templates

`templates/` contains scaffold content that is copied into generated projects, not code executed by this CLI directly.

- `templates/server/` is the backend plugin template
- `templates/web/` is the frontend plugin template

When changing template behavior, inspect both the template files and `src/lib/template.ts`, because the runtime assumes specific filenames and placeholder conventions.

### Internationalization

User-facing copy is centralized in `src/lib/i18n.ts`. `src/index.ts` initializes language from global config before registering commands, so command descriptions and interactive prompts come from the same translation table.

When adding a user-visible string, update both `zh` and `en` entries in `src/lib/i18n.ts`.

## Important implementation notes

- The repo uses Bun to run the CLI, but the generated projects intentionally invoke external ecosystem tools like `uv`, `pnpm`, `git`, and `docker`; do not “Bun-convert” those generated-project workflows unless the product behavior itself is changing.
- `src/lib/config.ts` also defines canonical path helpers for backend/frontend/plugin/infra directories. Reuse those helpers instead of rebuilding paths inline.
- This repo currently mixes Bun-first guidance with some Node-style libraries (`execa`, `fs`, `path`) in the implementation; preserve existing patterns unless you are intentionally refactoring the CLI internals.
