/**
 * Convert
 */
import { Editor, generateJSON } from '@tiptap/core'

export const toJSON = (editor: Editor, html: string): Record<string, any> => {
  return generateJSON(html, editor.extensionManager.extensions)
}
