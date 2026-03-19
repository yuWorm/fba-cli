// edit.ts — 编辑全局配置
import { getGlobalConfigPath } from '../lib/config.js'
import { runInherited } from '../lib/process.js'

export async function editAction() {
  const editor = process.env.EDITOR ?? process.env.VISUAL ?? 'vi'
  const configPath = getGlobalConfigPath()
  console.log(`Opening ${configPath} with ${editor}...`)
  await runInherited(editor, [configPath])
}
