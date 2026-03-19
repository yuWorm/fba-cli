// 插件类型定义

/** 插件市场远程插件数据 */
export interface PluginData {
  plugin: PluginMarketInfo
  git: GitModule
}

export interface PluginMarketInfo {
  icon: string
  summary: string
  version: string
  description: string
  author: string
  type: PluginType
  tags?: PluginTag[]
  database?: DatabaseType[]
}

export interface GitModule {
  path: string
  url: string
  branch: string
}

/** 本地 plugin.toml 中的插件信息 */
export interface PluginInfo {
  icon: string
  summary: string
  version: string
  description: string
  author: string
  type: PluginType
  tags: PluginTag[]
  database?: DatabaseType[]
}

/** 后端应用级 plugin.toml */
export interface BackendAppPluginToml {
  plugin: PluginInfo
  app: { router: string[] }
  settings?: Record<string, unknown>
}

/** 后端扩展级 plugin.toml */
export interface BackendExtPluginToml {
  plugin: PluginInfo
  app: { extend: string }
  api: Record<string, { prefix: string; tags: string }>
  settings?: Record<string, unknown>
}

/** 前端 plugin.toml */
export interface FrontendPluginToml {
  plugin: PluginInfo
}

export type PluginType = 'web' | 'server'
export type PluginTag = 'ai' | 'mcp' | 'agent' | 'auth' | 'storage' | 'notification' | 'task' | 'payment' | 'other'
export type DatabaseType = 'mysql' | 'postgresql'
export type ServerPluginLevel = 'app' | 'ext'

export const VALID_TAGS: PluginTag[] = ['ai', 'mcp', 'agent', 'auth', 'storage', 'notification', 'task', 'payment', 'other']
export const VALID_DATABASES: DatabaseType[] = ['mysql', 'postgresql']

/** 已安装的本地插件信息 */
export interface InstalledPlugin {
  name: string
  dir: string
  type: PluginType
  info: PluginInfo
}
