// infra-start.ts — 启动基础设施
import chalk from 'chalk'
import { existsSync } from 'fs'
import { getInfraDir } from '../lib/config.js'
import { requireProjectDir, fatal } from '../lib/errors.js'
import { composeUp, isComposeRunning } from '../lib/docker.js'

export async function infraStartAction(options: { project?: string }) {
  const projectDir = requireProjectDir(options.project)
  const infraDir = getInfraDir(projectDir)

  if (!existsSync(infraDir)) {
    fatal('Infrastructure directory not found', `Expected at: ${infraDir}`)
  }

  const running = await isComposeRunning(infraDir)
  if (running) {
    console.log(chalk.dim('  Infrastructure is already running.'))
    return
  }

  console.log(chalk.cyan('\n  Starting infrastructure...\n'))
  const ok = await composeUp(infraDir, 'Starting services')
  if (ok) {
    console.log(chalk.green('  ✓ Infrastructure started.'))
  } else {
    console.log(chalk.red('  ✗ Failed to start infrastructure.'))
    console.log(chalk.dim(`    Try manually: cd ${infraDir} && docker compose up -d`))
  }
}
