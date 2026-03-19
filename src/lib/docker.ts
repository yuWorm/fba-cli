// docker.ts — Docker Compose 操作
import { run, checkCommand } from './process.js'

/**
 * 检查 Docker 是否可用
 */
export async function isDockerAvailable(): Promise<boolean> {
  const result = await checkCommand('docker', ['info'])
  return result.found
}

/**
 * 启动 docker compose 服务
 */
export async function composeUp(cwd: string, label?: string): Promise<boolean> {
  const result = await run('docker', ['compose', 'up', '-d'], {
    cwd,
    spinner: true,
    label: label ?? 'Starting infrastructure',
  })
  return result.exitCode === 0
}

/**
 * 停止 docker compose 服务
 */
export async function composeDown(cwd: string, label?: string): Promise<boolean> {
  const result = await run('docker', ['compose', 'down'], {
    cwd,
    spinner: true,
    label: label ?? 'Stopping infrastructure',
  })
  return result.exitCode === 0
}

/**
 * 检查 docker compose 服务是否运行中
 */
export async function isComposeRunning(cwd: string): Promise<boolean> {
  const result = await run('docker', ['compose', 'ps', '--status', 'running', '-q'], {
    cwd,
    spinner: false,
    stdio: 'pipe',
  })
  return result.exitCode === 0 && result.stdout.trim().length > 0
}
