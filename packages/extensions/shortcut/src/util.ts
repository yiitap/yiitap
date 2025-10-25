import { Editor, generateHTML, generateJSON } from '@tiptap/core'

const isMultiLine = (text: string) => {
  if (!text) return false
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  return lines.length > 1
}

const isMarkdown = (text: string, threshold = 0.2): boolean => {
  if (!text || text.trim().length < 2) return false

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return false

  // Common Markdown patterns (regex is more flexible)
  const patterns = [
    /^#{1,6}\s/, // Heading
    /^[-*+]\s+/, // Unordered list
    /^\d+\.\s+/, // Ordered list
    /^>\s+/, // Blockquote
    /^```/, // Code block
    /`[^`]+`/, // Inline code
    /\*\*[^*]+\*\*/, // Bold
    /_[^_]+_/, // Italic
    /\[([^\]]+)\]\([^)]+\)/, // Link
    /!\[([^\]]*)\]\([^)]+\)/, // Image
    /<video\b[^>]*>/i, // Video (HTML <video> tag)
    /<\/video>/i, // Video (HTML <video> tag)
    /^(\|.+\|)$/, // Table row
    /^(\|?[\s-:|]+\|[\s-:|]+)$/, // Table separator row
    /\$\$[\s\S]+?\$\$/, // Block math: $$ ... $$
    /\$[^$]+\$/, // Inline math: $...$
    /\\\([^)]+\\\)/, // Inline math: \( ... \)
    /\\\[[\s\S]+?\\\]/, // Block math: \[ ... \]
  ]

  // Score
  let score = 0
  for (const line of lines) {
    if (patterns.some((p) => p.test(line.trim()))) score++
  }

  // block math
  if (/\$\$[\s\S]+?\$\$/g.test(text)) score += 3
  let ratio = score / lines.length

  // code block
  if (/```([\s\S]*?)```/g.test(text)) {
    console.log('has code block')
    ratio = 1
  }

  // Density
  const symbolCount = (text.match(/[*_`#>[\]]/g) || []).length
  const symbolDensity = symbolCount / text.length

  console.log('isMarkdown: ', ratio, symbolDensity)
  return ratio >= threshold || symbolDensity > 0.05
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

const excludeExtensions = ['Mathematics', 'starterKit']

const jsonToHTML = (json: any, editor: Editor) => {
  const doc = Array.isArray(json) ? { type: 'doc', content: json } : json
  const extensions = editor.extensionManager.extensions
  const filteredExtensions = extensions.filter(
    (e) => !excludeExtensions.includes(e.name)
  )

  return generateHTML(doc, filteredExtensions)
}

const htmlToJSON = (html: string, editor: Editor) => {
  const extensions = editor.extensionManager.extensions
  const filteredExtensions = extensions.filter(
    (e) => !excludeExtensions.includes(e.name)
  )

  return generateJSON(html, filteredExtensions)
}

const recoverText = (html: string) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  const lines: string[] = []
  const preElement = tempDiv.querySelector('div[style]')

  if (!preElement) return html // 如果不是 VSCode 格式，返回原内容

  // 遍历所有子节点
  for (let i = 0; i < preElement.childNodes.length; i++) {
    const child = preElement.childNodes[i]

    // 正确的类型检查
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element

      if (element.nodeName === 'BR') {
        // 处理空行
        lines.push('')
      } else if (element.nodeName === 'DIV') {
        // 提取 div 中的文本内容
        let lineText = ''
        const spans = element.querySelectorAll('span')

        if (spans.length > 0) {
          // 如果有 span，提取所有 span 的文本
          lineText = Array.from(spans)
            .map((span) => span.textContent || '')
            .join('')
        } else {
          // 直接获取 div 的文本
          lineText = element.textContent || ''
        }

        const trimmed = lineText.trim()
        if (trimmed) {
          lines.push(trimmed)
        }
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      // 处理纯文本节点
      const text = child.textContent?.trim()
      if (text) {
        lines.push(text)
      }
    }
  }

  return lines.join('\n')
}

export {
  isMultiLine,
  isMarkdown,
  jsonToMarkdown,
  jsonToHTML,
  htmlToJSON,
  recoverText,
}
