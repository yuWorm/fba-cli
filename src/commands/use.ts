// use.ts — 切换默认项目
import * as clack from '@clack/prompts'
import chalk from 'chalk'
import { readGlobalConfig, setCurrentProject } from '../lib/config.js'
import { t } from '../lib/i18n.js'

export async function useAction() {
  const config = readGlobalConfig()

  if (config.projects.length === 0) {
    console.log(chalk.dim(t('projectListEmpty')))
    return
  }

  const project = await clack.select({
    message: t('projectSelect'),
    options: config.projects.map(p => ({
      value: p.path,
      label: p.name,
      hint: p.path,
    })),
  })

  if (clack.isCancel(project)) return

  setCurrentProject(project as string)
  const name = config.projects.find(p => p.path === project)?.name ?? project
  console.log(chalk.green(`${t('projectSwitched')} ${name}`))
}
