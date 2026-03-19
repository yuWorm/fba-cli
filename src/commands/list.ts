// list.ts — 列出所有项目
import chalk from 'chalk'
import { readGlobalConfig } from '../lib/config.js'
import { t } from '../lib/i18n.js'

export async function listAction() {
  const config = readGlobalConfig()

  if (config.projects.length === 0) {
    console.log(chalk.dim(t('projectListEmpty')))
    return
  }

  console.log()
  console.log(chalk.bold(` ${t('projectListTitle')}`))
  console.log(chalk.dim(' ─'.repeat(25)))

  for (const p of config.projects) {
    const isCurrent = p.path === config.current
    const marker = isCurrent ? chalk.green('*') : ' '
    const name = isCurrent ? chalk.green.bold(p.name) : p.name
    console.log(`  ${marker} ${name}  ${chalk.dim(p.path)}`)
  }

  console.log(chalk.dim(' ─'.repeat(25)))
  console.log(chalk.dim(`  * = ${t('projectCurrent')}`))
  console.log()
}
