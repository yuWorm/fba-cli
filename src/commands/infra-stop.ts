// infra-stop.ts — 停止基础设施
import chalk from 'chalk'
import { existsSync } from 'fs'
import { getInfraDir } from '../lib/config.js'
import { requireProjectDir } from '../lib/errors.js'
import { composeDown, isComposeRunning } from '../lib/docker.js'
import { t } from '../lib/i18n.js'

export async function infraStopAction(options: { project?: string }) {
  const projectDir = requireProjectDir(options.project)
  const infraDir = getInfraDir(projectDir)

  if (!existsSync(infraDir)) {
    const { fatal } = await import('../lib/errors.js')
    fatal('Infrastructure directory not found', `Expected at: ${infraDir}`)
  }

  const running = await isComposeRunning(infraDir)
  if (!running) {
    console.log(chalk.dim('  Infrastructure is not running.'))
    return
  }

  console.log(chalk.cyan('\n  Stopping infrastructure...\n'))
  const ok = await composeDown(infraDir, 'Stopping services')
  if (ok) {
    console.log(chalk.green('  ✓ Infrastructure stopped.'))
  } else {
    console.log(chalk.red('  ✗ Failed to stop infrastructure.'))
    console.log(chalk.dim(`    Try manually: cd ${infraDir} && docker compose down`))
  }
}
