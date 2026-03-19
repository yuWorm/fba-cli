// errors.ts — 统一错误处理
import chalk from 'chalk'
import { existsSync } from 'fs'
import { resolveProjectDir, readProjectConfig, getBackendDir, getFrontendDir } from './config.js'
import { t } from './i18n.js'

/**
 * 输出错误信息并退出
 */
export function fatal(message: string, hint?: string): never {
  console.error(chalk.red(`\n  ✗ ${message}`))
  if (hint) {
    console.error(chalk.dim(`    ${hint}`))
  }
  console.error()
  process.exit(1)
}

/**
 * 输出警告信息
 */
export function warn(message: string, hint?: string): void {
  console.warn(chalk.yellow(`  ⚠ ${message}`))
  if (hint) {
    console.warn(chalk.dim(`    ${hint}`))
  }
}

/**
 * 验证并返回项目目录，不存在则退出
 */
export function requireProjectDir(cliProjectDir?: string): string {
  const projectDir = resolveProjectDir(cliProjectDir)
  if (!projectDir) {
    fatal(
      t('projectNoCurrent'),
      'Run "fba create" to create a project, or "fba use" to set a default project.',
    )
  }
  if (!existsSync(projectDir)) {
    fatal(
      `Project directory does not exist: ${projectDir}`,
      'Run "fba remove" to clean up, or "fba create" to create a new project.',
    )
  }
  return projectDir
}

/**
 * 验证后端目录存在
 */
export function requireBackendDir(projectDir: string): string {
  const backendDir = getBackendDir(projectDir)
  if (!existsSync(backendDir)) {
    const config = readProjectConfig(projectDir)
    fatal(
      `Backend directory not found: ${config.backend_name}`,
      `Expected at: ${backendDir}`,
    )
  }
  return backendDir
}

/**
 * 验证前端目录存在
 */
export function requireFrontendDir(projectDir: string): string {
  const frontendDir = getFrontendDir(projectDir)
  if (!existsSync(frontendDir)) {
    const config = readProjectConfig(projectDir)
    fatal(
      `Frontend directory not found: ${config.frontend_name}`,
      `Expected at: ${frontendDir}`,
    )
  }
  return frontendDir
}
