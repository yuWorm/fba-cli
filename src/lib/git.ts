// git.ts — Git 操作
import { run } from './process.js'

/**
 * 克隆 Git 仓库
 */
export async function gitClone(
  url: string,
  targetDir: string,
  options?: { branch?: string; label?: string; spinner?: boolean },
): Promise<boolean> {
  const args = ['clone']
  if (options?.branch) {
    args.push('-b', options.branch)
  }
  args.push('--depth', '1', url, targetDir)

  const result = await run('git', args, {
    spinner: options?.spinner ?? true,
    label: options?.label ?? `Cloning ${url}`,
  })

  return result.exitCode === 0
}

/**
 * 在指定目录初始化 Git 仓库
 */
export async function gitInit(dir: string, branch: string = 'master'): Promise<boolean> {
  const result = await run('git', ['init', '-b', branch], {
    cwd: dir,
    spinner: false,
    stdio: 'pipe',
  })
  return result.exitCode === 0
}

/**
 * 删除 .git 目录（用于模板脱离源仓库）
 */
export async function removeGitDir(dir: string): Promise<void> {
  const { rmSync } = await import('fs')
  const { join } = await import('path')
  try {
    rmSync(join(dir, '.git'), { recursive: true, force: true })
  } catch {
    // ignore
  }
}
