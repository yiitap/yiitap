// ---------------------------------------------------------
// Tiptap extensions imports
// ---------------------------------------------------------
import { Focus } from '@tiptap/extensions'
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from '@tiptap/extension-details'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { BlockMath, InlineMath } from '@tiptap/extension-mathematics'
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from '@tiptap/extension-table'
import {
  BackgroundColor,
  Color,
  FontFamily,
  TextStyle,
} from '@tiptap/extension-text-style'
import { Markdown } from '@tiptap/markdown'
import Highlight from '@tiptap/extension-highlight'
import Emoji from '@tiptap/extension-emoji'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'

// ---------------------------------------------------------
// YiiEditor extension imports
// ---------------------------------------------------------
// Extension lib
import OColorHighlighter from '@yiitap/extension-color-highlighter'
import OFocus from '@yiitap/extension-focus'
import OInlinePlaceholder from '@yiitap/extension-inline-placeholder'
import OPlaceholder from '@yiitap/extension-placeholder'
import OSelectionDecoration from '@yiitap/extension-selection-decoration'
import OShortcut from '@yiitap/extension-shortcut'
import OTable from '@yiitap/extension-table'
import OTaskItem from '@yiitap/extension-task-item'
import OTrailingNode from '@yiitap/extension-trailing-node'
import OUniqueID from '@yiitap/extension-unique-id'

import OCharCommand from '@yiitap/extension-char-command'
import {
  ColonCommand as OColonCommand,
  SlashCommand as OSlashCommand,
  SlashZhCommand as OSlashZhCommand,
} from '@yiitap/extension-char-command'

// Extension local
import OAiBlock from './ai-block'
import OBlockMath from './block-math'
import OBlockquote from './blockquote'
import OCallout from './callout'
import OCodeBlock from './code-block'
import ODetails from './details'
import OHeading from './heading'
import OHorizontalRule from './horizontal-rule'
import OImage from './image'
import OLink from './link'
import OParagraph from './paragraph'
import OTableCell from './table-cell'
import OTableHeader from './table-header'
import OTableWrapper from './table-wrapper'
import OVideo from './video'

// ---------------------------------------------------------
// Extensions
// ---------------------------------------------------------
/**
 * Enable by default
 */
export const DefaultExtensionNames = [
  'Highlight',
  'BackgroundColor',
  'Color',
  'Focus',
  'FontFamily',
  'Subscript',
  'Superscript',
  'Table',
  'TaskItem',
  'TaskList',
  'TextAlign',
  'TextStyle',
  'Typography',

  'OHorizontalRule',
  'OSelectionDecoration',
  'OUniqueID',
]

// --------------------------------------------------------------------------------
// Exposed Extension List
// --------------------------------------------------------------------------------
export const TiptapExtensionNames = [
  'Highlight',
  'BackgroundColor',
  'BlockMath',
  'Bold',
  'BulletList',
  'Color',
  'Code',
  'CodeBlockLowlight',
  'Emoji',
  'Focus',
  'FontFamily',
  'HorizontalRule',
  'Image',
  'InlineMath',
  'Italic',
  'Link',
  'ListItem',
  'Markdown',
  'Mention',
  'OrderedList',
  'Strike',
  'Subscript',
  'Superscript',
  'Table',
  'TaskItem',
  'TaskList',
  'TextAlign',
  'TextStyle',
  'Typography',
  'Underline',
]

export const YiitapExtensionNames = [
  'OAiBlock',
  'OBlockMath',
  'OBlockquote',
  'OCallout',
  'OCharCommand',
  'OCodeBlock',
  'OColon',
  'OColorHighlighter',
  'ODetails',
  // 'ODiagram',
  'OFocus',
  'OHeading',
  'OHorizontalRule',
  'OImage',
  'OInlinePlaceholder',
  // 'OKatexBlock',
  // 'OKatexInline',
  'OLink',
  'OParagraph',
  'OSelectionDecoration',
  'OShortcut',
  'OSlash',
  'OSlashZh',
  'OTableWrapper',
  'OTaskItem',
  'OTrailingNode',
  'OUniqueID',
  'OVideo',
]

export const BuiltinExtensionNames = [
  ...TiptapExtensionNames,
  ...YiitapExtensionNames,
]

export {
  BackgroundColor,
  BlockMath,
  Color,
  Details,
  DetailsContent,
  DetailsSummary,
  Emoji,
  Focus,
  FontFamily,
  Highlight,
  Image,
  InlineMath,
  Link,
  Markdown,
  Mention,
  Subscript,
  Superscript,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TaskItem,
  TaskList,
  TextAlign,
  TextStyle,
  Typography,
  Underline,
  OAiBlock,
  OBlockMath,
  OBlockquote,
  OCallout,
  OCharCommand,
  OCodeBlock,
  OColonCommand,
  OColorHighlighter,
  ODetails,
  OFocus,
  OInlinePlaceholder,
  OHeading,
  OHorizontalRule,
  OImage,
  OLink,
  OParagraph,
  OPlaceholder,
  OSelectionDecoration,
  OShortcut,
  OSlashCommand,
  OSlashZhCommand,
  OTable,
  OTableCell,
  OTableHeader,
  OTableWrapper,
  OTaskItem,
  OTrailingNode,
  OUniqueID,
  OVideo,
}
