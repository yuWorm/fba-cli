// current.ts — 显示当前默认项目
import chalk from 'chalk'
import { readGlobalConfig } from '../lib/config.js'
import { t } from '../lib/i18n.js'

export async function currentAction() {
  const config = readGlobalConfig()

  if (!config.current) {
    console.log(chalk.dim(t('projectNoCurrent')))
    return
  }

  const project = config.projects.find(p => p.path === config.current)
  if (project) {
    console.log(`${t('projectCurrent')}: ${chalk.green.bold(project.name)} ${chalk.dim(`(${project.path})`)}`)
  } else {
    console.log(`${t('projectCurrent')}: ${chalk.dim(config.current)}`)
  }
}
