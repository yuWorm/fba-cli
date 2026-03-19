# fba-cli

[English](./README_en.md)

> **主项目**: [fastapi-best-architecture](https://github.com/fastapi-practices/fastapi-best-architecture)  
> **文档**: [https://fastapi-practices.github.io/fastapi_best_architecture_docs/](https://fastapi-practices.github.io/fastapi_best_architecture_docs/)

## 简介

`fba-cli` 是 [fastapi-best-architecture](https://github.com/fastapi-practices/fastapi-best-architecture) 的 CLI 工具，用于一键创建、配置、管理和运行 FBA 项目。提供交互式引导流程和插件市场，大幅简化项目初始化和日常开发操作。

## 特性

- 🚀 **交互式项目创建** — 引导式流程完成环境检测、仓库克隆、基础设施部署和项目初始化
- 🐳 **开发基础设施管理** — 自动生成并管理 Docker Compose 开发环境（PostgreSQL / Redis / RabbitMQ）
- 🔌 **插件生态系统** — 内置插件市场，支持搜索、安装、创建和移除前后端插件
- 🌐 **国际化 (i18n)** — 完整的中英文双语支持
- 📦 **多项目管理** — 注册、切换和管理多个 FBA 项目

## 环境要求

### 运行已发布 CLI

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.10+
- [uv](https://github.com/astral-sh/uv)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)（基础设施管理需要）

### 开发此仓库

- [Bun](https://bun.sh)

## 安装

### 使用 npm 安装

```bash
npm install -g fba-cli
```

安装后可直接运行：

```bash
fba-cli --help
```

### 从源码开发

```bash
# 克隆仓库
git clone https://github.com/fastapi-practices/fba-cli.git
cd fba-cli

# 安装依赖
bun install
```

## 快速开始

```bash
# 运行 CLI（默认执行 create 命令）
bun run dev

# 或直接执行
bun run src/index.ts
```

## 命令概览

### `fba-cli create`（默认命令）

交互式创建新的 FBA 项目：

1. 检测环境依赖（Python、pnpm、uv、npm），缺失可选安装
2. 输入项目名称及前后端目录名称
3. 克隆前后端仓库
4. 可选创建 Docker 开发基础设施（PostgreSQL / Redis / RabbitMQ）
5. 配置数据库、Redis、RabbitMQ 等连接参数并写入 `.env`
6. 初始化前端依赖（`pnpm install`）和后端环境（`uv sync` + `uv run fba init`）
7. 可选安装插件市场中的第三方插件

### `fba-cli dev`

启动后端开发服务器。

```bash
fba-cli dev [--host <host>] [--port <port>] [--no-reload] [--workers <n>]
```

- 自动检测基础设施（infra）状态并在需要时启动
- 端口默认使用项目配置 `.fba.json` 中的 `server_port`

### `fba-cli dev:web`

启动前端开发服务器。

```bash
fba-cli dev:web [--host <host>] [--port <port>]
```

### `fba-cli dev:celery <subcommand>`

启动 Celery 服务。

```bash
fba-cli dev:celery worker   # Celery worker
fba-cli dev:celery beat     # Celery beat
fba-cli dev:celery flower   # Celery flower
```

### `fba-cli plugin`

插件管理子命令组：

| 子命令 | 说明 |
|---|---|
| `plugin add` | 从市场或本地添加插件（支持 `-b` 后端 / `-f` 前端） |
| `plugin remove` | 移除已安装的插件 |
| `plugin create` | 从模板创建新插件（前端 / 后端 / 前后端） |
| `plugin list` | 列出已安装的前后端插件 |

**插件市场**支持搜索和筛选，数据源来自 [fastapi-practices/plugins](https://github.com/fastapi-practices/plugins)。

### 项目管理

| 命令 | 说明 |
|---|---|
| `list` | 列出所有已注册的项目 |
| `current` | 显示当前默认项目 |
| `use` | 切换默认项目 |
| `remove` | 从注册表中移除项目 |
| `edit` | 编辑全局配置文件 `~/.fba.json` |
| `go` | 进入当前项目目录 |

### 基础设施管理

| 命令 | 说明 |
|---|---|
| `infra start` | 启动 Docker Compose 开发基础设施 |
| `infra stop` | 停止 Docker Compose 开发基础设施 |

### 配置管理

```bash
fba-cli config set   # 交互式设置配置项
```

## 全局选项

```bash
-p, --project <dir>   指定项目目录（默认使用 current 项目）
--lang <lang>          语言切换 (zh/en)
-h, --help             显示帮助信息
-v, --version          显示版本号
```

## 配置文件

- **全局配置**: `~/.fba.json` — 存储语言偏好、项目注册表和当前默认项目
- **项目配置**: `<project>/.fba.json` — 存储前后端目录名、服务端口等项目级设置

## 技术栈

- **运行时**: [Bun](https://bun.sh)（兼容 Node.js）
- **语言**: TypeScript
- **CLI 框架**: [Commander.js](https://github.com/tj/commander.js)
- **交互式 TUI**: [@clack/prompts](https://github.com/bombshell-dev/clack)
- **子进程**: [execa](https://github.com/sindresorhus/execa)
- **HTTP 请求**: [ofetch](https://github.com/unjs/ofetch)
- **TOML 解析**: [smol-toml](https://github.com/nicolo-ribaudo/smol-toml)

## 许可证

MIT
