// plugin-market.ts — 插件市场数据获取 & 解析
import { ofetch } from 'ofetch'
import type { PluginData } from '../types/plugin.js'

const PLUGIN_DATA_URL =
  'https://raw.githubusercontent.com/fastapi-practices/plugins/refs/heads/master/plugins-data.ts'

/**
 * 从远程获取并解析插件市场数据
 */
export async function fetchPluginMarketData(): Promise<PluginData[]> {
  const content = await ofetch(PLUGIN_DATA_URL, { responseType: 'text' })

  // 提取 pluginDataList 数组 JSON
  const match = content.match(/pluginDataList[^=]*=\s*(\[[\s\S]*\])/)
  if (!match?.[1]) {
    throw new Error('Failed to parse plugin market data: pluginDataList not found')
  }

  try {
    // TS 文件中的值本身就是合法 JSON
    return JSON.parse(match[1]) as PluginData[]
  } catch (e) {
    throw new Error(`Failed to parse plugin data JSON: ${e}`)
  }
}

/**
 * 按关键词搜索插件
 */
export function searchPlugins(plugins: PluginData[], query: string): PluginData[] {
  if (!query.trim()) return plugins
  const q = query.toLowerCase()
  return plugins.filter(p => {
    const plugin = p.plugin
    return (
      plugin.summary.toLowerCase().includes(q) ||
      plugin.description.toLowerCase().includes(q) ||
      plugin.author.toLowerCase().includes(q) ||
      plugin.tags?.some(t => t.toLowerCase().includes(q))
    )
  })
}

/**
 * 按 tag 过滤插件
 */
export function filterByTag(plugins: PluginData[], tag: string): PluginData[] {
  if (!tag || tag === 'all') return plugins
  return plugins.filter(p => p.plugin.tags?.includes(tag as any))
}

/**
 * 按 type 过滤插件
 */
export function filterByType(plugins: PluginData[], type: string): PluginData[] {
  if (!type || type === 'all') return plugins
  return plugins.filter(p => p.plugin.type === type)
}
