/**
 * Convert
 */
import { generateJSON } from '@tiptap/core'
import { BuiltinExtensions } from '../extensions'

export const toJSON = (html: string): Record<string, any> => {
  return generateJSON(html, BuiltinExtensions as any[])
}
