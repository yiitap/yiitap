/**
 * Extensions Dynamic
 */
// ---------------------------------------------------------
// Tiptap extensions imports
// ---------------------------------------------------------
import BackColor from '@tiptap/extension-highlight'
import Focus from '@tiptap/extension-focus'
import FontFamily from '@tiptap/extension-font-family'
import ForeColor from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TableRow from '@tiptap/extension-table-row'

// ---------------------------------------------------------
// YiiEditor extension imports
// ---------------------------------------------------------
import {
	OBlockquote,
	OCallout,
	OCodeBlock,
	OColorHighlighter,
	OColonCommand,
	// OFocus,
	OHeading,
	OHorizontalRule,
	OImage,
	OLink,
	OParagraph,
	OSlashCommand,
	OSlashZhCommand,
	OTable,
	OTableCell,
	OTableHeader,
	OTableWrapper,
	OTrailingNode,
	OUniqueID,
	OVideo,
} from './index'

// ---------------------------------------------------------
// Classes and configuration
// ---------------------------------------------------------
import SlashSuggestion from './char-command/slash/suggestion'
import EmojiSuggestion from './char-command/emoji/suggestion'
const classes: Indexable = {
	// default
	BackColor: BackColor.configure({
		multicolor: true,
	}),
	Focus,
	ForeColor,
	FontFamily,
	Image,
	Link,
	TextAlign: TextAlign.configure({
		types: ['heading', 'paragraph'],
	}),
	// task
	TaskItem,
	TaskList: TaskList.configure({
		itemTypeName: 'taskItem',
	}),
	Underline,
	Typography,

	// Custom extensions
	OColon: OColonCommand.configure({
		suggestion: EmojiSuggestion,
	}),
	OSlash: OSlashCommand.configure({
		suggestion: SlashSuggestion,
	}),
	OSlashZh: OSlashZhCommand.configure({
		suggestion: SlashSuggestion,
	}),
	// OTOC: TOC,
	// OModelViewer: ModelViewer,
	OBlockquote,
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
	OTrailingNode,
	// OColumnExtension: ColumnExtension,
	// OColon: Colon.configure({
	//   suggestion: colonSuggestion
	// }),
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
export const TableExtensions0 = [
	Table.configure({
		resizable: true,
	}),
	TableRow,
	TableHeader,
	TableCell,
]
