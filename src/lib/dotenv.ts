// dotenv.ts — .env 文件读写
import { readFileSync, writeFileSync, existsSync } from 'fs'

/**
 * 解析 .env 文件为 key-value 对象
 */
export function parseEnv(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex < 0) continue
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    // 移除引号
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1)
    }
    result[key] = value
  }
  return result
}

/**
 * 将 key-value 对象序列化为 .env 格式
 */
export function serializeEnv(env: Record<string, string>, groups?: Record<string, string[]>): string {
  if (!groups) {
    return Object.entries(env)
      .map(([k, v]) => `${k}='${v}'`)
      .join('\n')
  }

  const lines: string[] = []
  for (const [groupName, keys] of Object.entries(groups)) {
    lines.push(`# ${groupName}`)
    for (const key of keys) {
      if (key in env) {
        lines.push(`${key}='${env[key]}'`)
      }
    }
    lines.push('')
  }
  return lines.join('\n')
}

/**
 * 读取 .env 文件
 */
export function readEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {}
  return parseEnv(readFileSync(path, 'utf-8'))
}

/**
 * 写入 .env 文件
 */
export function writeEnvFile(path: string, env: Record<string, string>, groups?: Record<string, string[]>): void {
  writeFileSync(path, serializeEnv(env, groups), 'utf-8')
}
