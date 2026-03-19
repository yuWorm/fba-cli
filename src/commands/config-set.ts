// config-set.ts — 配置设置（列表选择）
import * as clack from '@clack/prompts'
import chalk from 'chalk'
import { readGlobalConfig, writeGlobalConfig } from '../lib/config.js'
import { setLanguage } from '../lib/i18n.js'

interface ConfigOption {
  key: string
  label: string
  current: () => string
  set: () => Promise<void>
}

export async function configSetAction() {
  const config = readGlobalConfig()

  const options: ConfigOption[] = [
    {
      key: 'language',
      label: '语言 / Language',
      current: () => config.language === 'zh' ? '中文' : 'English',
      set: async () => {
        const lang = await clack.select({
          message: '选择语言 / Select language',
          options: [
            { value: 'zh', label: '中文' },
            { value: 'en', label: 'English' },
          ],
          initialValue: config.language,
        })
        if (clack.isCancel(lang)) return
        config.language = lang as 'zh' | 'en'
        setLanguage(config.language)
        writeGlobalConfig(config)
        clack.log.success(chalk.green(`Language → ${lang === 'zh' ? '中文' : 'English'}`))
      },
    },
    {
      key: 'shell',
      label: 'Shell (fba go)',
      current: () => config.shell ?? `env (${ process.env.SHELL ?? '/bin/sh'})`,
      set: async () => {
        const shell = await clack.text({
          message: 'Shell path (留空使用环境默认)',
          placeholder: process.env.SHELL ?? '/bin/zsh',
          defaultValue: '',
        })
        if (clack.isCancel(shell)) return
        config.shell = (shell as string).trim() || undefined
        writeGlobalConfig(config)
        clack.log.success(chalk.green(`Shell → ${config.shell ?? 'env default'}`))
      },
    },
    {
      key: 'current',
      label: '默认项目 / Default project',
      current: () => {
        const p = config.projects.find(p => p.path === config.current)
        return p ? p.name : config.current ?? 'none'
      },
      set: async () => {
        if (config.projects.length === 0) {
          clack.log.info('暂无已注册项目')
          return
        }
        const project = await clack.select({
          message: '选择默认项目',
          options: config.projects.map(p => ({
            value: p.path,
            label: p.name,
            hint: p.path,
          })),
        })
        if (clack.isCancel(project)) return
        config.current = project as string
        writeGlobalConfig(config)
        const name = config.projects.find(p => p.path === project)?.name ?? project
        clack.log.success(chalk.green(`Default project → ${name}`))
      },
    },
  ]

  // 展示可设置的选项
  const selected = await clack.select({
    message: '选择要设置的配置项 / Select setting',
    options: options.map(o => ({
      value: o.key,
      label: o.label,
      hint: o.current(),
    })),
  })

  if (clack.isCancel(selected)) return

  const opt = options.find(o => o.key === selected)
  if (opt) await opt.set()
}
