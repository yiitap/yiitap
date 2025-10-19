import { Editor, generateHTML, generateJSON } from '@tiptap/core'

const isMarkdown = (text: string, threshold = 0.25): boolean => {
  if (!text || text.trim().length < 2) return false

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return false

  // 常见 Markdown 特征（正则更灵活）
  const patterns = [
    /^#{1,6}\s/, // Heading
    /^[-*+]\s+/, // 无序列表
    /^\d+\.\s+/, // 有序列表
    /^>\s+/, // 引用
    /^```/, // 代码块
    /`[^`]+`/, // 行内代码
    /\*\*[^*]+\*\*/, // 粗体
    /_[^_]+_/, // 斜体
    /\[([^\]]+)\]\([^)]+\)/, // 链接
    /!\[([^\]]*)\]\([^)]+\)/, // 图片
  ]

  // 统计命中率
  let score = 0
  for (const line of lines) {
    if (patterns.some((p) => p.test(line.trim()))) score++
  }

  // 当 Markdown 特征足够多 或 特殊符号密度较高
  const ratio = score / lines.length
  if (ratio >= threshold) return true

  // 辅助：检测全局符号密度
  const symbolCount = (text.match(/[*_`#>[\]]/g) || []).length
  const symbolDensity = symbolCount / text.length

  return symbolDensity > 0.05
}

const jsonToMarkdown = (json: any, editor: Editor) => {
  const markdownParts: string[] = []
  const nodes = Array.isArray(json) ? json : [json]
  for (const node of nodes) {
    try {
      const md = editor.markdown?.serialize(node)
      if (md) {
        markdownParts.push(md.trim())
      } else {
        console.warn('Failed to serialize: ', node)
      }
    } catch (err) {
      console.error('Failed to serialize.', err)
    }
  }
  return markdownParts.join('\n\n')
}

const jsonToHTML = (json: any, editor: Editor) => {
  const doc = Array.isArray(json) ? { type: 'doc', content: json } : json
  const extensions = editor.extensionManager.extensions
  const filteredExtensions = extensions.filter((e) => e.name !== 'starterKit')

  return generateHTML(doc, filteredExtensions)
}

const htmlToJSON = (html: string, editor: Editor) => {
  const extensions = editor.extensionManager.extensions
  const filteredExtensions = extensions.filter((e) => e.name !== 'starterKit')

  return generateJSON(html, filteredExtensions)
}

export { isMarkdown, jsonToMarkdown, jsonToHTML, htmlToJSON }
