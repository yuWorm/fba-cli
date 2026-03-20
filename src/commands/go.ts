// go.ts — 进入项目目录 (启动子 shell)
import chalk from 'chalk'
import { existsSync } from 'fs'
import { readGlobalConfig } from '../lib/config.js'
import { t } from '../lib/i18n.js'
import { fatal } from '../lib/errors.js'
import { getDefaultShell, getShellArgs } from '../lib/platform.js'
import { execa } from 'execa'

export async function goAction(options: { shell?: string }) {
  const config = readGlobalConfig()

  if (!config.current) {
    fatal(t('projectNoCurrent'), 'Run "fba use" to set a default project.')
  }

  const projectPath = config.current!
  if (!existsSync(projectPath)) {
    fatal(
      `Project directory does not exist: ${projectPath}`,
      'Run "fba remove" to clean up, or "fba create" to create a new project.',
    )
  }
  // 优先级：命令行 --shell > 全局配置 shell > 平台默认 shell
  const shell = options.shell || config.shell || getDefaultShell()

  console.log(chalk.cyan(`\n  📂 Entering project: ${projectPath}`))
  console.log(chalk.dim(`     Shell: ${shell}`))
  console.log(chalk.dim(`     Type "exit" or Ctrl+D to return\n`))

  // 启动交互式子 shell，CWD 设为项目目录
  try {
    await execa(shell, getShellArgs(), {
      cwd: projectPath,
      stdio: 'inherit',
      env: {
        ...process.env,
        FBA_PROJECT: projectPath,
      },
    })
  } catch {
    // 用户退出子 shell，正常行为
  }
}
