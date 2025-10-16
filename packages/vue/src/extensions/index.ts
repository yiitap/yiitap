// ---------------------------------------------------------
// Tiptap extensions imports
// ---------------------------------------------------------
import { Focus } from '@tiptap/extensions'
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from '@tiptap/extension-details'
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from '@tiptap/extension-table'
import { TextStyle } from '@tiptap/extension-text-style'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import BackColor from '@tiptap/extension-highlight'
import Document from '@tiptap/extension-document'
import Emoji from '@tiptap/extension-emoji'
import FontFamily from '@tiptap/extension-font-family'
import ForeColor from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'

// ---------------------------------------------------------
// YiiEditor extension imports
// ---------------------------------------------------------
// Extension lib
import OColorHighlighter from '@yiitap/extension-color-highlighter'
import OFocus from '@yiitap/extension-focus'
import OPlaceholder from '@yiitap/extension-placeholder'
import OSelectionDecoration from '@yiitap/extension-selection-decoration'
import OTable from '@yiitap/extension-table'
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
  'BackColor',
  'Focus',
  'FontFamily',
  'ForeColor',
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
  'BackColor',
  'Bold',
  'BulletList',
  'Code',
  'CodeBlockLowlight',
  'Emoji',
  'Focus',
  'FontFamily',
  'ForeColor',
  'HorizontalRule',
  'Image',
  'Italic',
  'Link',
  'ListItem',
  'Mention',
  'OrderedList',
  'Strike',
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
  // 'OKatexBlock',
  // 'OKatexInline',
  'OLink',
  'OParagraph',
  'OSelectionDecoration',
  'OSlash',
  'OSlashZh',
  'OTableWrapper',
  'OTrailingNode',
  'OUniqueID',
  'OVideo',
]

export const BuiltinExtensionNames = [
  ...TiptapExtensionNames,
  ...YiitapExtensionNames,
]

export const BuiltinExtensions = [
  BackColor,
  Details,
  DetailsContent,
  DetailsSummary,
  Document,
  Emoji,
  Focus,
  FontFamily,
  ForeColor,
  Link,
  Mention,
  TableRow,
  TaskItem,
  TaskList,
  Text,
  TextAlign,
  TextStyle,
  Typography,
  Underline,

  OAiBlock,
  OBlockquote,
  OColorHighlighter,
  OCallout,
  OCharCommand,
  OCodeBlock,
  ODetails,
  OHeading,
  OHorizontalRule,
  OImage,
  OParagraph,
  OPlaceholder,
  OSelectionDecoration,
  OTable,
  OTableCell,
  OTableHeader,
  OTableWrapper,
  OTrailingNode,
  OUniqueID,
  OVideo,
]

export {
  BackColor,
  Details,
  DetailsContent,
  DetailsSummary,
  Document,
  Emoji,
  Focus,
  FontFamily,
  ForeColor,
  Image,
  Link,
  Mention,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TaskItem,
  TaskList,
  Text,
  TextAlign,
  TextStyle,
  Typography,
  Underline,
  OAiBlock,
  OBlockquote,
  OCallout,
  OCharCommand,
  OCodeBlock,
  OColonCommand,
  OColorHighlighter,
  ODetails,
  OFocus,
  OSelectionDecoration,
  OSlashCommand,
  OSlashZhCommand,
  OHeading,
  OHorizontalRule,
  OImage,
  OLink,
  OParagraph,
  OPlaceholder,
  OTable,
  OTableCell,
  OTableHeader,
  OTableWrapper,
  OTrailingNode,
  OUniqueID,
  OVideo,
}
