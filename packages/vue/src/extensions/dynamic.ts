/**
 * Extensions Dynamic
 */
// ---------------------------------------------------------
// YiiEditor extension imports
// ---------------------------------------------------------
import {
  // Tiptap
  BackgroundColor,
  Color,
  Details,
  DetailsContent,
  DetailsSummary,
  Emoji,
  Focus,
  FontFamily,
  Highlight,
  Image,
  Link,
  Markdown,
  Mathematics,
  Mention,
  Subscript,
  Superscript,
  TaskItem,
  TaskList,
  TextAlign,
  Typography,
  Underline,
  TextStyle,
  Table,
  TableHeader,
  TableCell,
  TableRow,

  // Yiitap
  OAiBlock,
  OBlockquote,
  OCallout,
  OCodeBlock,
  OColorHighlighter,
  OColonCommand,
  ODetails,
  OHeading,
  OHorizontalRule,
  OImage,
  OLink,
  OParagraph,
  OSelectionDecoration,
  // OShortcut,
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
  BackgroundColor: BackgroundColor.configure({
    types: ['textStyle'],
  }),
  Color,
  Emoji: Emoji.configure({
    emojis: gitHubEmojis,
    enableEmoticons: true,
    suggestion: EmojiSuggestion,
  }),
  Focus,
  FontFamily,
  Highlight: Highlight.configure({
    multicolor: true,
  }),
  Image,
  Link,
  Markdown: Markdown.configure({
    indentation: {
      style: 'space',
      size: 2,
    },
    markedOptions: {
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert \n to <br>
      pedantic: false, // Strict Markdown mode
    },
  }),
  Mathematics,
  Subscript,
  Superscript,
  // task
  TaskItem,
  TaskList: TaskList.configure({
    itemTypeName: 'taskItem',
  }),
  TextAlign: TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
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
  // OShortcut,
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

// Details
export const DetailsExtensions = [
  ODetails.configure({
    persist: true,
    HTMLAttributes: {
      class: 'details',
    },
  }),
  DetailsContent,
  DetailsSummary,
]

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
