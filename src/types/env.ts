// 环境检测结果类型

export interface EnvCheckResult {
  name: string
  command: string
  found: boolean
  version?: string
  required: boolean
}

export interface EnvCheckSummary {
  python: EnvCheckResult
  uv: EnvCheckResult
  pnpm: EnvCheckResult
  npm: EnvCheckResult
  docker: EnvCheckResult
}
