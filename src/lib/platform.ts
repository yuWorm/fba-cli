// platform.ts — 跨平台适配工具
export const isWindows = process.platform === 'win32'

/**
 * 获取 Python 命令名
 * Windows: python, Unix: python3
 */
export function getPythonCommand(): string {
  return isWindows ? 'python' : 'python3'
}

/**
 * 获取默认 Shell
 * Windows: COMSPEC 或 cmd.exe, Unix: SHELL 或 /bin/sh
 */
export function getDefaultShell(): string {
  if (isWindows) return process.env.COMSPEC || 'cmd.exe'
  return process.env.SHELL || '/bin/sh'
}

/**
 * 获取交互式 Shell 参数
 * Windows 不需要 -i 参数
 */
export function getShellArgs(): string[] {
  return isWindows ? [] : ['-i']
}

/**
 * 获取默认编辑器
 * Windows: notepad, Unix: vi
 */
export function getDefaultEditor(): string {
  return process.env.EDITOR ?? process.env.VISUAL
    ?? (isWindows ? 'notepad' : 'vi')
}

/**
 * 获取 uv 安装命令
 * Windows: PowerShell 脚本, Unix: curl | sh
 */
export function getUvInstaller(): { cmd: string; args: string[] } {
  if (isWindows) {
    return {
      cmd: 'powershell',
      args: ['-ExecutionPolicy', 'Bypass', '-c', 'irm https://astral.sh/uv/install.ps1 | iex'],
    }
  }
  return {
    cmd: 'sh',
    args: ['-c', 'curl -LsSf https://astral.sh/uv/install.sh | sh'],
  }
}
