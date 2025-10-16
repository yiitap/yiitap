/**
 * Extensions Dynamic
 */
// ---------------------------------------------------------
// YiiEditor extension imports
// ---------------------------------------------------------
import {
  // Tiptap
  BackColor,
  Document,
  Emoji,
  Focus,
  FontFamily,
  ForeColor,
  Image,
  Link,
  Mention,
  TaskItem,
  TaskList,
  TextAlign,
  Typography,
  Underline,
  Text,
  Table,
  TableHeader,
  TableCell,
  TableRow,

  // Yiitap
  OAiBlock,
  OBlockquote,
  OCallout,
  OCharCommand,
  OCodeBlock,
  OColorHighlighter,
  OColonCommand,
  // OFocus,
  OHeading,
  OHorizontalRule,
  OImage,
  OLink,
  OParagraph,
  OSelectionDecoration,
  OSlashCommand,
  OSlashZhCommand,
  OTable,
  OTableCell,
  OTableHeader,
  OTableWrapper,
  OTrailingNode,
  OUniqueID,
  OVideo,
  BuiltinExtensionNames,
} from './index'

// ---------------------------------------------------------
// Classes and configuration
// ---------------------------------------------------------
import ColonSuggestion from './char-command/colon/suggestion'
import SlashSuggestion from './char-command/slash/suggestion'
import EmojiSuggestion from './char-command/emoji/suggestion'
import { gitHubEmojis } from '@tiptap/extension-emoji'
const classes: Indexable = {
  // default
  BackColor: BackColor.configure({
    multicolor: true,
  }),
  Emoji: Emoji.configure({
    emojis: gitHubEmojis,
    enableEmoticons: true,
    suggestion: EmojiSuggestion,
  }),
  Focus,
  ForeColor,
  FontFamily,
  Image,
  Link,
  // task
  TaskItem,
  TaskList: TaskList.configure({
    itemTypeName: 'taskItem',
  }),
  TextAlign: TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
  Typography,

  // Custom extensions
  OAiBlock: OAiBlock,
  OColon: OColonCommand.configure({
    suggestion: ColonSuggestion,
  }),
  OSlash: OSlashCommand.configure({
    suggestion: SlashSuggestion,
  }),
  OSlashZh: OSlashZhCommand.configure({
    suggestion: SlashSuggestion,
  }),
  // OTOC: TOC,
  // OModelViewer: ModelViewer,
  OBlockquote: OBlockquote.configure({
    triggerCharacters: ['"', '“', '”'],
  }),
  OCallout,
  OCodeBlock,
  OColorHighlighter,
  OHeading,
  OHorizontalRule,
  OImage,
  OLink: OLink.configure({
    openOnClick: false,
  }),
  OParagraph,
  OSelectionDecoration,
  OTrailingNode,
  // OColumnExtension: ColumnExtension,
  OUniqueID: OUniqueID.configure({
    attributeName: 'data-id',
    enableRender: false,
    types: [
      'blockquote',
      'codeBlock',
      'callout',
      'heading',
      'image',
      'paragraph',
      'table-wrapper',
      'video',
    ],
  }),
  OVideo,
}

class DynamicClass {
  constructor(name: string) {
    return classes[name]
  }
}

export default DynamicClass

export const getDynamicExtension = (name: string) => {
  return new DynamicClass(name)
}

// Custom table
export const TableExtensions = [
  OTableWrapper,
  OTable.configure({
    resizable: true,
  }),
  TableRow,
  OTableHeader,
  OTableCell,
]

// Default table
export const DefaultTableExtensions = [
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
]
