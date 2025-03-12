export { default as OColorHighlighter } from '@yiitap/extension-color-highlighter'
export { default as OFocus } from '@yiitap/extension-focus'
export { default as OPlaceholder } from '@yiitap/extension-placeholder'
export { default as OTable } from '@yiitap/extension-table'
export { default as OTrailingNode } from '@yiitap/extension-trailing-node'

export { default as OBlockquote } from './blockquote'
export { default as OCallout } from './callout'
export { default as OCodeBlock } from './code-block'
export { default as OHeading } from './heading'
export { default as OHorizontalRule } from './horizontal-rule'
export { default as OImage } from './image'
export { default as OLink } from './link'
export { default as OParagraph } from './paragraph'
export { default as OTableCell } from './table-cell'
export { default as OTableHeader } from './table-header'
export { default as OTableWrapper } from './table-wrapper'
export { default as OUniqueID } from './unique-id-simple'
export { default as OVideo } from './video'

// --------------------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------------------
export const DefaultExtensions = [
	'BackColor',
	'Focus',
	'FontFamily',
	'ForeColor',
	'Table',
	'TaskItem',
	'TaskList',
	'TextAlign',
	'Typography',
	'Underline',

	'OHorizontalRule',
	'OUniqueID',
]

// --------------------------------------------------------------------------------
// Exposed Extension List
// --------------------------------------------------------------------------------
export const TipTapExtensions = [
	'BackColor',
	'Blockquote',
	'Bold',
	'BulletList',
	'Code',
	'CodeBlockLowlight',
	'Focus',
	'FontFamily',
	'ForeColor',
	'HorizontalRule',
	'Image',
	'Italic',
	'Link',
	'ListItem',
	'OrderedList',
	'Strike',
	'Table',
	'TaskItem',
	'TaskList',
	'TextAlign',
	'Typography',
	'Underline',
]

export const ExtendedExtensions = [
	'OBlockquote',
	'OCallout',
	'OCodeBlock',
	'OColon',
	'OColorHighlighter',
	'OColumnExtension',
	'ODiagram',
	'ODoc',
	'ODraggableItem',
	'OEmbed',
	'OFocus',
	'OFontFamily',
	'OFormatClear',
	'OHeading',
	'OHorizontalRule',
	'OIframe',
	'OImage',
	'OIndent',
	'OInsertHtml',
	'OKatexBlock',
	'OKatexInline',
	'OLineHeight',
	'OLink',
	'OModelViewer',
	'OParagraph',
	'OPrint',
	'OSlash',
	'OSlashZh',
	'OTOC',
	'OTableWrapper',
	'OTitle',
	'OTodoItem',
	'OTrailingNode',
	'OUniqueID',
	'OVideo',
]

export const BuiltinExtensions = [...TipTapExtensions, ...ExtendedExtensions]
