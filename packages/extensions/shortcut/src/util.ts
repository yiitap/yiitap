import { Editor, generateHTML, generateJSON } from '@tiptap/core'

const isMarkdown = (text: string, threshold = 0.25): boolean => {
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
  ]

  // Score
  let score = 0
  for (const line of lines) {
    if (patterns.some((p) => p.test(line.trim()))) score++
  }
  const ratio = score / lines.length

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
